import { useEffect, useState, useRef } from "react";
import { Send, ArrowBack, GroupAdd, PersonAdd } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import { ChatSkeleton } from "../../Components/Skeletons/Skeletons.jsx";
import useChatStore from "../../store/chatStore.js";
import useFriendStore from "../../store/friendStore.js";
import useAuthStore from "../../store/authStore.js";
import { getSocket } from "../../services/socket.js";
import { imgSrc } from "../../utils/config.js";
import api from "../../services/api.js";

export default function ChatPage() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { chats, activeChat, messages, loadingChats, fetchChats, openChat, closeChat, sendMessage, addMessage, typingUsers, setTyping, clearTyping } = useChatStore();
  const { friends, fetchFriends } = useFriendStore();
  
  const [messageText, setMessageText] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [chatTab, setChatTab] = useState("recent"); // recent | friends
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => { 
    fetchChats(); 
    fetchFriends();
  }, []);

  // Handle incoming state from profile/friends "Message" button
  useEffect(() => {
    if (location.state?.activeChat && !loadingChats) {
      selectChat(location.state.activeChat);
      window.history.replaceState({}, document.title); // clear state
    }
  }, [location.state, loadingChats]);

  // Socket listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (msg) => {
      addMessage(msg);
      // Refresh chat list to bring to top
      fetchChats();
    };
    const handleTyping = ({ userId: uid, chatId }) => { setTyping(chatId, uid); };
    const handleStopTyping = ({ userId: uid, chatId }) => { clearTyping(chatId, uid); };

    socket.on('new-message', handleNewMessage);
    socket.on('user-typing', handleTyping);
    socket.on('user-stop-typing', handleStopTyping);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('user-typing', handleTyping);
      socket.off('user-stop-typing', handleStopTyping);
    };
  }, []);

  // Auto scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (!messageText.trim() || !activeChat) return;
    sendMessage(activeChat, messageText.trim());
    setMessageText("");
    const socket = getSocket();
    if (socket) socket.emit('stop-typing', activeChat);
  };

  const handleTypingInput = (val) => {
    setMessageText(val);
    const socket = getSocket();
    if (socket && activeChat) {
      socket.emit('typing', activeChat);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => socket.emit('stop-typing', activeChat), 1500);
    }
  };

  const selectChat = (chatId) => {
    openChat(chatId);
    setMobileShowChat(true);
    setChatTab("recent");
  };

  const startNewPrivateChat = async (friendId) => {
    try {
      const { data } = await api.post('/chats/private', { userId: friendId });
      await fetchChats();
      selectChat(data.chatId);
    } catch { /* alert handled in API interceptor if needed */ }
  };

  const goBack = () => {
    closeChat();
    setMobileShowChat(false);
  };

  const activeInfo = chats.find(c => c.id === activeChat);
  const isTyping = activeChat && Object.keys(typingUsers).some(k => k.startsWith(`${activeChat}_`) && !k.endsWith(`_${user?.id}`));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors flex flex-col">
      <Navbar />
      <div className="max-w-6xl mx-auto flex w-full flex-1 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
        {/* Chat List Sidebar */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-dark-400 flex flex-col bg-white dark:bg-dark-800 flex-shrink-0 ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-dark-400">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1 mb-4">Messages</h2>
            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-dark-700 p-1 rounded-lg">
              <button 
                onClick={() => setChatTab("recent")}
                className={`flex-1 text-sm font-semibold py-1.5 rounded-md transition-all ${chatTab === 'recent' ? 'bg-white dark:bg-dark-500 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-dark-200 dark:hover:text-white'}`}
              >
                Recent
              </button>
              <button 
                onClick={() => setChatTab("friends")}
                className={`flex-1 text-sm font-semibold py-1.5 rounded-md transition-all ${chatTab === 'friends' ? 'bg-white dark:bg-dark-500 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-dark-200 dark:hover:text-white'}`}
              >
                Friends
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {chatTab === 'recent' ? (
              // ─── RECENT CHATS ───
              loadingChats ? [1,2,3,4].map(i => <ChatSkeleton key={i} />) :
              chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <p className="text-4xl mb-3">💬</p>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">No messages</p>
                  <p className="text-dark-200 text-sm">Start a conversation from the Friends tab.</p>
                  <button onClick={() => setChatTab('friends')} className="mt-4 text-primary-500 text-sm font-medium hover:underline">View Friends</button>
                </div>
              ) : chats.map(c => (
                <button key={c.id} onClick={() => selectChat(c.id)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors text-left border-b border-gray-50 dark:border-dark-700/50 ${activeChat === c.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                  <div className="relative flex-shrink-0">
                    <img src={c.type === 'private' ? imgSrc(c.participant?.profile_pic, c.participant?.username) : imgSrc(c.group_pic, c.group_name)} alt=""
                      className="w-14 h-14 rounded-full object-cover" />
                    {c.type === 'private' && c.participant?.is_online && (
                      <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-dark-800" title="Online"/>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                      {c.type === 'private' ? c.participant?.username : c.group_name}
                    </p>
                    <p className={`text-sm truncate mt-0.5 ${c.last_sender_id !== user?.id && !c.is_read ? 'text-gray-900 dark:text-white font-medium' : 'text-dark-200'}`}>
                      {c.last_sender_id === user?.id ? "You: " : ""}{c.last_message || "Start a conversation"}
                    </p>
                  </div>
                  {c.last_message_time && (
                    <span className="text-[11px] font-medium text-dark-200 flex-shrink-0 mt-1 self-start">
                      {new Date(c.last_message_time).toLocaleDateString() === new Date().toLocaleDateString() 
                        ? new Date(c.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : new Date(c.last_message_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </button>
              ))
            ) : (
              // ─── FRIENDS LIST ───
              friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <p className="text-4xl mb-3">👥</p>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">No friends</p>
                  <p className="text-dark-200 text-sm">Add friends to start chatting.</p>
                </div>
              ) : friends.map(f => (
                <button key={f.id} onClick={() => startNewPrivateChat(f.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors text-left border-b border-gray-50 dark:border-dark-700/50">
                  <div className="relative flex-shrink-0">
                    <img src={imgSrc(f.profile_pic, f.username)} alt="" className="w-12 h-12 rounded-full object-cover" />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-dark-800 ${f.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{f.username}</p>
                    <p className="text-xs text-dark-200 truncate mt-0.5">{f.is_online ? "Active now" : `Last seen ${new Date(f.last_seen).toLocaleDateString()}`}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 flex flex-col bg-gray-50/50 dark:bg-dark-900 relative ${!mobileShowChat && !activeChat ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-400 sticky top-0 z-10 shadow-sm">
                <button onClick={goBack} className="md:hidden p-1.5 -ml-2 text-gray-600 dark:text-dark-100 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-lg"><ArrowBack /></button>
                <img src={activeInfo?.type === 'private' ? imgSrc(activeInfo.participant?.profile_pic, activeInfo.participant?.username) : imgSrc(activeInfo?.group_pic, activeInfo?.group_name)} alt=""
                  className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <p className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                    {activeInfo?.type === 'private' ? activeInfo.participant?.username : activeInfo?.group_name}
                  </p>
                  <p className="text-xs font-medium text-dark-200 mt-0.5">
                    {isTyping ? <span className="text-primary-500 animate-pulse">typing...</span> :
                     activeInfo?.type === 'private' && activeInfo.participant?.is_online ? <span className="text-green-500">Online</span> : 
                     activeInfo?.type === 'private' ? `Offline` : `${activeInfo?.member_count || 0} members`}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-dark-200">
                    <p className="text-sm border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 px-4 py-2 rounded-full shadow-sm mb-4">Start of conversation</p>
                  </div>
                ) : null}
                
                {messages.map((m, idx) => {
                  const isMine = m.sender_id === user?.id;
                  const showAvatar = !isMine && (idx === messages.length - 1 || messages[idx + 1].sender_id !== m.sender_id);
                  
                  return (
                    <div key={m.id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-end gap-2 max-w-[75%] md:max-w-[60%] ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isMine ? (
                          showAvatar ? (
                             <img src={imgSrc(m.profile_pic, m.username)} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
                          ) : (
                             <div className="w-7 h-7 flex-shrink-0" />
                          )
                        ) : null}
                        
                        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                          {!isMine && activeInfo?.type === 'group' && showAvatar && (
                            <span className="text-xs font-medium text-dark-200 mb-1 ml-1">{m.username}</span>
                          )}
                          <div className={`px-4 py-2.5 text-[15px] leading-relaxed relative ${
                            isMine 
                              ? 'bg-gradient-to-tr from-primary-600 to-indigo-500 text-white rounded-2xl rounded-br-sm shadow-md' 
                              : 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 dark:border-dark-600'
                          }`}>
                            {m.content}
                          </div>
                          <span className={`text-[10px] font-medium text-dark-200 mt-1 ${isMine ? 'mr-1' : 'ml-1'}`}>
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} className="h-2" />
              </div>

              {/* Input */}
              <div className="p-4 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-400 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-2 max-w-4xl mx-auto">
                  <div className="flex-1 flex items-center bg-gray-100 dark:bg-dark-700 rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-primary-500/50 transition-all border border-gray-200 dark:border-dark-600">
                    <button className="text-dark-200 hover:text-primary-500 transition-colors p-1"><EmojiEmotions style={{ fontSize: 22 }} /></button>
                    <input ref={inputRef} value={messageText} onChange={(e) => handleTypingInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                      placeholder="Message..."
                      className="flex-1 w-full bg-transparent px-3 py-2 text-[15px] focus:outline-none text-gray-900 dark:text-white placeholder-dark-200" />
                  </div>
                  <button onClick={handleSend} disabled={!messageText.trim()}
                    className={`w-11 h-11 flex items-center justify-center rounded-full transition-all flex-shrink-0 shadow-md ${
                      messageText.trim() ? "bg-primary-600 hover:bg-primary-500 text-white active:scale-95" : "bg-gray-200 dark:bg-dark-700 text-gray-400 dark:text-dark-400 cursor-not-allowed"
                    }`}>
                    <Send style={{ fontSize: 20, transform: messageText.trim() ? 'translate(2px, -2px)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
              <div className="w-32 h-32 bg-white dark:bg-dark-800 rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-gray-50 dark:border-dark-900">
                <p className="text-6xl">💬</p>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">CampusLink Messages</h3>
              <p className="text-gray-500 dark:text-dark-200 mt-2 max-w-sm text-center">Select an existing conversation or start a new one from your friends list to stay connected.</p>
              <button onClick={() => setChatTab('friends')} className="mt-8 btn-primary px-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">Start messaging</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
