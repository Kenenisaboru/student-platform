const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const { validateEnv, getAllowedOrigins } = require('./config/env');
const socketAuth = require('./middleware/socketAuth');
const app = require('./app');

validateEnv();

const server = http.createServer(app);
const allowedOrigins = getAllowedOrigins();

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('socketio', io);

io.use(socketAuth);

const onlineUsers = new Map();

io.on('connection', (socket) => {
  const userId = socket.userId;
  socket.join(userId);
  onlineUsers.set(socket.id, userId);

  (async () => {
    try {
      const User = require('./models/User');
      await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
      io.emit('user_online', { userId, isOnline: true });
    } catch (err) {
      console.error('Error updating online status:', err.message);
    }
  })();

  socket.on('typing', ({ receiverId }) => {
    if (receiverId) {
      io.to(receiverId).emit('typing_status', { senderId: userId, isTyping: true });
    }
  });

  socket.on('stop_typing', ({ receiverId }) => {
    if (receiverId) {
      io.to(receiverId).emit('typing_status', { senderId: userId, isTyping: false });
    }
  });

  socket.on('disconnect', async () => {
    onlineUsers.delete(socket.id);

    const isStillOnline = Array.from(onlineUsers.values()).includes(userId);
    if (!isStillOnline) {
      try {
        const User = require('./models/User');
        await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
        io.emit('user_online', { userId, isOnline: false });
      } catch (err) {
        console.error('Error updating offline status:', err.message);
      }
    }
  });
});

const PORT = process.env.PORT || 5010;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message);
});
