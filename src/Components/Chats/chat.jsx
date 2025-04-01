import React, { useState, useRef } from "react";
import { Send, AttachFile, EmojiEmotions, MoreVert, ArrowBack } from "@mui/icons-material";
import "./chat.css";
import { Chats } from "../../Chats.js"; // Import the dummy chat data

const Chat = ({ user, goBack }) => {
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    textareaRef.current.style.height = "40px"; // Reset height
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Expand dynamically
  };

  const chatMessages = Chats[user.id] || []; // Get messages for the selected user

  return (
    <div className="chats">
      <div className="chatWrapper">
        {/* 🔹 Top Section - Back Button + User Info + Three Dots Menu */}
        <div className="chatTop">
          <div className="chatTopLeft">
            <ArrowBack className="backIcon" onClick={goBack} /> {/* Back Button */}
            <img
              src={user.profilePicture}
              alt={user.username}
              className="chatProfilePic"
            />
            <div className="chatUserInfo">
              <span className="chatUsername">{user.username}</span>
              <span className="chatStatus">Online</span>
            </div>
          </div>
          <div className="chatTopRight">
            <MoreVert className="threeDotsIcon" onClick={() => setMenuOpen(!menuOpen)} />
            {menuOpen && (
              <div className="chatMenu">
                <ul>
                  <li>View Profile</li>
                  <li>Mute Notifications</li>
                  <li>Block User</li>
                  <li>Delete Chat</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 🔹 Middle Section - Chat Messages */}
        <div className="chatMiddle">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`chatMessage ${msg.sender === "me" ? "chatSender" : "chatReceiver"}`}>
              <p>{msg.text}</p>
              <span className="chatTimestamp">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* 🔹 Bottom Section - Auto Expanding Input Box */}
        <div className="chatBottom">
          <AttachFile className="chatIcon" />
          <EmojiEmotions className="chatIcon" />
          <textarea
            className="chatTextarea"
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
            ref={textareaRef}
            rows="1"
          />
          <button className="chatSendButton">
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
