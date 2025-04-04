import React, { useState } from "react";
import ClubPosts from "./ClubPosts";
import "./ClubDetails.css";

const ClubDetails = ({ clubName, goBack }) => {
  const currentUser = { id: 4, name: "Raj" }; // Dummy logged-in user
  const clubMembers = [1, 2, 4]; // IDs of users who are part of the club

  const [queryText, setQueryText] = useState("");
  const [queries, setQueries] = useState([]);
  const [responses, setResponses] = useState({});
  const [clubPosts, setClubPosts] = useState([
    {
      id: 1,
      title: "Welcome to " + clubName,
      content: "This is the first post from the " + clubName + " club.",
    },
    {
      id: 2,
      title: "Upcoming Event",
      content: "Join us for a workshop next week on AI & Machine Learning!",
    },
  ]);

  const [viewingPosts, setViewingPosts] = useState(false);

  const handleAskQuery = () => {
    if (queryText.trim() !== "") {
      setQueries([...queries, queryText]);
      setQueryText("");
    }
  };

  const handleRespond = (index, responseText) => {
    setResponses({ ...responses, [index]: responseText });
  };

  if (viewingPosts) {
    return (
      <ClubPosts
        posts={clubPosts}
        setPosts={setClubPosts}
        currentUser={currentUser}
        isMember={clubMembers.includes(currentUser.id)}
        goBack={() => setViewingPosts(false)}
      />
    );
  }

  return (
    <div className="club-details">
      {/* Sticky Header */}
      <div className="club-header">
        <button className="back-button" onClick={goBack}>
          ⬅ Back
        </button>
        <h2 className="club-name">{clubName} Club</h2>
      </div>

      {/* View Posts Button */}
      <button className="view-posts-btn" onClick={() => setViewingPosts(true)}>
        📄 View Club Posts
      </button>

      {/* Query Section */}
      <div className="query-section">
        <h5>Ask a Query</h5>
        <textarea
          placeholder="Type your query..."
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
        />
        <button onClick={handleAskQuery}>Submit Query</button>
      </div>

      {/* Scrollable Queries */}
        <h3 className="QueriesTitle">Queries</h3>        
      <div className="query-list">
        {queries.length === 0 ? (
          <p>No queries yet.</p>
        ) : (
          queries.map((q, index) => (
            <div key={index} className="query-item">
              <p>
                <strong>Q:</strong> {q}
              </p>
              {responses[index] ? (
                <p>
                  <strong>Response from {currentUser.name}:</strong>{" "}
                  {responses[index]}
                </p>
              ) : (
                <div className="respond-box">
                  <input
                    type="text"
                    placeholder="Type a response..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRespond(index, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <small>Press Enter to respond</small>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClubDetails;
