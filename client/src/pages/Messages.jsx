import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, Send, ArrowLeft, MessageSquare, Search, User, Info, MoreVertical, Clock, Users, X, Plus, UserMinus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MessageSkeleton } from '../components/Skeleton';
import Skeleton from '../components/Skeleton';
import { useSocket } from '../context/SocketContext';

const isGroupConversation = (conv) => conv.type === 'group';

const getConversationName = (conv, currentUserId) => {
  if (conv.type === 'group') return conv.name || 'Unnamed Group';
  const other = conv.participants?.find((p) => (p._id || p) !== currentUserId);
  return other?.name || 'Unknown';
};

const getConversationAvatar = (conv, currentUserId) => {
  if (conv.type === 'group') return conv.avatar || null;
  const other = conv.participants?.find((p) => (p._id || p) !== currentUserId);
  return other?.profilePicture || null;
};

const Messages = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [search, setSearch] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [groupSearchResults, setGroupSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participantSearch, setParticipantSearch] = useState('');
  const [participantSearchResults, setParticipantSearchResults] = useState([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await API.get('/messages/conversations');
        setConversations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingConv(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({ message, conversationId }) => {
      if (activeConversation?._id === conversationId) {
        setMessages((prev) => {
          if (prev.find((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
      setConversations((prev) =>
        prev
          .map((c) => {
            if (c._id === conversationId) {
              return { ...c, lastMessage: message, lastMessageAt: message.createdAt };
            }
            return c;
          })
          .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
      );
    };

    const handleTypingStatus = ({ senderId, isTyping: remoteTyping }) => {
      if (!activeConversation || activeConversation.type === 'group') return;
      const otherUser = activeConversation.participants.find((p) => p._id !== user._id);
      if (otherUser?._id === senderId) {
        setIsTyping(remoteTyping);
      }
    };

    const handleNewConversation = ({ conversation }) => {
      setConversations((prev) => {
        if (prev.find((c) => c._id === conversation._id)) return prev;
        return [conversation, ...prev];
      });
    };

    socket.on('new_message', handleNewMessage);
    socket.on('typing_status', handleTypingStatus);
    socket.on('new_conversation', handleNewConversation);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing_status', handleTypingStatus);
      socket.off('new_conversation', handleNewConversation);
    };
  }, [socket, activeConversation, user]);

  useEffect(() => {
    const fetchActiveConversation = async () => {
      if (!id) {
        setActiveConversation(null);
        setIsTyping(false);
        return;
      }

      setLoadingMessages(true);
      try {
        const existing = conversations.find((c) => c._id === id);
        let conversation;

        if (existing) {
          conversation = existing;
        } else {
          const convRes = await API.post(`/messages/conversation/${id}`);
          conversation = convRes.data;
          setConversations((prev) => {
            if (!prev.find((c) => c._id === conversation._id)) {
              return [conversation, ...prev];
            }
            return prev;
          });
        }

        setActiveConversation(conversation);

        const msgRes = await API.get(`/messages/${conversation._id}`);
        setMessages(msgRes.data);
      } catch (err) {
        toast.error('Could not load messages');
        navigate('/messages');
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchActiveConversation();
  }, [id, navigate, conversations]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !activeConversation || activeConversation.type === 'group') return;
    const otherUser = activeConversation.participants.find((p) => p._id !== user._id);
    if (!otherUser) return;
    socket.emit('typing', { receiverId: otherUser._id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { receiverId: otherUser._id });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    if (activeConversation.type !== 'group') {
      const otherUser = activeConversation.participants.find((p) => p._id !== user._id);
      if (socket && otherUser) {
        socket.emit('stop_typing', { receiverId: otherUser._id });
      }
    }

    try {
      const content = newMessage;
      setNewMessage('');

      const tempMessage = {
        _id: 'temp-' + Date.now(),
        content,
        sender: user,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMessage]);

      const { data } = await API.post(`/messages/${activeConversation._id}`, { content });
      setMessages((prev) => prev.map((m) => (m._id === tempMessage._id ? data : m)));

      setConversations((prev) =>
        prev
          .map((c) => {
            if (c._id === activeConversation._id) {
              return { ...c, lastMessage: data, lastMessageAt: data.createdAt };
            }
            return c;
          })
          .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
      );
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (!search.trim()) return true;
    const name = getConversationName(c, user._id);
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const searchUsersForGroup = useCallback(async (query) => {
    if (!query.trim()) {
      setGroupSearchResults([]);
      return;
    }
    setSearchingUsers(true);
    try {
      const { data } = await API.get(`/users/search?search=${encodeURIComponent(query)}&limit=10`);
      setGroupSearchResults(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchingUsers(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsersForGroup(groupSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [groupSearch, searchUsersForGroup]);

  const toggleUserSelection = (u) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((s) => s._id === u._id);
      if (exists) return prev.filter((s) => s._id !== u._id);
      return [...prev, u];
    });
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;
    setCreatingGroup(true);
    try {
      const { data } = await API.post('/messages/conversations/group', {
        name: groupName.trim(),
        participantIds: selectedUsers.map((u) => u._id),
      });
      setConversations((prev) => [data, ...prev]);
      setShowGroupModal(false);
      setGroupName('');
      setGroupSearch('');
      setSelectedUsers([]);
      navigate(`/messages/${data._id}`);
      toast.success('Group created');
    } catch (err) {
      toast.error('Failed to create group');
    } finally {
      setCreatingGroup(false);
    }
  };

  const searchParticipants = useCallback(async (query) => {
    if (!query.trim()) {
      setParticipantSearchResults([]);
      return;
    }
    try {
      const { data } = await API.get(`/users/search?search=${encodeURIComponent(query)}&limit=10`);
      const existingIds = activeConversation?.participants?.map((p) => p._id) || [];
      setParticipantSearchResults((data.users || []).filter((u) => !existingIds.includes(u._id)));
    } catch (err) {
      console.error(err);
    }
  }, [activeConversation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchParticipants(participantSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [participantSearch, searchParticipants]);

  const handleAddParticipants = async (usersToAdd) => {
    try {
      const { data } = await API.put(`/messages/conversations/${activeConversation._id}/participants`, {
        participantIds: usersToAdd.map((u) => u._id),
      });
      setActiveConversation(data);
      setConversations((prev) => prev.map((c) => (c._id === data._id ? data : c)));
      setParticipantSearch('');
      setParticipantSearchResults([]);
      toast.success('Members added');
    } catch (err) {
      toast.error('Failed to add members');
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    try {
      const { data } = await API.delete(`/messages/conversations/${activeConversation._id}/participants`, {
        data: { participantId },
      });
      setActiveConversation(data);
      setConversations((prev) => prev.map((c) => (c._id === data._id ? data : c)));
      toast.success('Member removed');
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-2 lg:px-4 h-[calc(100vh-6.5rem)]">
      <div className="bg-[#0a0f1e]/80 backdrop-blur-3xl rounded-[2.5rem] h-full flex overflow-hidden border border-white/8 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Sidebar */}
        <div className={`w-full sm:w-87.5 border-r border-white/8 flex flex-col z-10 ${id && 'hidden sm:flex'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white tracking-tighter">Messages</h2>
              <button
                onClick={() => setShowGroupModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 text-xs font-bold transition-all"
              >
                <Users className="w-3.5 h-3.5" />
                New Group
              </button>
            </div>
            <div className="relative group">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-white/3 hover:bg-white/5 border border-white/8 focus:border-blue-500/40 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-white placeholder:text-slate-600 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="w-4 h-4 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-400 transition-colors" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
            {loadingConv ? (
              <div className="space-y-2 px-3">
                {[...Array(5)].map((_, i) => (
                  <MessageSkeleton key={i} />
                ))}
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const isGroup = isGroupConversation(conv);
                const convName = getConversationName(conv, user._id);
                const convAvatar = getConversationAvatar(conv, user._id);
                const otherUser = !isGroup ? conv.participants?.find((p) => p._id !== user._id) : null;
                const isActive = activeConversation?._id === conv._id;

                return (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={conv._id}
                    onClick={() => navigate(`/messages/${conv._id}`)}
                    className={`group flex items-center gap-4 p-4 rounded-[1.8rem] cursor-pointer transition-all border ${isActive ? 'bg-blue-600/10 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'hover:bg-white/3 border-transparent'}`}
                  >
                    <div className="relative shrink-0">
                      {convAvatar ? (
                        <img
                          src={convAvatar}
                          alt=""
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/40 transition-all duration-300"
                        />
                      ) : isGroup ? (
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center ring-2 ring-white/10 group-hover:ring-blue-500/40 transition-all duration-300">
                          <Users className="w-5 h-5 text-blue-400" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center ring-2 ring-white/10 group-hover:ring-blue-500/40 transition-all duration-300">
                          <User className="w-5 h-5 text-slate-500" />
                        </div>
                      )}
                      {!isGroup && (
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${otherUser?.isOnline ? 'bg-emerald-500' : 'bg-slate-700'} rounded-full border-[3px] border-[#0d1428] shadow-sm`}
                        />
                      )}
                      {isGroup && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-[3px] border-[#0d1428] shadow-sm flex items-center justify-center">
                          <Users className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4
                          className={`font-black text-sm truncate tracking-tight transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}
                        >
                          {convName}
                        </h4>
                        {conv.lastMessage && (
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                            {new Date(conv.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs truncate font-medium ${isActive ? 'text-blue-300/80' : 'text-slate-500 group-hover:text-slate-400'}`}
                      >
                        {conv.lastMessage
                          ? conv.lastMessage.sender === user._id
                            ? `You: ${conv.lastMessage.content}`
                            : isGroup && conv.lastMessage.sender?.name
                            ? `${conv.lastMessage.sender.name}: ${conv.lastMessage.content}`
                            : conv.lastMessage.content
                          : isGroup
                          ? 'Created group'
                          : 'Start a conversation'}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/3 flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <MessageSquare className="w-6 h-6 text-slate-700" />
                </div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">No conversations</p>
                <p className="text-slate-600 text-[11px] font-bold leading-relaxed px-4">
                  {search ? 'No matches found.' : 'Start a conversation to see messages here.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col z-10 relative ${!id && 'hidden sm:flex'}`}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-white/8 flex items-center justify-between bg-white/1 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate('/messages')} className="sm:hidden p-2 -ml-2 hover:bg-white/8 rounded-xl text-slate-400">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {(() => {
                    const isGroup = isGroupConversation(activeConversation);
                    const convAvatar = getConversationAvatar(activeConversation, user._id);
                    const otherUser = !isGroup ? activeConversation.participants.find((p) => p._id !== user._id) : null;

                    return (
                      <>
                        {convAvatar ? (
                          <img src={convAvatar} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10" alt="" />
                        ) : isGroup ? (
                          <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-400" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
                            <User className="w-5 h-5 text-slate-500" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-black text-white text-lg tracking-tighter leading-none mb-1">
                            {getConversationName(activeConversation, user._id)}
                          </h3>
                          {isGroup ? (
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              {activeConversation.participants.length} members
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${otherUser?.isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-600'}`}
                              ></div>
                              <span
                                className={`text-[10px] font-black uppercase tracking-widest ${otherUser?.isOnline ? 'text-emerald-500/80' : 'text-slate-600'}`}
                              >
                                {otherUser?.isOnline ? 'Online' : 'Offline'}
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="flex gap-2">
                  {isGroupConversation(activeConversation) && (
                    <button
                      onClick={() => setShowParticipantsModal(true)}
                      className="p-2.5 rounded-xl bg-white/3 hover:bg-white/6 border border-white/6 text-slate-500 transition-all"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-linear-to-b from-transparent to-[#0d1428]/20">
                <AnimatePresence initial={false}>
                  {loadingMessages ? (
                    <div className="space-y-6">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                          <Skeleton className={`w-2/3 h-14 rounded-3xl ${i % 2 === 0 ? 'rounded-tr-sm' : 'rounded-tl-sm'}`} />
                        </div>
                      ))}
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => {
                      const isOwn = msg.sender._id === user._id || msg.sender === user._id;
                      const isGroup = isGroupConversation(activeConversation);
                      const showSender = isGroup && !isOwn;

                      return (
                        <motion.div
                          key={msg._id}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="relative group/msg max-w-[80%] flex gap-2.5 items-end">
                            {showSender && (
                              <div className="shrink-0 mb-6">
                                {msg.sender?.profilePicture ? (
                                  <img src={msg.sender.profilePicture} alt="" className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/10" />
                                ) : (
                                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center">
                                    <User className="w-3.5 h-3.5 text-slate-500" />
                                  </div>
                                )}
                              </div>
                            )}
                            <div>
                              {showSender && (
                                <p className="text-[11px] font-bold text-slate-500 mb-1 ml-1">{msg.sender?.name}</p>
                              )}
                              <div
                                className={`px-5 py-3.5 rounded-[1.8rem] shadow-xl ${
                                  isOwn
                                    ? 'bg-linear-to-tr from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-blue-500/10'
                                    : 'bg-white/4 backdrop-blur-md text-slate-200 border border-white/5 rounded-tl-sm shadow-black/20'
                                }`}
                              >
                                <p className="text-[14px] font-medium leading-relaxed wrap-break-word">{msg.content}</p>
                                <div
                                  className={`flex items-center gap-2 justify-end mt-1.5 opacity-40 group-hover/msg:opacity-70 transition-opacity`}
                                >
                                  <Clock className="w-2.5 h-2.5" />
                                  <p className="text-[9px] font-black uppercase tracking-tighter">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30">
                      <div className="w-20 h-20 rounded-3xl bg-white/4 border border-white/5 flex items-center justify-center mb-6">
                        <MessageSquare className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="font-black text-xs uppercase tracking-[0.3em] text-white">Send a message</p>
                    </div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isTyping && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex justify-start">
                      <div className="bg-blue-600/10 px-5 py-3 rounded-3xl rounded-tl-sm border border-blue-500/20 flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        </div>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Typing...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-white/8 bg-white/1 backdrop-blur-md">
                <form onSubmit={handleSendMessage} className="flex gap-4 relative">
                  <div className="relative flex-1 group">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleInputChange}
                      placeholder="Type a message..."
                      className="w-full bg-white/4 hover:bg-white/6 border border-white/8 focus:border-blue-500/40 rounded-3xl py-4 pl-6 pr-14 text-[14px] text-white font-bold placeholder:text-slate-600 outline-none transition-all shadow-inner"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={!newMessage.trim()}
                        type="submit"
                        className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-30 disabled:bg-slate-700 transition-all border border-white/10"
                      >
                        <Send className="w-4 h-4 ml-0.5" />
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-12 relative overflow-hidden">
              <div className="text-center relative z-10">
                <div className="w-24 h-24 rounded-[2.5rem] bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-2xl relative">
                  <MessageSquare className="w-10 h-10 text-white" />
                  <div className="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-xl -z-10 animate-pulse"></div>
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Welcome</h2>
                <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                  Choose a conversation from the sidebar or start a new one.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Group Modal */}
      <AnimatePresence>
        {showGroupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowGroupModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1428] border border-white/8 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/8 flex items-center justify-between">
                <h3 className="text-lg font-black text-white tracking-tight">New Group</h3>
                <button onClick={() => setShowGroupModal(false)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name..."
                    className="w-full bg-white/4 border border-white/8 focus:border-blue-500/40 rounded-xl py-3 px-4 text-sm text-white font-bold placeholder:text-slate-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Add Members</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={groupSearch}
                      onChange={(e) => setGroupSearch(e.target.value)}
                      placeholder="Search users..."
                      className="w-full bg-white/4 border border-white/8 focus:border-blue-500/40 rounded-xl py-3 pl-10 pr-4 text-sm text-white font-bold placeholder:text-slate-600 outline-none transition-all"
                    />
                  </div>
                  {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedUsers.map((u) => (
                        <button
                          key={u._id}
                          onClick={() => toggleUserSelection(u)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600/15 border border-blue-500/20 text-blue-400 text-xs font-bold transition-all hover:bg-blue-600/25"
                        >
                          {u.name}
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                  {groupSearchResults.length > 0 && (
                    <div className="mt-2 max-h-40 overflow-y-auto custom-scrollbar space-y-1 bg-white/2 rounded-xl border border-white/5 p-1">
                      {groupSearchResults.map((u) => {
                        const isSelected = selectedUsers.some((s) => s._id === u._id);
                        return (
                          <button
                            key={u._id}
                            onClick={() => toggleUserSelection(u)}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${isSelected ? 'bg-blue-600/15 border border-blue-500/20' : 'hover:bg-white/5 border border-transparent'}`}
                          >
                            {u.profilePicture ? (
                              <img src={u.profilePicture} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-500" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-white truncate">{u.name}</p>
                              {u.university && <p className="text-[10px] text-slate-600 truncate">{u.university}</p>}
                            </div>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {searchingUsers && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-white/8 flex justify-end gap-3">
                <button
                  onClick={() => setShowGroupModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim() || selectedUsers.length === 0 || creatingGroup}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all disabled:opacity-30 disabled:hover:bg-blue-600 flex items-center gap-2"
                >
                  {creatingGroup && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Group
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Participants Management Modal */}
      <AnimatePresence>
        {showParticipantsModal && activeConversation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowParticipantsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1428] border border-white/8 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/8 flex items-center justify-between">
                <h3 className="text-lg font-black text-white tracking-tight">Members</h3>
                <button onClick={() => { setShowParticipantsModal(false); setParticipantSearch(''); setParticipantSearchResults([]); }} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Add Members</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={participantSearch}
                      onChange={(e) => setParticipantSearch(e.target.value)}
                      placeholder="Search users to add..."
                      className="w-full bg-white/4 border border-white/8 focus:border-blue-500/40 rounded-xl py-3 pl-10 pr-4 text-sm text-white font-bold placeholder:text-slate-600 outline-none transition-all"
                    />
                  </div>
                  {participantSearchResults.length > 0 && (
                    <div className="mt-2 max-h-32 overflow-y-auto custom-scrollbar space-y-1 bg-white/2 rounded-xl border border-white/5 p-1">
                      {participantSearchResults.map((u) => (
                        <button
                          key={u._id}
                          onClick={() => handleAddParticipants([u])}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all text-left border border-transparent"
                        >
                          {u.profilePicture ? (
                            <img src={u.profilePicture} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                              <User className="w-4 h-4 text-slate-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{u.name}</p>
                          </div>
                          <Plus className="w-4 h-4 text-blue-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Current Members ({activeConversation.participants.length})
                  </label>
                  <div className="space-y-1">
                    {activeConversation.participants.map((p) => (
                      <div key={p._id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/2">
                        {p.profilePicture ? (
                          <img src={p.profilePicture} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            {p.name}
                            {p._id === user._id && (
                              <span className="text-[10px] text-slate-600 ml-1.5">(you)</span>
                            )}
                          </p>
                        </div>
                        {p._id !== user._id && p._id !== activeConversation.createdBy && (
                          <button
                            onClick={() => handleRemoveParticipant(p._id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Messages;
