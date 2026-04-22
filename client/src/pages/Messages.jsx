import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, Send, ArrowLeft, MessageSquare, Search, Sparkles, User, Info, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MessageSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import { useSocket } from '../context/SocketContext';
import DOMPurify from 'dompurify';

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
        setMessages(prev => {
          if (prev.find(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
      
      setConversations(prev => prev.map(c => {
        if (c._id === conversationId) {
          return { ...c, lastMessage: message, lastMessageAt: message.createdAt };
        }
        return c;
      }).sort((a,b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)));
    };

    const handleTypingStatus = ({ senderId, isTyping: remoteTyping }) => {
      const otherUser = activeConversation?.participants.find(p => p._id !== user._id);
      if (otherUser?._id === senderId) {
        setIsTyping(remoteTyping);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('typing_status', handleTypingStatus);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing_status', handleTypingStatus);
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
        const convRes = await API.post(`/messages/conversation/${id}`);
        const conversation = convRes.data;
        
        setConversations(prev => {
          if (!prev.find(c => c._id === conversation._id)) {
            return [conversation, ...prev];
          }
          return prev;
        });

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
  }, [id, navigate]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    if (!socket || !activeConversation) return;

    const otherUser = activeConversation.participants.find(p => p._id !== user._id);
    if (!otherUser) return;

    socket.emit('typing', { senderId: user._id, receiverId: otherUser._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { senderId: user._id, receiverId: otherUser._id });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const otherUser = activeConversation.participants.find(p => p._id !== user._id);
    if (socket && otherUser) {
        socket.emit('stop_typing', { senderId: user._id, receiverId: otherUser._id });
    }

    try {
      const content = newMessage;
      setNewMessage('');
      
      const tempMessage = {
        _id: 'temp-' + Date.now(),
        content,
        sender: user,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMessage]);

      const { data } = await API.post(`/messages/${activeConversation._id}`, { content });
      setMessages(prev => prev.map(m => m._id === tempMessage._id ? data : m));
      
      setConversations(prev => prev.map(c => {
        if (c._id === activeConversation._id) {
          return { ...c, lastMessage: data, lastMessageAt: data.createdAt };
        }
        return c;
      }).sort((a,b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)));
      
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const filteredConversations = conversations.filter(c => {
    const otherUser = c.participants.find(p => p._id !== user._id);
    return otherUser?.name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-2 lg:px-4 h-[calc(100vh-6.5rem)]">
      <div className="bg-[#0a0f1e]/80 backdrop-blur-3xl rounded-[2.5rem] h-full flex overflow-hidden border border-white/[0.08] shadow-2xl relative">
        
        {/* Background Accent Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Sidebar: Conversations List */}
        <div className={`w-full sm:w-[350px] border-r border-white/[0.08] flex flex-col z-10 ${id && 'hidden sm:flex'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-black text-white tracking-tighter">Portal Chat</h2>
               <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Sparkles className="w-4 h-4 text-blue-400" />
               </div>
            </div>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Find a scholar..." 
                className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-blue-500/40 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-white placeholder:text-slate-600 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="w-4 h-4 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-400 transition-colors" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
            {loadingConv ? (
               <div className="space-y-2 px-3">
                 {[...Array(5)].map((_, i) => <MessageSkeleton key={i} />)}
               </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map(conv => {
                const otherUser = conv.participants.find(p => p._id !== user._id);
                const isActive = activeConversation?._id === conv._id;
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={conv._id}
                    onClick={() => navigate(`/messages/${otherUser._id}`)}
                    className={`group flex items-center gap-4 p-4 rounded-[1.8rem] cursor-pointer transition-all border ${isActive ? 'bg-blue-600/10 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'hover:bg-white/[0.03] border-transparent'}`}
                  >
                    <div className="relative shrink-0">
                      <img src={otherUser?.profilePicture} alt="Profile" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/40 transition-all duration-300" />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${otherUser?.isOnline ? 'bg-emerald-500' : 'bg-slate-700'} rounded-full border-[3px] border-[#0d1428] shadow-sm`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4 className={`font-black text-sm truncate tracking-tight transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{otherUser?.name}</h4>
                        {conv.lastMessage && (
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                             {new Date(conv.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                           </span>
                        )}
                      </div>
                      <p className={`text-xs truncate font-medium ${isActive ? 'text-blue-300/80' : 'text-slate-500 group-hover:text-slate-400'}`}>
                        {conv.lastMessage ? (
                          conv.lastMessage.sender === user._id 
                            ? `You: ${conv.lastMessage.content}` 
                            : conv.lastMessage.content
                        ) : 'Initiate secure channel'}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="px-6 py-12 text-center">
                 <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4 border border-white/[0.05]">
                    <MessageSquare className="w-6 h-6 text-slate-700" />
                 </div>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">No Frequency</p>
                 <p className="text-slate-600 text-[11px] font-bold leading-relaxed px-4">Start discussions or visit profiles to open new encrypted channels.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col z-10 relative ${!id && 'hidden sm:flex'}`}>
          {activeConversation ? (
            <>
              {/* Pro Chat Header */}
              <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01] backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate('/messages')} className="sm:hidden p-2 -ml-2 hover:bg-white/[0.08] rounded-xl text-slate-400">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {(() => {
                    const otherUser = activeConversation.participants.find(p => p._id !== user._id);
                    return (
                      <>
                        <img src={otherUser?.profilePicture} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10" alt="" />
                        <div>
                          <h3 className="font-black text-white text-lg tracking-tighter leading-none mb-1">{otherUser?.name}</h3>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                             <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">Broadcasting Live</span>
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
                <div className="flex gap-2">
                   <button className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-slate-500 transition-all">
                      <Info className="w-4 h-4" />
                   </button>
                   <button className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-slate-500 transition-all">
                      <MoreVertical className="w-4 h-4" />
                   </button>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-gradient-to-b from-transparent to-[#0d1428]/20">
                <AnimatePresence initial={false}>
                  {loadingMessages ? (
                    <div className="space-y-6">
                      {[...Array(3)].map((_, i) => (
                         <div key={i} className={`flex ${i%2===0 ? 'justify-end' : 'justify-start'}`}>
                           <Skeleton className={`w-2/3 h-14 rounded-[1.5rem] ${i%2===0 ? 'rounded-tr-sm' : 'rounded-tl-sm'}`} />
                         </div>
                      ))}
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg, i) => {
                      const isOwn = msg.sender._id === user._id || msg.sender === user._id;
                      return (
                        <motion.div 
                          key={msg._id} 
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="relative group/msg max-w-[80%]">
                            <div className={`px-5 py-3.5 rounded-[1.8rem] shadow-xl ${isOwn 
                              ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-blue-500/10' 
                              : 'bg-white/[0.04] backdrop-blur-md text-slate-200 border border-white/[0.05] rounded-tl-sm shadow-black/20'}`}>
                              <p className="text-[14px] font-medium leading-relaxed break-words">{msg.content}</p>
                              <div className={`flex items-center gap-2 justify-end mt-1.5 opacity-40 group-hover/msg:opacity-70 transition-opacity`}>
                                <Clock className="w-2.5 h-2.5" />
                                <p className={`text-[9px] font-black uppercase tracking-tighter`}>
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30">
                      <div className="w-20 h-20 rounded-[2rem] bg-white/[0.04] border border-white/[0.05] flex items-center justify-center mb-6">
                        <MessageSquare className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="font-black text-xs uppercase tracking-[0.3em] text-white">Initialize Signal</p>
                    </div>
                  )}
                </AnimatePresence>
                
                {/* Pro Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex justify-start">
                      <div className="bg-blue-600/10 px-5 py-3 rounded-[1.5rem] rounded-tl-sm border border-blue-500/20 flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        </div>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Scholar Typing</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </div>

              {/* Pro Input Area */}
              <div className="p-6 border-t border-white/[0.08] bg-white/[0.01] backdrop-blur-md">
                <form onSubmit={handleSendMessage} className="flex gap-4 relative">
                  <div className="relative flex-1 group">
                    <input 
                      type="text"
                      value={newMessage}
                      onChange={handleInputChange}
                      placeholder="Enter coordinate signal..."
                      className="w-full bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.08] focus:border-blue-500/40 rounded-[1.5rem] py-4 pl-6 pr-14 text-[14px] text-white font-bold placeholder:text-slate-600 outline-none transition-all shadow-inner"
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
               {/* Aesthetic placeholder */}
               <div className="text-center relative z-10">
                 <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-2xl relative">
                    <MessageSquare className="w-10 h-10 text-white" />
                    <div className="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-xl -z-10 animate-pulse"></div>
                 </div>
                 <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Scholarly Inbox</h2>
                 <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                   Select a secure communication channel from the sidebar to begin your encrypted academic collaboration.
                 </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
