const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Get or create a conversation with a user
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if conversation exists between these two users
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, userId] }
    }).populate('participants', 'name profilePicture university')
      .populate('lastMessage');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, userId]
      });
      conversation = await conversation.populate('participants', 'name profilePicture university');
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all conversations for the current user
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'name profilePicture university')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages in a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Verify user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: req.user._id }, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    // Verify user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content: content.trim()
    });

    // Update conversation's last message
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMessage = await message.populate('sender', 'name profilePicture');

    // Real-time: emit to the other participant
    const io = req.app.get('socketio');
    const otherParticipant = conversation.participants.find(
      p => p.toString() !== req.user._id.toString()
    );
    
    if (otherParticipant) {
      io.to(otherParticipant.toString()).emit('new_message', {
        message: populatedMessage,
        conversationId
      });
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    // Find all conversations the user is in
    const conversations = await Conversation.find({
      participants: req.user._id
    });
    
    const conversationIds = conversations.map(c => c._id);
    
    const unreadCount = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: req.user._id },
      read: false
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
