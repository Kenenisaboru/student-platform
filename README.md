# Arsi Aseko University Student Communication Platform
The official full-stack community portal designed for Arsi Aseko University students to connect, share ideas, and collaborate.

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
- **Production hardening**: Env validation, CORS lockdown, socket JWT auth, email verification, rate limits, health checks. See [PRODUCTION.md](./PRODUCTION.md).
- **Performance Optimized**: Built with Vite chunk splitting and smooth Framer Motion animations.

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
3. Copy `.env.example` to `.env` and configure `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.
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
4. Open **http://localhost:5180** (this project uses port **5180**, not 5173, so it does not clash with other Vite apps).

**Local URLs**

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:5180 |
| Backend  | http://localhost:5010 |
| API      | http://localhost:5010/api (or `/api` via Vite proxy) |

If port 5180 is already in use, stop the other process or change `port` in `client/vite.config.js`.

## Admin Access
To grant admin access, manually update the `role` field to `'admin'` in the MongoDB `users` collection for the desired user.

## Deployment on Render

This project is configured for easy deployment on **Render** using the included `render.yaml` Blueprint.

### Steps:
1. **Connect to GitHub**: Push your code to a GitHub repository.
2. **New Blueprint Instance**: Go to [Render Dashboard](https://dashboard.render.com), click **New +**, and select **Blueprint**.
3. **Select Repository**: Connect your GitHub repo.
4. **Environment Variables**: Render will ask for the following environment variables (fill them in during setup):
   - **Backend (`student-platform-api`)**:
     - `MONGODB_URI`: Your MongoDB connection string.
     - `JWT_SECRET`: A long random string for token security.
     - `CLIENT_URL`: The URL of your frontend (e.g., `https://student-platform.onrender.com`).
     - `CLOUDINARY_CLOUD_NAME`: (Optional) For image uploads.
     - `CLOUDINARY_API_KEY`: (Optional)
     - `CLOUDINARY_API_SECRET`: (Optional)
     - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`: Required for email verification
     - `ADMIN_EMAILS`: Comma-separated admin emails
   - **Frontend (`student-platform-client`)**:
     - `VITE_API_URL`: The URL of your backend (e.g., `https://student-platform-api.onrender.com/api`).
5. **Deploy**: Click **Apply** and wait for both services to build.

