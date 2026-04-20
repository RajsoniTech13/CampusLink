# CampusLink — Full-Stack Campus Social Network

Build a production-ready campus social network (Facebook + WhatsApp + LinkedIn hybrid) on top of an existing React/Vite frontend. Create a Node.js/Express backend with MySQL, migrate styling to Tailwind CSS, and wire everything together with real-time Socket.IO features.

## User Review Required

> [!IMPORTANT]
> **This is a very large project.** I'll build it incrementally — backend first, then frontend rewrites. The existing components (TopBar, Sidebar, Feed, Post, ChatList, Chats, GroupChat, Clubs) will be **rewritten in Tailwind CSS** while preserving the current dark theme aesthetic and layout patterns.

> [!WARNING]
> **MySQL must be installed and running locally.** You'll need to create a `campuslink` database and run the provided SQL schema. I'll include full setup instructions.

> [!IMPORTANT]
> **Cloudinary is marked optional.** Image upload will use Multer to store files locally in `server/uploads/`. If you want Cloudinary, provide your credentials and I'll add it.

---

## Proposed Changes

### Backend — Server Foundation

#### [NEW] [server/](file:///Users/raj.v.soni/CampusLink/server/)
MVC-structured Express backend:

```
server/
├── index.js            # Express + Socket.IO entry
├── .env.example        # Environment template
├── package.json
├── config/
│   └── db.js           # MySQL2 connection pool
├── middleware/
│   ├── auth.js         # JWT verification middleware
│   └── errorHandler.js # Global error handler
├── models/
│   ├── User.js         # User/Student/Faculty queries
│   ├── Post.js         # Posts/Likes/Comments
│   ├── Friend.js       # Friends/Requests
│   ├── Club.js         # Clubs/Members
│   ├── Group.js        # Groups/Members
│   ├── Chat.js         # Chats/Messages
│   └── Notification.js # Notifications
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── postController.js
│   ├── friendController.js
│   ├── clubController.js
│   ├── groupController.js
│   ├── chatController.js
│   └── notificationController.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── posts.js
│   ├── friends.js
│   ├── clubs.js
│   ├── groups.js
│   ├── chats.js
│   └── notifications.js
├── socket/
│   └── socketHandler.js  # Socket.IO event handlers
├── uploads/              # Multer file storage
└── utils/
    └── validators.js     # Input validation helpers
```

---

### Backend — Database Schema

#### [NEW] [schema.sql](file:///Users/raj.v.soni/CampusLink/server/schema.sql)

Full MySQL schema with:
- **Users** (id, username, email, password, role ENUM, profile_pic, cover_pic, bio, created_at)
- **Students** (user_id FK, department, year, enrollment_no)
- **Faculties** (user_id FK, department, designation)
- **Friends** (user_id, friend_id, composite PK, ON DELETE CASCADE)
- **Friend_Requests** (id, sender_id, receiver_id, status ENUM, created_at)
- **Posts** (id, user_id FK, content, image, created_at, club_id nullable FK)
- **Likes** (id, user_id FK, post_id FK, unique constraint)
- **Comments** (id, user_id FK, post_id FK, content, created_at)
- **Stories** (id, user_id FK, image, created_at, expires_at)
- **Clubs** (id, name, description, cover_pic, created_by FK)
- **Club_Members** (club_id, user_id, role ENUM, joined_at)
- **Groups** (id, name, description, created_by FK)
- **Group_Members** (group_id, user_id, joined_at)
- **Chats** (id, type ENUM private/group, group_id nullable, created_at)
- **Chat_Participants** (chat_id, user_id)
- **Messages** (id, chat_id FK, sender_id FK, content, created_at)
- **Notifications** (id, user_id FK, type ENUM, reference_id, content, is_read, created_at)

All with foreign keys, cascading deletes, and proper indexes.

---

### Backend — API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (bcrypt hash, return JWT cookie) |
| POST | `/api/auth/login` | Login (verify password, set JWT cookie) |
| POST | `/api/auth/logout` | Clear cookie |
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/update` | Update own profile |
| GET | `/api/users/search?q=` | Search users |
| POST | `/api/posts` | Create post (with Multer image upload) |
| GET | `/api/posts/feed` | Feed (friends' + own posts, paginated) |
| POST | `/api/posts/:id/like` | Toggle like |
| POST | `/api/posts/:id/comment` | Add comment |
| GET | `/api/posts/:id/comments` | List comments |
| POST | `/api/friends/request` | Send friend request |
| POST | `/api/friends/accept` | Accept friend request |
| POST | `/api/friends/reject` | Reject friend request |
| GET | `/api/friends/list` | List friends |
| GET | `/api/friends/requests` | List pending requests |
| POST | `/api/clubs` | Create club |
| GET | `/api/clubs` | List clubs |
| POST | `/api/clubs/:id/join` | Join club |
| GET | `/api/clubs/:id/posts` | Club posts |
| POST | `/api/groups` | Create group |
| GET | `/api/groups` | List groups |
| POST | `/api/groups/:id/join` | Join group |
| GET | `/api/chats` | List user's chats |
| GET | `/api/chats/:id/messages` | Chat message history |
| GET | `/api/notifications` | List notifications |
| PUT | `/api/notifications/read` | Mark all read |

---

### Backend — Socket.IO

Events handled in `socketHandler.js`:
- `connection` — authenticate via JWT, store online status
- `join-chat` — join a chat room
- `send-message` — send message, persist to DB, broadcast
- `typing` / `stop-typing` — typing indicators
- `disconnect` — update offline status, broadcast

---

### Frontend — Configuration Changes

#### [MODIFY] [package.json](file:///Users/raj.v.soni/CampusLink/package.json)
Add Tailwind CSS, Zustand, react-hot-toast, react-intersection-observer. Remove Bootstrap CDN from index.html.

#### [NEW] [tailwind.config.js](file:///Users/raj.v.soni/CampusLink/tailwind.config.js)
Custom theme extending dark palette matching existing aesthetic (dark gradients, purple/blue accents).

#### [NEW] [postcss.config.js](file:///Users/raj.v.soni/CampusLink/postcss.config.js)

#### [MODIFY] [index.html](file:///Users/raj.v.soni/CampusLink/index.html)
Remove Bootstrap CDN links, update title to "CampusLink", keep Google Fonts.

#### [NEW] [src/index.css](file:///Users/raj.v.soni/CampusLink/src/index.css)
Tailwind directives + custom CSS variables for dark/light mode + global styles preserving the animated gradient background.

---

### Frontend — State & Services

#### [NEW] [src/store/](file:///Users/raj.v.soni/CampusLink/src/store/)
- `authStore.js` — user session, login/logout actions
- `postStore.js` — feed posts, infinite scroll pagination
- `friendStore.js` — friend list, requests
- `chatStore.js` — active chats, messages, socket connection
- `notificationStore.js` — notifications, unread count
- `themeStore.js` — dark/light mode toggle

#### [NEW] [src/services/](file:///Users/raj.v.soni/CampusLink/src/services/)
- `api.js` — Axios instance with cookie credentials, interceptors
- `socket.js` — Socket.IO client singleton

---

### Frontend — Pages (Rewrite)

All pages rewritten with Tailwind CSS, API integration, and modern UI:

#### [MODIFY] [Login](file:///Users/raj.v.soni/CampusLink/src/Pages/Login/login.jsx)
Glassmorphism card, animated gradient background, form validation, API call.

#### [MODIFY] [Register](file:///Users/raj.v.soni/CampusLink/src/Pages/Register/register.jsx)
Multi-field form with profile photo upload, role selection (Student/Faculty), department field.

#### [MODIFY] [Home](file:///Users/raj.v.soni/CampusLink/src/Pages/home/home.jsx)
3-column layout: Sidebar | Feed (infinite scroll + stories) | Rightbar (online friends, suggestions).

#### [MODIFY] [Profile](file:///Users/raj.v.soni/CampusLink/src/Pages/Profile/profile.jsx)
Cover photo, avatar, bio, user's posts, friend count, edit profile modal.

#### [NEW] [Friends page](file:///Users/raj.v.soni/CampusLink/src/Pages/Friends/Friends.jsx)
Friend list, pending requests with accept/reject, user search.

#### [NEW] [Chat page](file:///Users/raj.v.soni/CampusLink/src/Pages/Chat/Chat.jsx)
WhatsApp-style: conversation list left, active chat right, real-time messages.

#### [NEW] [Groups page](file:///Users/raj.v.soni/CampusLink/src/Pages/Groups/Groups.jsx)
Group list, create group dialog, group chat view.

#### [NEW] [Clubs page](file:///Users/raj.v.soni/CampusLink/src/Pages/Clubs/Clubs.jsx)
Club cards, club detail view with posts feed, join/leave.

---

### Frontend — Components (Rewrite in Tailwind)

#### [MODIFY] [TopBar](file:///Users/raj.v.soni/CampusLink/src/Components/TopBar/topbar.jsx)
LinkedIn-style navbar: logo, search with debounce, icons with badges (notifications, chat, friends), profile dropdown, dark mode toggle.

#### [MODIFY] [Sidebar](file:///Users/raj.v.soni/CampusLink/src/Components/sidebar/sidebar.jsx)
Collapsible sidebar with icons + labels, active state, friend list at bottom.

#### [MODIFY] [Feed](file:///Users/raj.v.soni/CampusLink/src/Components/feed/feed.jsx)
Infinite scroll with intersection observer, skeleton loaders.

#### [MODIFY] [Post](file:///Users/raj.v.soni/CampusLink/src/Components/post/post.jsx)
Post card with avatar, like/comment buttons connected to API, comment section expandable.

#### [MODIFY] [Share](file:///Users/raj.v.soni/CampusLink/src/Components/share/share.jsx)
Create post form with image upload, preview.

#### [NEW] Story component
Horizontal scrollable story bar with circular avatars.

#### [NEW] Skeleton loader components
Skeleton placeholders for posts, chat list, profile.

#### [NEW] Notification dropdown component

---

## Verification Plan

### Automated Tests
1. **Backend API testing** — use `curl` commands or a test script to verify all endpoints:
   ```bash
   # From project root:
   cd server && node index.js
   # In another terminal, test registration:
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@campus.edu","password":"Test123!"}'
   ```

2. **Frontend build verification**:
   ```bash
   cd /Users/raj.v.soni/CampusLink && npm run build
   ```

### Browser Verification
- Use the browser tool to navigate to `http://localhost:5173` and verify:
  - Login/Register pages render correctly
  - Authentication flow works
  - Dashboard loads with feed
  - Chat interface is functional
  - Dark/light mode toggle works
  - Responsive layout on different viewport sizes

### Manual Verification (User)
- **MySQL setup**: User should run `schema.sql` against their local MySQL instance
- **Socket.IO**: User can open two browser tabs to verify real-time chat
- **Mobile responsive**: User can test on mobile device or use browser DevTools
