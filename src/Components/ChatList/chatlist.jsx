import React from "react";
import { Users } from "../../dummyData"; 
import "./chatlist.css";

const ChatList = ({ onChatSelect }) => {
  return (
    <div className="chatList">
      {Users.map((user) => (
        <div
          className="chatListItem"
          key={user.id}
          onClick={() => onChatSelect(user.id)} // Call handleChatSelect
        >
          <img src={user.profilePicture} alt={user.username} className="chatProfilePic" />
          <div className="chatUserInfo">
            <span className="chatUsername">{user.username}</span>
            <span className="chatStatus">Online</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
