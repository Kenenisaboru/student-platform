// Arsi Aseko University Student Platform API
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Export io to use in controllers (set BEFORE routes)
app.set('socketio', io);

// Middleware
// Security headers
app.use(helmet());
// Logging
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Track online users
const onlineUsers = new Map(); // socketId -> userId

// Socket.io connection
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  
  socket.on('join_room', async (userId) => {
    socket.join(userId);
    onlineUsers.set(socket.id, userId);
    
    // Update user online status in DB
    try {
      const User = require('./models/User');
      await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
      // Broadcast online status to all clients
      io.emit('user_online', { userId, isOnline: true });
    } catch (err) {
      console.error('Error updating online status:', err);
    }
    
    console.log(`User ${userId} joined their notification room`);
  });

  socket.on('typing', ({ senderId, receiverId }) => {
    io.to(receiverId).emit('typing_status', { senderId, isTyping: true });
  });

  socket.on('stop_typing', ({ senderId, receiverId }) => {
    io.to(receiverId).emit('typing_status', { senderId, isTyping: false });
  });

  socket.on('disconnect', async () => {
    const userId = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);
    
    if (userId) {
      // Check if user has other active connections
      const isStillOnline = Array.from(onlineUsers.values()).includes(userId);
      
      if (!isStillOnline) {
        try {
          const User = require('./models/User');
          await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
          io.emit('user_online', { userId, isOnline: false });
        } catch (err) {
          console.error('Error updating offline status:', err);
        }
      }
    }
    
    console.log('user disconnected');
  });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reportRoutes = require('./routes/reportRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/resources', resourceRoutes);

app.get('/', (req, res) => {
  res.send('AAU Student Platform API is running...');
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Global Error Handler
app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for developers
  if (process.env.NODE_ENV !== 'production') {
    console.error('SERVER ERROR:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, status: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered: ${field}. Please use another value.`;
    error = { message, status: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, status: 400 };
  }

  const status = error.status || 500;
  res.status(status).json({
    success: false,
    message: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});
