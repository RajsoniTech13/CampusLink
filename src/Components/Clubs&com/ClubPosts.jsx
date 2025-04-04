import React, { useState } from "react";
import "./ClubPosts.css";

const ClubPosts = ({ posts, setPosts, currentUser, isMember, goBack }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(URL.createObjectURL(file));
    }
  };

  const handlePostSubmit = () => {
    if (newTitle.trim() !== "" && newDesc.trim() !== "") {
      const newClubPost = {
        id: posts.length + 1,
        title: newTitle,
        content: newDesc,
        image: newImage,
        author: currentUser.name,
      };
      setPosts([newClubPost, ...posts]);
      setNewTitle("");
      setNewDesc("");
      setNewImage(null);
    }
  };


  return (
    <>
    <div className="club-posts">
    <div className="posts-header">
    <button className="back-button" onClick={goBack}>
      ⬅ Back
    </button>
    <h2>Club Posts</h2>
  </div>

      {isMember && (
        <div className="post-box">
          <h3>Create a Club Post</h3>
          <input
            type="text"
            placeholder="Post Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your description..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {newImage && (
            <img src={newImage} alt="preview" className="preview-img" />
          )}
          <button onClick={handlePostSubmit}>Post</button>
        </div>
      )}

    </div>
            <div className="post-list">
                {posts.map((post) => (
                <div key={post.id} className="club-post-item">
                    <h4>{post.title}</h4>
                    <p>{post.content}</p>
                    {post.image && <img src={post.image} className="ClubPostsImg" alt="Club Post" />}
                    <small>By {post.author || "Unknown"}</small>
                </div>
                ))}
            </div>
    </>
  );
};

export default ClubPosts;
