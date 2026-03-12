# Arsi Aseko Student Network

A full-stack community platform designed for students from Arsi Aseko studying in different universities to connect, share ideas, and collaborate.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Vite, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB, Socket.io
- **Auth**: JWT, Bcrypt

## Features
- **User Authentication**: Secure registration and login for students.
- **Profiles**: Personal student profiles with bio, university, and department info.
- **Post Sharing**: Share ideas, ask questions, and discuss topics with tags.
- **Interactions**: Like and comment on fellow students' posts.
- **Real-time Notifications**: Get notified instantly on likes and comments.
- **Search**: Find students or posts relative to your interests.
- **Admin Dashboard**: Moderation tools for administrators.

## Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB installed and running locally (or Atlas URI)

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (template provided) and add your `MONGODB_URI` and `JWT_SECRET`.
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

## Admin Access
To grant admin access, manually update the `role` field to `'admin'` in the MongoDB `users` collection for the desired user.
