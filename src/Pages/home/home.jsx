import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import ShareBox from "../../Components/ShareBox/ShareBox.jsx";
import PostCard from "../../Components/PostCard/PostCard.jsx";
import { PostSkeleton } from "../../Components/Skeletons/Skeletons.jsx";
import usePostStore from "../../store/postStore.js";
import useFriendStore from "../../store/friendStore.js";
import useAuthStore from "../../store/authStore.js";
import { Link } from "react-router-dom";
import { imgSrc } from "../../utils/config.js";

function RightSidebar() {
  const { friends, fetchFriends } = useFriendStore();
  useEffect(() => { fetchFriends(); }, []);

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-16 space-y-4">
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Online Friends</h3>
          {friends.length === 0 ? (
            <p className="text-xs text-dark-200">No friends yet. Start connecting!</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto hide-scrollbar">
              {friends.slice(0, 15).map(f => (
                <Link key={f.id} to={`/profile/${f.id}`} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-500 transition-all">
                  <div className="relative">
                    <img src={imgSrc(f.profile_pic, f.username)} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-dark-600 ${f.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-dark-100 truncate">{f.username}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Quick Links</h3>
          <div className="space-y-1.5">
            <Link to="/groups" className="block text-sm text-primary-500 hover:text-primary-400">📚 Study Groups</Link>
            <Link to="/clubs" className="block text-sm text-primary-500 hover:text-primary-400">🎭 Campus Clubs</Link>
            <Link to="/friends" className="block text-sm text-primary-500 hover:text-primary-400">👥 Find Friends</Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Home() {
  const { posts, loading, hasMore, fetchFeed, reset } = usePostStore();
  const { user } = useAuthStore();
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });

  useEffect(() => { reset(); fetchFeed(true); }, []);
  useEffect(() => { if (inView && hasMore) fetchFeed(); }, [inView]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-6">
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-16 space-y-4">
            <div className="card p-4">
              <Link to={`/profile/${user?.id}`} className="flex items-center gap-3 mb-3">
                <img src={imgSrc(user?.profile_pic, user?.username)} alt="" className="w-10 h-10 rounded-full object-cover font-bold" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username}</p>
                  <p className="text-xs text-dark-200 capitalize">{user?.role}</p>
                </div>
              </Link>
              <div className="flex gap-4 text-center pt-2 border-t border-gray-100 dark:border-dark-400">
                <div><p className="text-sm font-bold text-gray-900 dark:text-white">{user?.postCount || 0}</p><p className="text-xs text-dark-200">Posts</p></div>
                <div><p className="text-sm font-bold text-gray-900 dark:text-white">{user?.friendCount || 0}</p><p className="text-xs text-dark-200">Friends</p></div>
              </div>
            </div>
            <nav className="card p-2">
              {[
                { to: "/home", emoji: "🏠", label: "Home Feed" },
                { to: "/friends", emoji: "👥", label: "Friends" },
                { to: "/chat", emoji: "💬", label: "Messages" },
                { to: "/groups", emoji: "📚", label: "Groups" },
                { to: "/clubs", emoji: "🎭", label: "Clubs" },
              ].map(l => (
                <Link key={l.to} to={l.to} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-dark-100 hover:bg-gray-50 dark:hover:bg-dark-500 transition-all font-medium">
                  <span>{l.emoji}</span> {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex-1 max-w-xl mx-auto">
          <ShareBox />
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
          {loading && [1,2,3].map(i => <PostSkeleton key={i} />)}
          {!loading && posts.length === 0 && (
            <div className="card p-8 text-center">
              <p className="text-4xl mb-3">👋</p>
              <p className="text-gray-600 dark:text-dark-100 font-medium">Welcome to CampusLink!</p>
              <p className="text-sm text-dark-200 mt-1">Start by adding friends to see their posts here.</p>
            </div>
          )}
          {hasMore && <div ref={loadMoreRef} className="h-10" />}
          {!hasMore && posts.length > 0 && <p className="text-center text-sm text-dark-200 py-4">You're all caught up! 🎉</p>}
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
