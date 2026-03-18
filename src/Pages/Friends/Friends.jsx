import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PersonAdd, Check, Close, PersonRemove, Search, Message } from "@mui/icons-material";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import { FriendSkeleton } from "../../Components/Skeletons/Skeletons.jsx";
import useFriendStore from "../../store/friendStore.js";
import { imgSrc } from "../../utils/config.js";
import api from "../../services/api.js";
import toast from "react-hot-toast";

export default function Friends() {
  const navigate = useNavigate();
  const { friends, requests, fetchFriends, fetchRequests, acceptRequest, rejectRequest, removeFriend, sendRequest } = useFriendStore();
  const [tab, setTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTimer, setSearchTimer] = useState(null);

  useEffect(() => {
    Promise.all([fetchFriends(), fetchRequests()]).finally(() => setLoading(false));
  }, []);

  const handleSearch = (val) => {
    setSearchQuery(val);
    clearTimeout(searchTimer);
    if (val.length < 2) { setSearchResults([]); return; }
    setSearchTimer(setTimeout(async () => {
      try {
        const { data } = await api.get(`/users/search?q=${val}`);
        setSearchResults(data);
      } catch { /* ignore */ }
    }, 300));
  };

  const handleSendRequest = async (userId) => {
    try { await sendRequest(userId); toast.success("Friend request sent!"); }
    catch { toast.error("Failed to send request"); }
  };

  const startChat = async (userId) => {
    try {
      const { data } = await api.post('/chats/private', { userId });
      navigate('/chat', { state: { activeChat: data.chatId } });
    } catch {
      toast.error("Failed to start chat");
    }
  };

  const tabs = [
    { key: "friends", label: "Friends", count: friends.length },
    { key: "requests", label: "Requests", count: requests.length },
    { key: "search", label: "Find People" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Friends System</h1>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100/50 dark:bg-dark-800 p-1.5 rounded-xl mb-6 shadow-inner">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? "bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5" : "text-gray-500 dark:text-dark-200 hover:bg-gray-200/50 dark:hover:bg-dark-700"}`}>
              {t.label} 
              {t.count !== undefined && t.count > 0 && (
                <span className={`px-2 py-0.5 rounded-md text-xs ${tab === t.key ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-gray-200 dark:bg-dark-600 text-gray-500 dark:text-dark-200'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Friends List */}
        {tab === "friends" && (
          <div className="card divide-y divide-gray-100 dark:divide-dark-400 overflow-hidden">
            {loading ? [1,2,3].map(i => <FriendSkeleton key={i} />) :
             friends.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-4xl mb-3">🤝</p>
                <p className="text-gray-600 dark:text-dark-100 font-medium">No friends yet</p>
                <p className="text-sm text-dark-200 mt-1 mb-4">Connect with people to see them here.</p>
                <button onClick={() => setTab("search")} className="btn-primary text-sm px-6">Find People</button>
              </div>
            ) : friends.map(f => (
              <div key={f.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                <Link to={`/profile/${f.id}`} className="relative flex-shrink-0">
                  <img src={imgSrc(f.profile_pic, f.username)} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-transparent hover:ring-primary-400 transition-all" />
                  <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-dark-800 ${f.is_online ? 'bg-green-500' : 'bg-gray-400'}`} title={f.is_online ? "Online" : "Offline"} />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${f.id}`} className="text-base font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors truncate block">{f.username}</Link>
                  <p className="text-xs text-dark-200 mt-0.5">{f.is_online ? "Online now" : `Last seen ${new Date(f.last_seen).toLocaleDateString()}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startChat(f.id)}
                    className="p-2 text-primary-500 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/10 dark:hover:bg-primary-900/30 rounded-lg transition-all" title="Message">
                    <Message style={{ fontSize: 18 }} />
                  </button>
                  <button onClick={async () => { if(confirm('Remove this friend?')) { await removeFriend(f.id); toast.success("Friend removed"); } }}
                    className="p-2 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/30 rounded-lg transition-all" title="Remove friend">
                    <PersonRemove style={{ fontSize: 18 }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Requests */}
        {tab === "requests" && (
          <div className="card divide-y divide-gray-100 dark:divide-dark-400 overflow-hidden">
            {requests.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-4xl mb-3">📬</p>
                <p className="text-gray-600 dark:text-dark-100 font-medium">No pending requests</p>
                <p className="text-sm text-dark-200 mt-1">You're all caught up!</p>
              </div>
            ) : requests.map(r => (
              <div key={r.id} className="flex items-center gap-4 p-4 bg-primary-50/30 dark:bg-primary-900/5">
                <Link to={`/profile/${r.sender_id}`} className="flex-shrink-0">
                  <img src={imgSrc(r.profile_pic, r.username)} alt="" className="w-14 h-14 rounded-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${r.sender_id}`} className="text-base font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors truncate block">{r.username}</Link>
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">Wants to be friends</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={async () => { await acceptRequest(r.id); fetchFriends(); toast.success("Request accepted!"); }}
                    className="btn-primary text-sm px-4 py-1.5 flex items-center gap-1 shadow-sm">
                    <Check style={{ fontSize: 16 }} /> Accept
                  </button>
                  <button onClick={async () => { await rejectRequest(r.id); toast("Request rejected"); }}
                    className="btn-secondary text-sm px-4 py-1.5">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        {tab === "search" && (
          <div>
            <div className="relative mb-5 shadow-sm rounded-xl overflow-hidden">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-200" style={{ fontSize: 22 }} />
              <input value={searchQuery} onChange={e => handleSearch(e.target.value)} placeholder="Search for students, faculty..."
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all font-medium placeholder-dark-200" autoFocus />
            </div>
            {searchQuery.length >= 2 && (
              <div className="card divide-y divide-gray-100 dark:divide-dark-400 overflow-hidden">
                {searchResults.length === 0 ? (
                  <div className="p-8 text-center"><p className="text-dark-200">No users found matching "{searchQuery}"</p></div>
                ) : searchResults.map(u => (
                  <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                    <Link to={`/profile/${u.id}`} className="flex-shrink-0">
                      <img src={imgSrc(u.profile_pic, u.username)} alt="" className="w-12 h-12 rounded-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/profile/${u.id}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors truncate block">{u.username}</Link>
                      <p className="text-xs text-dark-200 capitalize mt-0.5">{u.role}</p>
                    </div>
                    {friends.some(f => f.id === u.id) ? (
                      <span className="text-xs font-semibold text-green-500 bg-green-50 dark:bg-green-900/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Check style={{ fontSize: 14 }} /> Friends
                      </span>
                    ) : (
                      <button onClick={() => handleSendRequest(u.id)} className="btn-secondary text-sm flex items-center gap-1.5">
                        <PersonAdd style={{ fontSize: 16 }} /> Add Friend
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
