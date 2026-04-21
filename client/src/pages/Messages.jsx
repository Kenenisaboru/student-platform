import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, Send, ArrowLeft, MessageSquare, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MessageSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import { useSocket } from '../context/SocketContext';

const Messages = () => {
  const { id } = useParams(); // The user ID to message, or empty for just the inbox
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

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch all conversations
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

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({ message, conversationId }) => {
      if (activeConversation?._id === conversationId) {
        setMessages(prev => {
          if (prev.find(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
      
      // Update conversations list snippet
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

  // Fetch active conversation if ID is provided
  useEffect(() => {
    const fetchActiveConversation = async () => {
      if (!id) {
        setActiveConversation(null);
        setIsTyping(false);
        return;
      }
      
      setLoadingMessages(true);
      try {
        // Find or create conversation with user :id
        const convRes = await API.post(`/messages/conversation/${id}`);
        const conversation = convRes.data;
        
        // Update local list if it's new
        setConversations(prev => {
          if (!prev.find(c => c._id === conversation._id)) {
            return [conversation, ...prev];
          }
          return prev;
        });

        setActiveConversation(conversation);
        
        // Load messages for this conversation
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
      setNewMessage(''); // optimistic clear
      
      // Optimitistically add message
      const tempMessage = {
        _id: 'temp-' + Date.now(),
        content,
        sender: user,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMessage]);

      const { data } = await API.post(`/messages/${activeConversation._id}`, { content });
      
      // Replace temp with actual
      setMessages(prev => prev.map(m => m._id === tempMessage._id ? data : m));
      
      // Update snippet in conversation list
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
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-0 h-[calc(100vh-6rem)]">
      <div className="glass-card rounded-2xl h-full flex overflow-hidden border border-white/[0.06] shadow-xl">
        
        {/* Sidebar: Conversations List */}
        <div className={`w-full sm:w-1/3 border-r border-white/[0.06] flex flex-col ${id && 'hidden sm:flex'}`}>
          <div className="p-4 border-b border-white/[0.06]">
            <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2 pl-10 pr-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/30"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar p-2">
            {loadingConv ? (
               <div className="space-y-1">
                 {[...Array(5)].map((_, i) => <MessageSkeleton key={i} />)}
               </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map(conv => {
                const otherUser = conv.participants.find(p => p._id !== user._id);
                const isActive = activeConversation?._id === conv._id;
                return (
                  <div 
                    key={conv._id}
                    onClick={() => navigate(`/messages/${otherUser._id}`)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1 ${isActive ? 'bg-blue-500/10 border-blue-500/20' : 'hover:bg-white/[0.04] border-transparent'} border`}
                  >
                    <img src={otherUser?.profilePicture} alt="Profile" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-white text-sm truncate">{otherUser?.name}</h4>
                        {conv.lastMessage && (
                           <span className="text-[10px] font-bold text-slate-500">
                             {new Date(conv.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                           </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate font-medium">
                        {conv.lastMessage ? (
                          conv.lastMessage.sender === user._id 
                            ? `You: ${conv.lastMessage.content}` 
                            : conv.lastMessage.content
                        ) : 'Start a conversation'}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-10 text-center">
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 opacity-50">No Conversations</p>
                 <p className="text-slate-600 text-[11px] font-medium leading-relaxed">Go to a student's profile to start a direct message.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`w-full sm:w-2/3 flex flex-col ${!id && 'hidden sm:flex'}`}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/messages')} className="sm:hidden p-2 -ml-2 hover:bg-white/[0.05] rounded-xl text-slate-400">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {(() => {
                    const otherUser = activeConversation.participants.find(p => p._id !== user._id);
                    return (
                      <>
                        <img src={otherUser?.profilePicture} className="w-10 h-10 rounded-xl" alt="" />
                        <div>
                          <h3 className="font-bold text-white leading-tight">{otherUser?.name}</h3>
                          <span className="text-[11px] font-semibold text-emerald-400">Active</span>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                       <div key={i} className={`flex ${i%2===0 ? 'justify-end' : 'justify-start'}`}>
                         <Skeleton className={`w-2/3 h-12 rounded-2xl ${i%2===0 ? 'rounded-tr-sm' : 'rounded-tl-sm'}`} />
                       </div>
                    ))}
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg, i) => {
                    const isOwn = msg.sender._id === user._id || msg.sender === user._id; // handling object or id
                    return (
                      <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${isOwn ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-tr-sm' : 'bg-white/[0.06] text-slate-200 border border-white/[0.04] rounded-tl-sm'}`}>
                          <p className="text-sm font-medium leading-relaxed break-words">{msg.content}</p>
                          <p className={`text-[10px] mt-1 text-right font-medium opacity-70`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                    <p className="font-semibold text-sm">Say hello! 👋</p>
                  </div>
                )}
                
                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="flex justify-start">
                      <div className="bg-white/[0.04] px-4 py-2.5 rounded-2xl rounded-tl-sm border border-white/[0.04] flex items-center gap-1.5">
                        <div className="flex gap-1">
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-blue-400/50 rounded-full" />
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-400/50 rounded-full" />
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-400/50 rounded-full" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Typing</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/[0.06] bg-white/[0.01]">
                <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-4 pr-12 text-sm text-white font-medium focus:outline-none focus:border-blue-500/40"
                  />
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    disabled={!newMessage.trim()}
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-blue-500 rounded-lg text-white disabled:opacity-50 disabled:bg-slate-700"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </motion.button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <EmptyState 
                icon={MessageSquare}
                title="Your Inbox"
                description="Select a conversation from the sidebar to view your messages or start a new discussion."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
