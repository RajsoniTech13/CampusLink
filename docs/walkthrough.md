# CampusLink — Build Walkthrough

## Summary

Built a **complete full-stack campus social network** from an existing React prototype with dummy data. Added an Express.js backend with MySQL, rewrote all frontend components in Tailwind CSS, and integrated everything with Zustand state management and Socket.IO real-time features.

---

## What Was Built

### Backend (`server/`)
| Component | Files | Key Functionality |
|-----------|-------|------------------|
| **SQL Schema** | [schema.sql](file:///Users/raj.v.soni/CampusLink/server/schema.sql) | 17 tables with FKs, cascading deletes, indexes, seed data |
| **Auth** | controllers + middleware | JWT cookies, bcrypt hashing, session check |
| **Models** (7) | User, Post, Friend, Club, Group, Chat, Notification | Full CRUD with pagination, search, aggregations |
| **Controllers** (8) | auth, user, post, friend, club, group, chat, notification | Validation, notifications, image upload |
| **Routes** (8) | RESTful routes | 27+ endpoints |
| **Socket.IO** | [socketHandler.js](file:///Users/raj.v.soni/CampusLink/server/socket/socketHandler.js) | Real-time chat, typing indicators, online tracking |
| **Server** | [index.js](file:///Users/raj.v.soni/CampusLink/server/index.js) | Express + Socket.IO + CORS + static files |

### Frontend ([src/](file:///Users/raj.v.soni/CampusLink/src))
| Page | Key Features |
|------|-------------|
| **Login** | Glassmorphism card, animated blobs, API auth |
| **Register** | Role-conditional fields (student/faculty), validation |
| **Home** | 3-column layout, infinite scroll, ShareBox, skeleton loaders |
| **Profile** | Cover photo, avatar, edit modal, user's posts |
| **Friends** | 3-tab (friends/requests/search), debounced search |
| **Chat** | WhatsApp-style split view, Socket.IO real-time, typing |
| **Groups** | Grid cards, create modal, join/leave, group chat |
| **Clubs** | Grid with hover effects, detail view with club posts |
| **Navbar** | Search, notifications dropdown, dark/light toggle, mobile nav |

### State Management (Zustand)
6 stores: auth, posts, friends, chat, notifications, theme

---

## User Setup Required

> [!IMPORTANT]
> `npm install` failed during build due to a network connectivity issue. You need to run the following steps manually:

### 1. Install dependencies
```bash
# Backend
cd server && npm install

# Frontend (from project root)
cd .. && npm install
```

### 2. Set up MySQL
```bash
mysql -u root -p
source /Users/raj.v.soni/CampusLink/server/schema.sql;
```

### 3. Configure [.env](file:///Users/raj.v.soni/CampusLink/server/.env)
Edit [server/.env](file:///Users/raj.v.soni/CampusLink/server/.env) — set `DB_PASSWORD` to your MySQL password.

### 4. Start both servers
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend 
npm run dev
```

### 5. Open `http://localhost:5173`
Demo login: `demo@campus.edu` / `password123`
