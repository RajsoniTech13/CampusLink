import React, { useState, useRef, useEffect } from "react";
import { Send, AttachFile, EmojiEmotions, MoreVert } from "@mui/icons-material";
import { io } from "socket.io-client";
import "./hubChat.css";

// Create a fake WebSocket connection
const socket = io("ws://localhost:5173", { autoConnect: false });

const HubChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef(null);
  const menuRef = useRef(null);

  // Generate an anonymous user ID
  const userId = useRef(`User-${Math.floor(Math.random() * 10000)}`);

  useEffect(() => {
    socket.connect();

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    textareaRef.current.style.height = "40px"; 
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
  };

  const sendMessage = () => {
    if (message.trim() === "") return;
    const msgData = {
      sender: userId.current,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, msgData]); // Local update
    socket.emit("sendMessage", msgData); // Simulated WebSocket send
    setMessage("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="hubChats">
      <div className="hubChatWrapper">
        <div className="hubChatTop">
          <span className="hubName">Anonymous Hub Chat</span>
          <div className="hubChatTopRight" ref={menuRef}>
            <MoreVert className="threeDotsIcon" onClick={() => setMenuOpen(!menuOpen)} />
            {menuOpen && (
              <div className="hubChatMenu">
                <ul>
                  <li>Mute Notifications</li>
                  <li>Delete Chat</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="hubChatMiddle">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className={`hubChatMessage ${msg.sender === userId.current ? "hubChatSender" : "hubChatReceiver"}`}>
                <p>{msg.text}</p>
                <span className="hubChatTimestamp">{msg.time}</span>
              </div>
            ))
          ) : (
            <p className="noMessages">No messages yet...</p>
          )}
        </div>

        <div className="hubChatBottom">
          <AttachFile className="hubChatIcon" />
          <EmojiEmotions className="hubChatIcon" />
          <textarea
            className="hubChatTextarea"
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
            ref={textareaRef}
            rows="1"
          />
          <button className="hubChatSendButton" onClick={sendMessage}>
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HubChat;
