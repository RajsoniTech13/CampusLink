import "./post.css";
import { Users } from "../../dummyData";
import { MoreVert,CommentBankTwoTone } from "@mui/icons-material";
import { useState } from "react";
function post({ post }) {
    const [like, setLike] = useState(post.like);
    const [isLiked,setIsLiked] = useState(false)
    const LikeHandler = () =>
    {
        setLike(isLiked ? like - 1 : like + 1 )
        setIsLiked(!isLiked)
    }

  return (
    <div className="post"> 
        <div className="postWrapper">
            <div className="postTop">
                <div className="postTopLeft">
                    <img className="postProfilePic" src={Users.filter(u=>u.id === post.userId)[0].profilePicture} alt="" />
                    <span className="postUsername">{Users.filter(u=>u.id === post.userId)[0].username}</span>
                    <span className="postDate">{post.date}</span>

                </div>
                <div className="postTopRight">
                    <MoreVert/>
                </div>
            </div>
            <hr />
            <div className="postCenter">
                <span className="postText">{post?.desc}</span>
                <div className="postimgsection">
                    
                <img src={post.photo} alt="" className="postImg" />
                </div>
            </div>
            <hr />
            <div className="postBottom">
                <div className="postBottomLeft">
                   <img src="assets/like.png" alt="" onClick={LikeHandler} className="postLikeIcon" />
                   <img src="assets/heart.png" alt="" onClick={LikeHandler}  className="postLikeIcon" />
                   <span className="postLikeCounter">{like} likes</span>
                </div>
                <div className="postBottomRight">
                    <CommentBankTwoTone/>
                    <span className="postCommentText">{post.comment} comments</span>
                </div>
            </div>
        </div>
    </div>
  );
}

export default post;
