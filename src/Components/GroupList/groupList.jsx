import React from "react";
import "./groupList.css"; // Import CSS for GroupList

const GroupList = ({ onGroupSelect }) => {
  return (
    <div className="groupList">
      <h3>Groups</h3>
      {/* Example of a group */}
      <div className="groupItem" onClick={() => onGroupSelect(1)}>
        <img
          src="/assets/Person/1.jpeg"
          alt="Group"
          className="groupIcon"
        />
        <span className="groupName">Web Dev Team</span>
      </div>
      <div className="groupItem" onClick={() => onGroupSelect(2)}>
        <img
          src="/assets/Person/5.jpeg"
          alt="Group"
          className="groupIcon"
        />
        <span className="groupName">College Friends</span>
      </div>
      <div className="groupItem" onClick={() => onGroupSelect(3)}>
        <img
          src="/assets/Person/8.jpeg"
          alt="Group"
          className="groupIcon"
        />
        <span className="groupName">Blockchain Hackathon</span>
      </div>
      {/* Add more groups here */}
    </div>
  );
};

export default GroupList;
