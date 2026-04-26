import { useEffect, useState } from "react";
import { Add, Group as GroupIcon, People, Chat } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import useChatStore from "../../store/chatStore.js";
import { imgSrc } from "../../utils/config.js";
import api from "../../services/api.js";
import toast from "react-hot-toast";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const { data } = await api.get('/groups');
      setGroups(data);
    } catch { toast.error("Failed to load groups"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchGroups(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) return toast.error("Name required");
    try {
      await api.post('/groups', form);
      setShowCreate(false); setForm({ name: "", description: "" });
      fetchGroups();
      toast.success("Group created!");
    } catch (e) { toast.error(e.response?.data?.error || "Failed"); }
  };

  const handleJoin = async (id) => {
    try { await api.post(`/groups/${id}/join`); fetchGroups(); toast.success("Joined!"); }
    catch { toast.error("Failed"); }
  };

  const handleLeave = async (id) => {
    try { await api.post(`/groups/${id}/leave`); fetchGroups(); toast("Left group"); }
    catch { toast.error("Failed"); }
  };

  const openGroupChat = async (groupId) => {
    try {
      const { data } = await api.get(`/chats/group/${groupId}`);
      if (data.chatId) navigate('/chat', { state: { activeChat: data.chatId } });
    } catch { toast.error("No group chat found"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groups</h1>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-1.5 text-sm">
            <Add style={{ fontSize: 18 }} /> Create Group
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">{[1,2,3,4].map(i => <div key={i} className="skeleton h-40 rounded-xl" />)}</div>
        ) : groups.length === 0 ? (
          <div className="card p-12 text-center"><p className="text-4xl mb-3">📚</p><p className="text-dark-200">No groups yet. Create one!</p></div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {groups.map(g => (
              <div key={g.id} className="card p-5 hover:shadow-lg transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white flex-shrink-0">
                    <GroupIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{g.name}</h3>
                    <p className="text-xs text-dark-200">by {g.creator_name}</p>
                  </div>
                </div>
                {g.description && <p className="text-sm text-gray-600 dark:text-dark-100 mb-3 line-clamp-2">{g.description}</p>}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-dark-200"><People style={{ fontSize: 14 }} /> {g.member_count} members</span>
                  <div className="flex gap-2">
                    {g.is_member ? (
                      <>
                        <button onClick={() => openGroupChat(g.id)} className="btn-secondary text-xs flex items-center gap-1"> <Chat style={{ fontSize: 14 }} /> Chat</button>
                        <button onClick={() => handleLeave(g.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1">Leave</button>
                      </>
                    ) : (
                      <button onClick={() => handleJoin(g.id)} className="btn-primary text-xs">Join</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-dark-600 rounded-2xl p-6 w-full max-w-md mx-4 animate-scale-in" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create Group</h2>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Group name" className="input-field" autoFocus />
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description (optional)" rows={3} className="input-field resize-none" />
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
