import React, { useState, useRef, useEffect } from "react";
import { Send, AttachFile, EmojiEmotions, MoreVert, ArrowBack } from "@mui/icons-material";
import "./groupChat.css";
import { GroupChats } from "../../GroupChat"; // Import dummy group chat data

const GroupChat = ({ group, goBack }) => {
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef(null);
  const menuRef = useRef(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    textareaRef.current.style.height = "40px"; // Reset height
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Expand dynamically
  };

  // Function to close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const groupMessages = GroupChats[group.id].messages || []; // Get messages for the selected group

  return (
    <div className="groupChats">
      <div className="groupChatWrapper">
        
        {/* 🔹 Top Section - Back Button + Group Info + Three Dots Menu */}
        <div className="groupChatTop">
          <div className="groupChatTopLeft">
            <ArrowBack className="backIcon" onClick={goBack} /> {/* Back Button */}
            <div className="groupInfo">
              <span className="groupName">{group.name}</span>
              <div className="groupMembers">
                {group.members.map((member, index) => (
                  <img key={index} src={member.profilePicture} alt={member.username} className="groupMemberPic" />
                ))}
              </div>
            </div>
          </div>
          <div className="groupChatTopRight" ref={menuRef}>
            <MoreVert className="threeDotsIcon" onClick={() => setMenuOpen(!menuOpen)} />
            {menuOpen && (
              <div className="groupChatMenu">
                <ul>
                  <li>View Group Info</li>
                  <li>Mute Notifications</li>
                  <li>Leave Group</li>
                  <li>Delete Chat</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 🔹 Middle Section - Group Chat Messages */}
        <div className="groupChatMiddle">
          {groupMessages.map((msg, index) => (
            <div key={index} className={`groupChatMessage ${msg.sender === "me" ? "groupChatSender" : "groupChatReceiver"}`}>
              <div className="messageHeader">
                <img src={msg.senderProfile} alt={msg.sender} className="messageProfilePic" />
                <span className="senderName">{msg.sender}</span>
              </div>
              <p>{msg.text}</p>
              <span className="groupChatTimestamp">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* 🔹 Bottom Section - Auto Expanding Input Box */}
        <div className="groupChatBottom">
          <AttachFile className="groupChatIcon" />
          <EmojiEmotions className="groupChatIcon" />
          <textarea
            className="groupChatTextarea"
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
            ref={textareaRef}
            rows="1"
          />
          <button className="groupChatSendButton">
            <Send />
          </button>
        </div>

      </div>
    </div>
  );
};

export default GroupChat;
