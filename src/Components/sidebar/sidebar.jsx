import "./sidebar.css";
import {
    RssFeed,
    Chat,
    PlayCircleFilledOutlined,
    Group,
    Favorite,
    Diversity2Sharp,
    Bookmark,
    HelpOutline,
    WorkOutline,
    Event,
    School
} from "@mui/icons-material";
import HubIcon from '@mui/icons-material/Hub';
import { Users } from "../../dummyData";
import CloseFriend from "../CloseFriend/closeFriend";
export default function sidebar() {
    const GoToHome =
    () => {
            
    }
    return (
        <div className="sidebar">

            <div className="sidebarWrapper">
                <ul className="sidebarList">

                    <li className="sidebarListItem">
                        <RssFeed className="sidebarIcon" />
                        <span className="sidebarListItemText" onClick={GoToHome}> Post</span>
                    </li>
                    <li className="sidebarListItem">
                        <Chat className="sidebarIcon" />
                        <span className="sidebarListItemText"> Friends Chats</span>
                    </li>
                    <li className="sidebarListItem">
                        <Group className="sidebarIcon" />
                        <span className="sidebarListItemText"> Groups</span>
                    </li>
                    <li className="sidebarListItem">
                        <Group className="sidebarIcon" />
                        <span className="sidebarListItemText">Facutlies Chats</span>
                    </li>
                    <li className="sidebarListItem">
                        <HubIcon className="sidebarIcon" />
                        <span className="sidebarListItemText"> Hub</span>
                    </li>
                    <li className="sidebarListItem">
                        <Diversity2Sharp className="sidebarIcon" />
                        <span className="sidebarListItemText"> Clubs And Communities</span>
                    </li>
                    <li className="sidebarListItem">
                        <Event className="sidebarIcon" />
                        <span className="sidebarListItemText">Events & Notices </span>
                    </li>
                    <li className="sidebarListItem">
                        <Bookmark className="sidebarIcon" />
                        <span className="sidebarListItemText"> Saved Chats </span>
                    </li>
                    <hr className="sidebarHr" />

                    <li className="sidebarListItem">
                        <Favorite className="sidebarIcon" />
                        <span className="sidebarListItemText"> Favourites</span>
                    </li>

                    

                    <ul className="sidebarFriendList">
                    
                        {Users.map((u) => (
                            <CloseFriend key={u.id} user={u} />
                        ))}
                    </ul>
                </ul>
            </div>
        </div>
    );
}
