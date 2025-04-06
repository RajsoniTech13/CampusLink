import "./sidebar.css";
import {
  RssFeed,
  Chat,
  Group,
  Diversity2Sharp,
  Bookmark,
  Favorite,
  Event,
} from "@mui/icons-material";
import HubIcon from "@mui/icons-material/Hub";
import { Users } from "../../dummyData";
import CloseFriend from "../CloseFriend/closeFriend";

export default function Sidebar({ onSectionChange }) {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem" onClick={() => onSectionChange("post")}>
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Post</span>
          </li>
          <li className="sidebarListItem" onClick={() => onSectionChange("chat")}>
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Friends Chats</span>
          </li>
          <li className="sidebarListItem" onClick={() => onSectionChange("group")}>
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem" onClick={() => onSectionChange("faculty")}>
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Faculties Chats</span>
          </li>
          <li className="sidebarListItem" onClick={() => onSectionChange("hub")}>
            <HubIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Hub</span>
          </li>
          <li className="sidebarListItem" onClick={() => onSectionChange("clubs")}>
            <Diversity2Sharp className="sidebarIcon" />
            <span className="sidebarListItemText">Clubs And Communities</span>
          </li>
          <li className="sidebarListItem" onClick={() => onSectionChange("events")}>
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events & Notices</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Saved Chats</span>
          </li>
          <hr className="sidebarHr" />
          <li className="sidebarListItem">
            <Favorite className="sidebarIcon" />
            <span className="sidebarListItemText">Favourites</span>
          </li>
        </ul>

        <ul className="sidebarFriendList">
          {Users.map((u) => (
            <CloseFriend key={u.id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
}
