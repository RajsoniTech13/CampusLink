import React, { useState } from "react";
import Share from "../share/share";
import Post from "../post/post";
import { Posts } from "../../dummyData";
import { Users } from "../../dummyData";
import Chat from "../Chats/chat";
import ChatList from "../ChatList/chatlist";
import GroupChat from "../GroupChat/groupChat";
import GroupList from "../GroupList/groupList";
import { GroupChats } from "../../GroupChat"; 
import HubChat from "../Hub/hubChat";
import ClubsCom from "../Clubs&com/clubs&com";
import ClubDetails from "../Clubs&com/ClubDetails";
import "./feed.css";

export default function Feed({ section }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);

  const handleChatSelect = (userId) => {
    const user = Users.find((user) => user.id === userId);
    setSelectedUser(user);
  };

  const handleGroupSelect = (groupId) => {
    const group = GroupChats[groupId];
    setSelectedGroup(group);
  };

  const handleClubSelect = (clubName) => {
    setSelectedClub(clubName);
  };

  const goBackToChatList = () => setSelectedUser(null);
  const goBackToGroupList = () => setSelectedGroup(null);
  const goBackToClubList = () => setSelectedClub(null);

  const renderSection = () => {
    switch (section) {
      case "post":
        return (
          <>
            <Share />
            {Posts.map((p) => (
              <Post key={p.id} post={p} />
            ))}
          </>
        );
      case "chat":
        return selectedUser ? (
          <Chat user={selectedUser} goBack={goBackToChatList} />
        ) : (
          <ChatList onChatSelect={handleChatSelect} />
        );
      case "group":
        return selectedGroup ? (
          <GroupChat group={selectedGroup} goBack={goBackToGroupList} />
        ) : (
          <GroupList onGroupSelect={handleGroupSelect} />
        );
      case "faculty":
        return <ChatList onChatSelect={handleChatSelect} isFaculty />;
      case "hub":
        return <HubChat />;
      case "clubs":
        return !selectedClub ? (
          <ClubsCom onClubSelect={handleClubSelect} />
        ) : (
          <ClubDetails clubName={selectedClub} goBack={goBackToClubList} />
        );
      case "events":
        return <div>Coming Soon: Events & Notices</div>;
      default:
        return null;
    }
  };

  return (
    <div className="feed">
      <div className="feedWrapper">{renderSection()}</div>
    </div>
  );
}
