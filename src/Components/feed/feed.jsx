import React, { useState } from "react";
import Share from "../share/share";
import Post from "../post/post";
import { Posts } from "../../dummyData";
import { Users } from "../../dummyData";
import Chat from "../Chats/chat";
import ChatList from "../ChatList/chatlist";
import GroupChat from "../GroupChat/groupChat";
import GroupList from "../GroupList/groupList";
import { GroupChats } from "../../GroupChat"; // Import GroupChats data
import HubChat from "../Hub/hubChat";
import "./feed.css";

export default function Feed() {
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user
  const [selectedGroup, setSelectedGroup] = useState(null); // Track selected group

  const handleChatSelect = (userId) => {
    // Find the selected user from the Users array
    const user = Users.find((user) => user.id === userId);
    setSelectedUser(user); // Set the selected user
  };

  const handleGroupSelect = (groupId) => {
    // Find the selected group from the GroupChats data
    const group = GroupChats[groupId];
    setSelectedGroup(group); // Set the selected group
  };

  const goBackToChatList = () => {
    setSelectedUser(null); // Reset to show ChatList again
  };

  const goBackToGroupList = () => {
    setSelectedGroup(null); // Reset to show GroupList again
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
        {/* Show GroupList if no group is selected */}
        {/* <GeneralFeed/> */}
        {/* <ProfileFeed userId={1}/> */}


        {/* If no user is selected, show the ChatList (this part is not needed as per your current requirements) */}
        {/* {selectedUser ? (
          <Chat user={selectedUser} goBack={goBackToChatList} />
          ) : (
            <ChatList onChatSelect={handleChatSelect} />
            )} */}
        {/* {!selectedGroup ? (
          <GroupList onGroupSelect={handleGroupSelect} /> // Display GroupList
        ) : (
          // Show GroupChat if a group is selected
          <GroupChat group={selectedGroup} goBack={goBackToGroupList} />
        )} */}
        <HubChat/>
      </div>
    </div>
  );
}
