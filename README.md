<div align="center">

# Arsi Aseko University

### Student Communication Platform

A full-stack social platform built by students, for students — connecting the Arsi Aseko University community through posts, real-time messaging, and academic collaboration.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](#)

---

A **community-first** platform where Arsi Aseko University students can share ideas, ask questions, collaborate on academics, and stay connected — all in one place.

</div>

---

## Key Features

<table>
<tr>
<td width="50%">

### Core
- **Post Feed** — Create, like, comment, repost, and quote posts
- **Rich Text Editor** — Format posts with React Quill
- **Polls** — Create polls inside posts with expiring votes
- **Bookmarks** — Save posts to read later
- **Search** — Find users, posts, and trending topics

</td>
<td width="50%">

### Communication
- **Direct Messages** — One-on-one real-time chat
- **Group Chats** — Create group conversations with classmates
- **Typing Indicators** — See when someone is typing
- **Read Receipts** — Track who read your messages
- **Online Status** — Know who's currently active

</td>
</tr>
<tr>
<td>

### Campus
- **Events** — Discover and share campus events
- **Announcements** — Stay updated with university news
- **Academic Calendar** — Track important dates
- **Resource Library** — Upload and download study materials
- **Campus Gallery** — Share campus photos
- **Virtual ID** — Carry your student ID on your phone

</td>
<td>

### Platform
- **Dark / Light Theme** — Toggle with system detection
- **Mobile Responsive** — Optimized for all devices
- **PWA Support** — Install as a native app
- **Admin Dashboard** — Moderate content and manage users
- **Report System** — Flag spam, harassment, or inappropriate content
- **Real-time Notifications** — Instant alerts for all activity

</td>
</tr>
</table>

---

## Tech Stack

### Frontend
| Library | Purpose |
|---------|---------|
| React 19 | UI library |
| Vite 8 | Build tool & dev server |
| Tailwind CSS 4 | Utility-first styling |
| Radix UI + shadcn/ui | Accessible component primitives |
| Framer Motion | Page transitions & animations |
| Socket.io Client | Real-time WebSocket connection |
| React Router 7 | Client-side routing |
| Axios | HTTP client with auth interceptors |
| Lucide React | Icon system |
| React Quill | Rich text editor |
| Sonner | Toast notifications |

### Backend
| Library | Purpose |
|---------|---------|
| Express 5 | REST API framework |
| MongoDB + Mongoose | Database & ODM |
| Socket.io 4 | Real-time WebSocket server |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Cloudinary | Image upload & hosting |
| Nodemailer | Email verification & password reset |
| Helmet | HTTP security headers |
| express-rate-limit | API rate limiting |
| express-validator | Input validation |

---

## Project Structure

```
student-platform/
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/                # Axios instance & interceptors
│   │   ├── components/         # UI components (Navbar, PostCard, Sidebars, etc.)
│   │   │   └── ui/             # shadcn/ui primitives
│   │   ├── context/            # Auth, Socket, Theme providers
│   │   ├── hooks/              # Custom hooks (fetch, scroll, typing)
│   │   ├── lib/                # Utilities & API URL config
│   │   ├── pages/              # 23 page components
│   │   ├── App.jsx             # Router & layout
│   │   └── main.jsx            # Entry point
│   └── vite.config.js
│
├── server/                     # Backend (Express + MongoDB)
│   ├── config/                 # Env validation, Cloudinary setup
│   ├── controllers/            # Route handlers (8 controllers)
│   ├── middleware/              # Auth, socket auth, validation
│   ├── models/                 # Mongoose schemas (8 models)
│   ├── routes/                 # API routes (8 route files)
│   ├── utils/                  # Email sender
│   ├── tests/                  # API tests
│   ├── app.js                  # Express app config
│   └── index.js                # Server entry (MongoDB + Socket.io)
│
└── render.yaml                 # Render deployment blueprint
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **MongoDB** (local installation or [Atlas](https://www.mongodb.com/atlas) account)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/student-platform.git
cd student-platform
```

### 2. Backend setup

```bash
cd server
cp .env.example .env       # Configure your environment variables
npm install
npm run dev                 # Starts on http://localhost:5010
```

### 3. Frontend setup

```bash
cd client
npm install
npm run dev                 # Starts on http://localhost:5180
```

### 4. Open in browser

Visit **http://localhost:5180** — the Vite dev server proxies API requests to the backend automatically.

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing |
| `CLIENT_URL` | Yes | Frontend URL for CORS & email links |
| `PORT` | No | Server port (default: `5010`) |
| `NODE_ENV` | No | `development` or `production` |
| `ADMIN_EMAILS` | No | Comma-separated admin email addresses |
| `CLOUDINARY_CLOUD_NAME` | No | For image uploads |
| `CLOUDINARY_API_KEY` | No | For image uploads |
| `CLOUDINARY_API_SECRET` | No | For image uploads |
| `EMAIL_HOST` | Prod | SMTP host for email verification |
| `EMAIL_PORT` | Prod | SMTP port |
| `EMAIL_USER` | Prod | SMTP username |
| `EMAIL_PASS` | Prod | SMTP password |

### Frontend (`client/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | API base URL (proxied by Vite) |

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new account |
| POST | `/api/auth/login` | Login |
| GET | `/api/posts` | Get paginated feed |
| POST | `/api/posts` | Create post |
| POST | `/api/posts/:id/like` | Like / unlike |
| POST | `/api/posts/:id/repost` | Repost / quote |
| POST | `/api/comments/:postId` | Add comment |
| GET | `/api/users/search` | Search users |
| POST | `/api/users/:id/follow` | Follow / unfollow |
| GET | `/api/messages/conversations` | List conversations |
| POST | `/api/messages/:conversationId` | Send message |
| POST | `/api/reports` | Report content |
| GET | `/api/health` | Health check |

> Full API docs in the route files under `server/routes/`.

---

## Database Models

| Model | Description |
|-------|-------------|
| **User** | Profiles, followers, saved posts, roles, email verification |
| **Post** | Content, tags, images, polls, reposts, report counts |
| **Comment** | Threaded replies with likes |
| **Message** | Conversation messages with read receipts |
| **Conversation** | Direct, group, and broadcast chats |
| **Notification** | Likes, comments, follows, reposts |
| **Resource** | Academic materials (PDFs, books, notes) |
| **Report** | Content moderation reports |

---

## Deployment

This project includes a **Render Blueprint** (`render.yaml`) for one-click deployment.

### Deploy to Render

1. Push to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New +** → **Blueprint**
3. Connect your repository
4. Set environment variables when prompted
5. Click **Apply**

### Admin Access

To grant admin privileges, update the `role` field to `"admin"` in the MongoDB `users` collection for the desired user, or add their email to the `ADMIN_EMAILS` environment variable.

---

## Security

- JWT authentication for API and WebSocket connections
- Password hashing with bcrypt
- CORS restricted to allowed origins
- Rate limiting (20 req/15min for auth, 300 req/15min general)
- Input validation on all endpoints via express-validator
- Helmet security headers
- Environment-based error stack exposure (hidden in production)
- Email verification required for full access

---

## License

MIT

---

<div align="center">

**Built with care by Arsi Aseko University students**

</div>
