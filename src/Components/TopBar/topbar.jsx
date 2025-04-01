import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import UserImg from "/assets/Person/Profilepic.png";
import { useState } from "react";

export default function Topbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo">PDEnergyMedia</span>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchbarIcon" />
          <input
            placeholder="Search For Friends, Post and Groups"
            type="search"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <span className="topbarLink">Timeline</span>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <div className="topbarProfileContainer" onClick={toggleDropdown}>
          <img src={UserImg} alt="Profile" className="topbarProfilePic" />
          {dropdownOpen && (
            <div className="dropdownMenu">
              <ul>
                <li>Profile</li>
                <li>Settings</li>
                <li>Logout</li>
              </ul>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}