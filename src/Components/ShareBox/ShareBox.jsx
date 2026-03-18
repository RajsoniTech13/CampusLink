import { useState, useRef } from "react";
import { Image, EmojiEmotions, Send } from "@mui/icons-material";
import usePostStore from "../../store/postStore.js";
import useAuthStore from "../../store/authStore.js";
import toast from "react-hot-toast";
import { imgSrc } from "../../utils/config.js";

export default function ShareBox() {
  const { user } = useAuthStore();
  const { createPost } = usePostStore();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => { setImage(null); setPreview(null); };

  const handleSubmit = async () => {
    if (!content.trim() && !image) return;
    setLoading(true);
    try {
      const formData = new FormData();
      if (content.trim()) formData.append("content", content);
      if (image) formData.append("image", image);
      await createPost(formData);
      setContent(""); setImage(null); setPreview(null);
      toast.success("Post shared!");
    } catch { toast.error("Failed to create post"); }
    finally { setLoading(false); }
  };

  return (
    <div className="card p-4 mb-4 shadow-sm border border-gray-100 dark:border-dark-700">
      <div className="flex gap-3">
        <img src={imgSrc(user?.profile_pic, user?.username)} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${user?.username?.split(' ')[0]}?`}
            rows={2}
            className="w-full resize-none bg-gray-50 dark:bg-dark-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder-dark-200 text-gray-900 dark:text-white transition-all"
          />
          {preview && (
            <div className="relative mt-2 inline-block">
              <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-cover" />
              <button onClick={removeImage} className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full text-xs hover:bg-black/80">✕</button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-dark-400">
        <div className="flex gap-2">
          <button onClick={() => fileRef.current.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all font-medium">
            <Image style={{ fontSize: 18 }} /> Photo
          </button>
          <input type="file" ref={fileRef} onChange={handleImage} accept="image/*" hidden />
        </div>
        <button onClick={handleSubmit} disabled={loading || (!content.trim() && !image)}
          className="btn-primary flex items-center gap-1.5 text-sm disabled:opacity-40">
          {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send style={{ fontSize: 16 }} />}
          Post
        </button>
      </div>
    </div>
  );
}
