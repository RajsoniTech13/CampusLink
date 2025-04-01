import React, { useState } from "react";
import Share from "../share/share";
import Post from "../post/post";
import { Posts } from "../../dummyData";
import { Users } from "../../dummyData";
import Chat from "../Chats/chat";
import ChatList from "../ChatList/chatlist";
import "./feed.css";

export default function Feed() {
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user

  const handleChatSelect = (userId) => {
    // Find the selected user from the Users array
    const user = Users.find((user) => user.id === userId);
    setSelectedUser(user); // Set the selected user
  };
  const goBackToChatList = () => {
    setSelectedUser(null); // Reset to show ChatList again
  };

  const GeneralFeed = () => {
    return (
      <>
        <Share />
        {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </>
    );
  };

  const ProfileFeed = ({ userId }) => {
    return (
      <>
        {Posts.filter((p) => p.userId === userId).map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </>
    );
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
                  {/* <GeneralFeed/> */}
          {/* <ProfileFeed userId={1}/> */}
        {/* If a user is selected, show the Chat component */}
        {selectedUser ? (
          <Chat user={selectedUser}  goBack={goBackToChatList}/>
        ) : (
          <ChatList onChatSelect={handleChatSelect} /> // Pass the handler to ChatList
        )}
      </div>
    </div>
  );
}
