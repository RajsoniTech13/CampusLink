# CampusLink 🎓

A production-ready campus social network (Facebook + WhatsApp + LinkedIn hybrid) built with React, Node.js, Express, MySQL, Socket.IO, and Tailwind CSS.

## ✨ Features

- **Auth**: JWT + Cookies, bcrypt password hashing, protected routes
- **Social Feed**: Create posts with images, like, comment, infinite scroll
- **Real-time Chat**: 1-1 and group chat via Socket.IO, typing indicators
- **Anonymous Hub**: Campus-wide anonymous chat with unique session aliases
- **Friends**: Send/accept/reject requests, online/offline status
- **Groups**: Create, join, group chat integration
- **Clubs**: Create, join, club-specific post feeds
- **Notifications**: Real-time push, like/comment/friend request triggers
- **Dark/Light Mode**: Toggle with persistence
- **Responsive**: Mobile + Desktop layouts
- **Search**: Debounced user search, club search

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS |
| State | Zustand |
| Backend | Node.js + Express.js |
| Database | MySQL |
| Auth | JWT + httpOnly Cookies |
| Real-time | Socket.IO |
| File Upload | Multer (local storage) |
| Icons | MUI Icons |

## 📁 Project Structure

```
CampusLink/
├── src/                    # React frontend
│   ├── Components/         # Reusable components
│   │   ├── Navbar/
│   │   ├── PostCard/
│   │   ├── ShareBox/
│   │   └── Skeletons/
│   ├── Pages/              # Route pages
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Home/
│   │   ├── Profile/
│   │   ├── Friends/
│   │   ├── Chat/
│   │   ├── Groups/
│   │   └── Clubs/
│   ├── store/              # Zustand stores
│   ├── services/           # API + Socket clients
│   └── index.css           # Tailwind + global styles
├── server/                 # Express backend
│   ├── config/db.js        # MySQL connection
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth, error handler
│   ├── models/             # Database queries
│   ├── routes/             # API routes
│   ├── socket/             # Socket.IO handler
│   ├── uploads/            # File storage
│   ├── utils/              # Validators
│   ├── schema.sql          # Database schema
│   └── index.js            # Server entry
└── tailwind.config.js
```

## 🚀 Quick Start (Docker)

The easiest way to start CampusLink is using Docker. It will automatically set up the MySQL database, the Backend, and the Frontend for you.

```bash
# 1. Start everything
docker-compose up --build

# 2. Open your browser
Visit http://localhost:5173
```

---

## 🛠️ Manual Setup (Alternative)

### Prerequisites
- **Node.js** >= 18
- **MySQL** >= 8.0
- **npm** >= 9

### 1. Database Setup
```bash
mysql -u root -p -e "CREATE DATABASE campuslink;"
mysql -u root -p campuslink < server/schema.sql
mysql -u root -p campuslink < server/migration_anonymous_chat.sql
```

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Setup
```bash
npm install
npm run dev
```

---

**Demo Credentials:**
- Email: `demo@campus.edu`
- Password: `password123`


(or register a new account)

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Session check |
| GET | `/api/users/:id` | Get profile |
| PUT | `/api/users/update` | Update profile |
| GET | `/api/users/search` | Search users |
| POST | `/api/posts` | Create post |
| GET | `/api/posts/feed` | Get feed |
| POST | `/api/posts/:id/like` | Toggle like |
| POST | `/api/posts/:id/comment` | Comment |
| POST | `/api/friends/request` | Friend request |
| POST | `/api/friends/accept` | Accept request |
| GET | `/api/friends/list` | List friends |
| GET | `/api/chats` | List chats |
| GET | `/api/chats/:id/messages` | Messages |
| POST | `/api/clubs` | Create club |
| POST | `/api/groups` | Create group |
| GET | `/api/anonymous/messages` | Get anonymous hub history |
| GET | `/api/notifications` | Notifications |

## 🔌 Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-chat` | Client → Server | Join chat room |
| `send-message` | Client → Server | Send message |
| `new-message` | Server → Client | Receive message |
| `typing` | Bi-directional | Typing indicator |
| `user-online` | Server → Client | User came online |
| `user-offline` | Server → Client | User went offline |
| `join-hub` | Client → Server | Join anonymous hub |
| `hub-message` | Client → Server | Send anonymous message |
| `hub-new-message` | Server → Client | Receive anonymous message |
| `hub-typing` | Client → Server | Anonymous typing indicator |
| `notification` | Server → Client | Push notification |

## 🎨 Theme

The app supports **Dark** and **Light** mode with a toggle in the navbar. The theme preference is persisted in localStorage.

---

Built with ❤️ by [RajSoni](https://github.com/RajsoniTech13)
