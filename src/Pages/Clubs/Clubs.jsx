import { useEffect, useState } from "react";
import { Add, Diversity2Sharp, People, ArrowBack } from "@mui/icons-material";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import PostCard from "../../Components/PostCard/PostCard.jsx";
import ShareBox from "../../Components/ShareBox/ShareBox.jsx";
import api from "../../services/api.js";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const imgSrc = (pic) => pic?.startsWith('/') ? `${API_URL}${pic}` : pic;

function ClubDetail({ club, goBack }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/clubs/${club.id}/posts`).then(r => setPosts(r.data.posts)).catch(() => {}).finally(() => setLoading(false));
  }, [club.id]);

  return (
    <div>
      <button onClick={goBack} className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-400 mb-4">
        <ArrowBack style={{ fontSize: 18 }} /> Back to Clubs
      </button>
      <div className="card overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-accent-600 to-primary-600">
          {club.cover_pic && <img src={imgSrc(club.cover_pic)} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{club.name}</h2>
          <p className="text-sm text-dark-200 mt-1">{club.description}</p>
          <p className="text-xs text-dark-200 mt-2"><People style={{ fontSize: 14 }} className="mr-1" />{club.member_count} members • Created by {club.creator_name}</p>
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Club Posts</h3>
      {loading ? <div className="skeleton h-32 rounded-xl" /> :
       posts.length === 0 ? <div className="card p-8 text-center text-dark-200">No posts in this club yet</div> :
       posts.map(p => <PostCard key={p.id} post={p} />)}
    </div>
  );
}

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchClubs = async () => {
    try { const { data } = await api.get('/clubs'); setClubs(data); }
    catch { toast.error("Failed to load clubs"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClubs(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) return toast.error("Name required");
    try {
      await api.post('/clubs', form);
      setShowCreate(false); setForm({ name: "", description: "" });
      fetchClubs();
      toast.success("Club created!");
    } catch (e) { toast.error(e.response?.data?.error || "Failed"); }
  };

  const handleJoin = async (id) => {
    try { await api.post(`/clubs/${id}/join`); fetchClubs(); toast.success("Joined!"); } catch { toast.error("Failed"); }
  };

  const handleLeave = async (id) => {
    try { await api.post(`/clubs/${id}/leave`); fetchClubs(); toast("Left club"); } catch { toast.error("Failed"); }
  };

  const filtered = clubs.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        {selectedClub ? (
          <ClubDetail club={selectedClub} goBack={() => setSelectedClub(null)} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clubs & Communities</h1>
              <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-1.5 text-sm">
                <Add style={{ fontSize: 18 }} /> Create Club
              </button>
            </div>

            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search clubs..."
              className="input-field mb-4" />

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">{[1,2,3,4].map(i => <div key={i} className="skeleton h-48 rounded-xl" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="card p-12 text-center"><p className="text-4xl mb-3">🎭</p><p className="text-dark-200">No clubs found</p></div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map(c => (
                  <div key={c.id} className="card overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setSelectedClub(c)}>
                    <div className="h-24 bg-gradient-to-r from-accent-500/80 to-primary-500/80 relative overflow-hidden">
                      {c.cover_pic && <img src={imgSrc(c.cover_pic)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 -mt-8 rounded-xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                          <Diversity2Sharp style={{ fontSize: 20 }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{c.name}</h3>
                          <p className="text-xs text-dark-200">{c.member_count} members</p>
                        </div>
                      </div>
                      {c.description && <p className="text-xs text-gray-600 dark:text-dark-100 line-clamp-2 mb-3">{c.description}</p>}
                      <div className="flex justify-end" onClick={e => e.stopPropagation()}>
                        {c.is_member ? (
                          <button onClick={() => handleLeave(c.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1">Leave</button>
                        ) : (
                          <button onClick={() => handleJoin(c.id)} className="btn-primary text-xs">Join</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-dark-600 rounded-2xl p-6 w-full max-w-md mx-4 animate-scale-in" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create Club</h2>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Club name" className="input-field" autoFocus />
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" rows={3} className="input-field resize-none" />
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleCreate} className="btn-primary flex-1">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
