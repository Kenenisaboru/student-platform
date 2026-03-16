import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, Send, ArrowLeft, MessageSquare, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { MessageSkeleton } from '../components/Skeleton';

const Messages = () => {
  const { id } = useParams(); // The user ID to message, or empty for just the inbox
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [search, setSearch] = useState('');
  
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

  // Fetch active conversation if ID is provided
  useEffect(() => {
    const fetchActiveConversation = async () => {
      if (!id) {
        setActiveConversation(null);
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

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
      // Revert optimistic clear (not perfect state management but works for demo)
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
              <div className="text-center p-8 text-slate-500 text-sm font-semibold">No conversations yet.<br/>Go to a profile to send a message.</div>
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
                         <div className={`w-2/3 h-10 rounded-2xl animate-shimmer ${i%2===0 ? 'rounded-tr-sm bg-blue-500/20' : 'rounded-tl-sm bg-white/5'}`}></div>
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
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/[0.06] bg-white/[0.01]">
                <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
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
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
               <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center mb-4">
                 <MessageSquare className="w-10 h-10 text-slate-600" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Your Messages</h3>
               <p className="text-sm font-medium">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
