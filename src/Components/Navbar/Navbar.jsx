import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search, Home, Chat, Group, Notifications, Person,
  DarkMode, LightMode, Logout, Settings, School,
  Diversity2Sharp,
} from "@mui/icons-material";
import useAuthStore from "../../store/authStore.js";
import useThemeStore from "../../store/themeStore.js";
import useNotificationStore from "../../store/notificationStore.js";
import useFriendStore from "../../store/friendStore.js";
import { imgSrc } from "../../utils/config.js";
import api from "../../services/api.js";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { unreadCount, fetchNotifications, notifications, markAllRead } = useNotificationStore();
  const { requests } = useFriendStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchTimer = useRef(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  const handleSearch = (val) => {
    setSearchQuery(val);
    clearTimeout(searchTimer.current);
    if (val.length < 2) { setSearchResults([]); return; }
    searchTimer.current = setTimeout(async () => {
      try {
        const { data } = await api.get(`/users/search?q=${val}`);
        setSearchResults(data);
        setShowSearch(true);
      } catch { /* ignore */ }
    }, 300);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/friends", icon: Person, label: "Friends", badge: requests.length },
    { path: "/chat", icon: Chat, label: "Chat" },
    { path: "/groups", icon: Group, label: "Groups" },
    { path: "/clubs", icon: Diversity2Sharp, label: "Clubs" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-dark-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-600 rounded-lg flex items-center justify-center">
            <School className="text-white" style={{ fontSize: 18 }} />
          </div>
          <span className="text-lg font-display font-bold text-gradient hidden sm:inline">CampusLink</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-200" style={{ fontSize: 20 }} />
            <input
              type="text"
              placeholder="Search users, clubs..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowSearch(true)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-dark-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder-dark-200 text-gray-900 dark:text-white transition-all"
            />
          </div>
          {showSearch && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white dark:bg-dark-600 rounded-xl shadow-lg border border-gray-200 dark:border-dark-400 py-2 max-h-60 overflow-y-auto animate-slide-down">
              {searchResults.map((u) => (
                <button key={u.id} onClick={() => { navigate(`/profile/${u.id}`); setShowSearch(false); setSearchQuery(""); }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-500 transition-colors text-left">
                  <img src={imgSrc(u.profile_pic, u.username)} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{u.username}</p>
                    <p className="text-xs text-dark-200 capitalize">{u.role}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ path, icon: IconComponent, label, badge }) => ( // eslint-disable-line no-unused-vars
            <Link key={path} to={path}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(path) ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400" :
                "text-gray-600 dark:text-dark-100 hover:bg-gray-100 dark:hover:bg-dark-600"}`}>
              <IconComponent style={{ fontSize: 20 }} />
              <span className="hidden lg:inline">{label}</span>
              {badge > 0 && <span className="badge absolute -top-1 -right-1">{badge}</span>}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-600 dark:text-dark-100 transition-all">
            {theme === 'dark' ? <LightMode style={{ fontSize: 20 }} /> : <DarkMode style={{ fontSize: 20 }} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-600 dark:text-dark-100 transition-all">
              <Notifications style={{ fontSize: 20 }} />
              {unreadCount > 0 && <span className="badge absolute -top-0.5 -right-0.5 text-[10px]">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-white dark:bg-dark-600 rounded-xl shadow-lg border border-gray-200 dark:border-dark-400 animate-slide-down overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-dark-400">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary-500 hover:text-primary-400 font-medium">Mark all read</button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center py-8 text-dark-200 text-sm">No notifications yet</p>
                  ) : notifications.slice(0, 10).map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-gray-50 dark:border-dark-500 hover:bg-gray-50 dark:hover:bg-dark-500 transition-colors ${!n.is_read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                      <p className="text-sm text-gray-700 dark:text-dark-100">{n.content}</p>
                      <p className="text-xs text-dark-200 mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-all">
              <img
                src={imgSrc(user?.profile_pic, user?.username)}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-dark-400"
              />
            </button>
            {showProfile && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-dark-600 rounded-xl shadow-lg border border-gray-200 dark:border-dark-400 py-2 animate-slide-down">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-500">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{user?.username}</p>
                  <p className="text-xs text-dark-200 capitalize">{user?.role}</p>
                </div>
                <Link to={`/profile/${user?.id}`} onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-dark-100 hover:bg-gray-50 dark:hover:bg-dark-500 transition-colors">
                  <Person style={{ fontSize: 18 }} /> My Profile
                </Link>
                <button onClick={() => { logout(); navigate("/"); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Logout style={{ fontSize: 18 }} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex items-center justify-around border-t border-gray-200 dark:border-dark-400 px-2 py-1">
        {navLinks.map(({ path, icon: IconComponent, badge }) => ( // eslint-disable-line no-unused-vars
          <Link key={path} to={path}
            className={`relative p-2 rounded-lg ${isActive(path) ? "text-primary-500" : "text-gray-500 dark:text-dark-200"}`}>
            <IconComponent style={{ fontSize: 22 }} />
            {badge > 0 && <span className="badge absolute -top-0.5 -right-0.5 text-[10px]">{badge}</span>}
          </Link>
        ))}
      </div>
    </nav>
  );
}
