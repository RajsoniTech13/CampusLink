import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, CameraAlt, LocationOn, School as SchoolIcon, CalendarMonth, Message } from "@mui/icons-material";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import PostCard from "../../Components/PostCard/PostCard.jsx";
import { PostSkeleton, ProfileSkeleton } from "../../Components/Skeletons/Skeletons.jsx";
import useAuthStore from "../../store/authStore.js";
import { imgSrc } from "../../utils/config.js";
import api from "../../services/api.js";
import toast from "react-hot-toast";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ bio: "", city: "", username: "" });
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [newCoverPic, setNewCoverPic] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const userId = id ? parseInt(id) : me?.id;
  const isOwn = userId === me?.id;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      api.get(`/users/${userId}`),
      api.get(`/posts/user/${userId}`),
    ]).then(([userRes, postsRes]) => {
      setProfile(userRes.data);
      setPosts(postsRes.data.posts);
      if (isOwn) setEditForm({ bio: userRes.data.bio || "", city: userRes.data.city || "", username: userRes.data.username || "" });
    }).catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSave = async () => {
    setUploading(true);
    try {
      // 1. Update basic info
      const { data } = await api.put("/users/update", editForm);
      let updatedUser = { ...data.user };

      // 2. Upload Profile Pic if changed
      if (newProfilePic instanceof File) {
        const formData = new FormData();
        formData.append("image", newProfilePic);
        const picRes = await api.put("/users/profile-pic", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        updatedUser.profile_pic = picRes.data.profile_pic;
      }

      // 3. Upload Cover Pic if changed
      if (newCoverPic instanceof File) {
        const formData = new FormData();
        formData.append("image", newCoverPic);
        const coverRes = await api.put("/users/cover-pic", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        updatedUser.cover_pic = coverRes.data.cover_pic;
      }

      setProfile({ ...profile, ...updatedUser });
      updateUser(updatedUser);
      setEditModal(false);
      setNewProfilePic(null);
      setNewCoverPic(null);
      toast.success("Profile updated!");
    } catch { 
      toast.error("Update failed"); 
    } finally {
      setUploading(false);
    }
  };

  const startChat = async () => {
    try {
      const { data } = await api.post('/chats/private', { userId: profile.id });
      navigate('/chat', { state: { activeChat: data.chatId } });
    } catch {
      toast.error("Failed to start chat");
    }
  };

  const handlePicChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'profile') setNewProfilePic(file);
      else setNewCoverPic(file);
    }
  };

  if (loading) return (<div className="min-h-screen bg-gray-50 dark:bg-dark-900"><Navbar /><div className="max-w-3xl mx-auto pt-4 px-4"><ProfileSkeleton />{[1,2].map(i => <PostSkeleton key={i} />)}</div></div>);

  // Preview URLs for edit modal
  const profilePreview = newProfilePic instanceof File ? URL.createObjectURL(newProfilePic) : imgSrc(profile?.profile_pic, profile?.username);
  const coverPreview = newCoverPic instanceof File ? URL.createObjectURL(newCoverPic) : (profile?.cover_pic ? imgSrc(profile.cover_pic) : null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4">
        {/* Cover & Avatar */}
        <div className="relative mt-4">
          <div className="h-48 md:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-primary-600 to-accent-600 shadow-sm" >
            {profile?.cover_pic && <img src={imgSrc(profile.cover_pic)} alt="Cover" className="w-full h-full object-cover" />}
          </div>
          <div className="absolute -bottom-16 left-6 flex items-end gap-4">
            <div className="relative p-1 bg-gray-50 dark:bg-dark-900 rounded-full">
              <img src={imgSrc(profile?.profile_pic, profile?.username)} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-dark-800 shadow-md" />
              {profile?.is_online && <span className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-dark-800" title="Online" />}
            </div>
          </div>
          
          {!isOwn && profile && (
             <div className="absolute -bottom-12 right-4 flex gap-2">
               <button onClick={startChat} className="btn-primary flex items-center gap-1.5 shadow-md">
                 <Message style={{ fontSize: 18 }} /> Message
               </button>
             </div>
          )}
        </div>

        {/* Info */}
        <div className="card mt-20 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.username}</h1>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 capitalize mt-0.5">{profile?.role}</p>
              {profile?.bio && <p className="text-base text-gray-700 dark:text-dark-50 mt-3 whitespace-pre-wrap">{profile.bio}</p>}
              
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4 text-sm text-dark-200">
                {profile?.city && <span className="flex items-center gap-1.5"><LocationOn style={{ fontSize: 16 }} />{profile.city}</span>}
                {profile?.details?.department && <span className="flex items-center gap-1.5"><SchoolIcon style={{ fontSize: 16 }} />{profile.details.department}</span>}
                <span className="flex items-center gap-1.5"><CalendarMonth style={{ fontSize: 16 }} />Joined {new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
            {isOwn && (
              <button onClick={() => setEditModal(true)} className="btn-secondary flex items-center gap-1.5 text-sm font-medium h-fit">
                <Edit style={{ fontSize: 16 }} /> Edit Profile
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-dark-700">
            <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-dark-800/50">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.postCount || 0}</p>
              <p className="text-xs font-medium text-dark-200 uppercase tracking-wider mt-1">Posts</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-dark-800/50">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.friendCount || 0}</p>
              <p className="text-xs font-medium text-dark-200 uppercase tracking-wider mt-1">Friends</p>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">Posts by {profile?.username?.split(' ')[0]}</h2>
          {posts.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-dark-200 font-medium">No posts to show</p>
            </div>
          ) : posts.map(p => <PostCard key={p.id} post={p} />)}
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setEditModal(false)}>
          <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in my-8" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center sticky top-0 bg-white dark:bg-dark-800 rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Profile</h2>
              <button onClick={() => setEditModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-100 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="p-5 space-y-6">
              {/* Cover Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-dark-100 mb-2">Cover Photo</label>
                <div className="relative h-32 rounded-xl bg-gray-100 dark:bg-dark-700 overflow-hidden group">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary-500/20 to-accent-500/20" />
                  )}
                  <button onClick={() => coverInputRef.current.click()} className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white cursor-pointer">
                    <CameraAlt style={{ fontSize: 24 }} />
                    <span className="text-xs font-medium mt-1">Change Cover</span>
                  </button>
                  <input type="file" ref={coverInputRef} onChange={e => handlePicChange(e, 'cover')} accept="image/*" className="hidden" />
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-dark-100 mb-2">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden group border-2 border-gray-200 dark:border-dark-600">
                    <img src={profilePreview} alt="Profile Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                    <button onClick={() => profileInputRef.current.click()} className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white cursor-pointer">
                      <CameraAlt style={{ fontSize: 20 }} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <button onClick={() => profileInputRef.current.click()} className="btn-secondary text-sm">Upload new picture</button>
                    <input type="file" ref={profileInputRef} onChange={e => handlePicChange(e, 'profile')} accept="image/*" className="hidden" />
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-100 mb-1.5">Username</label>
                  <input value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})} className="input-field" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-100 mb-1.5">Bio</label>
                  <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} rows={3} className="input-field max-h-32" placeholder="Tell us about yourself..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-100 mb-1.5">City</label>
                  <input value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} className="input-field" placeholder="Where are you located?" />
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-100 dark:border-dark-700 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-dark-800 rounded-b-2xl z-10">
              <button onClick={() => setEditModal(false)} className="px-5 py-2 text-sm font-medium text-gray-600 dark:text-dark-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={uploading} className="btn-primary min-w-[120px]">
                {uploading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin flex m-auto" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
