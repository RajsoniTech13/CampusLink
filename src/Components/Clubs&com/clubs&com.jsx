import { Search } from "@mui/icons-material";
import { useState } from "react";
import "./clubs&com.css";

const ClubsCom = ({ onClubSelect }) => {
  const clubs = ["ACM", "Encode", "Anirveda", "OffBit","xYZ","HELLO","KDFJNSDKJF", "scM" , "ASDFSK4ADSFS$"];
  const [searchTerm, setSearchTerm] = useState("");

  // Filter clubs based on the search input
  const filteredClubs = clubs.filter((club) =>
    club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="Clubs">
      <div className="ClubsWrapper">
        <div className="ClubsTop">
          <Search className="searchbarIcon" />
          <input
            placeholder="Explore Clubs"
            type="search"
            className="ClubssearchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="ClubsMiddle">
          <ul className="ClubsLists">
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club, index) => (
                <li
                  key={index}
                  className="ClubsListItem"
                  onClick={() => onClubSelect(club)}
                >
                  {club}
                </li>
              ))
            ) : (
              <li className="ClubsListItem">No clubs found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClubsCom;
