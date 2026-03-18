import { useState } from "react";
import { FavoriteBorder, Favorite, ChatBubbleOutline, MoreHoriz, Delete, Share } from "@mui/icons-material";
import { Link } from "react-router-dom";
import usePostStore from "../../store/postStore.js";
import useAuthStore from "../../store/authStore.js";
import { imgSrc } from "../../utils/config.js";
import api from "../../services/api.js";
import toast from "react-hot-toast";

export default function PostCard({ post }) {
  const { user } = useAuthStore();
  const { toggleLike, deletePost, addComment } = usePostStore();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);

  const isOwner = user?.id === post.user_id;
  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleLike = async () => {
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 300);
    try { await toggleLike(post.id); } catch { toast.error("Failed to like"); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try { await deletePost(post.id); toast.success("Post deleted"); } catch { toast.error("Failed to delete"); }
    setShowMenu(false);
  };

  const loadComments = async () => {
    if (comments.length > 0) { setShowComments(!showComments); return; }
    setLoadingComments(true);
    try {
      const { data } = await api.get(`/posts/${post.id}/comments`);
      setComments(data);
      setShowComments(true);
    } catch { /* ignore */ }
    setLoadingComments(false);
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment(post.id, commentText);
      setComments([...comments, { username: user.username, profile_pic: user.profile_pic, content: commentText, created_at: new Date() }]);
      setCommentText("");
    } catch { toast.error("Failed to comment"); }
  };

  return (
    <div className="card mb-4 animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <Link to={`/profile/${post.user_id}`} className="flex items-center gap-3 group">
          <img src={imgSrc(post.profile_pic, post.username)} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary-400 transition-all" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{post.username}</p>
            <p className="text-xs text-dark-200">{timeAgo(post.created_at)}</p>
          </div>
        </Link>
        {isOwner && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-500 rounded-full transition-all">
              <MoreHoriz style={{ fontSize: 20 }} className="text-dark-200" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-dark-600 rounded-lg shadow-lg border border-gray-200 dark:border-dark-400 py-1 min-w-[130px] animate-scale-in z-10">
                <button onClick={handleDelete} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Delete style={{ fontSize: 16 }} /> Delete post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {post.content && <p className="text-sm text-gray-800 dark:text-dark-50 px-4 pb-3 leading-relaxed whitespace-pre-wrap">{post.content}</p>}
      {post.image && (
        <div className="bg-gray-100 dark:bg-dark-700">
          <img
            src={imgSrc(post.image)}
            alt="Post"
            className="w-full max-h-[500px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-dark-200 px-4 py-2">
        <span className="flex items-center gap-1">
          {(post.like_count > 0) && <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px]">♥</span>}
          {post.like_count || 0} {post.like_count === 1 ? 'like' : 'likes'}
        </span>
        <button onClick={loadComments} className="hover:underline cursor-pointer">{post.comment_count || 0} comments</button>
      </div>

      {/* Actions */}
      <div className="flex items-center border-t border-gray-100 dark:border-dark-400 mx-4 py-1">
        <button onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            post.is_liked ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10" : "text-gray-600 dark:text-dark-100 hover:bg-gray-50 dark:hover:bg-dark-500"}`}>
          <span className={likeAnim ? 'animate-scale-in' : ''}>
            {post.is_liked ? <Favorite style={{ fontSize: 18 }} /> : <FavoriteBorder style={{ fontSize: 18 }} />}
          </span>
          Like
        </button>
        <button onClick={loadComments}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-dark-100 hover:bg-gray-50 dark:hover:bg-dark-500 transition-all">
          <ChatBubbleOutline style={{ fontSize: 18 }} />
          Comment
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-4 space-y-3 animate-slide-down">
          {loadingComments ? (
            <div className="flex justify-center py-3"><span className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <>
              {comments.length === 0 && <p className="text-xs text-dark-200 text-center py-2">No comments yet. Be the first!</p>}
              {comments.map((c, i) => (
                <div key={i} className="flex gap-2 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <img src={imgSrc(c.profile_pic, c.username)} alt="" className="w-7 h-7 rounded-full object-cover mt-0.5 flex-shrink-0" />
                  <div className="flex-1 bg-gray-50 dark:bg-dark-700 rounded-2xl px-3 py-2">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{c.username}</p>
                    <p className="text-sm text-gray-700 dark:text-dark-100">{c.content}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 items-center pt-1">
                <img src={imgSrc(user?.profile_pic, user?.username)} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 flex items-center bg-gray-50 dark:bg-dark-700 rounded-full overflow-hidden">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none text-gray-900 dark:text-white placeholder-dark-200"
                  />
                  {commentText.trim() && (
                    <button onClick={handleComment} className="px-3 py-2 text-primary-500 hover:text-primary-400 text-sm font-medium">Post</button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
