const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Get or create a direct conversation with a user
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    let conversation = await Conversation.findOne({
      type: 'direct',
      participants: { $all: [req.user._id, userId] }
    }).populate('participants', 'name profilePicture university')
      .populate('lastMessage');

    if (!conversation) {
      conversation = await Conversation.create({
        type: 'direct',
        participants: [req.user._id, userId]
      });
      conversation = await conversation.populate('participants', 'name profilePicture university');
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a group conversation
exports.createGroupConversation = async (req, res) => {
  try {
    const { name, participantIds, avatar } = req.body;

    const allParticipants = [...new Set([req.user._id.toString(), ...participantIds])];

    const conversation = await Conversation.create({
      type: 'group',
      name,
      avatar,
      createdBy: req.user._id,
      participants: allParticipants
    });

    const populated = await conversation.populate('participants', 'name profilePicture university');

    const io = req.app.get('socketio');
    allParticipants.forEach(id => {
      if (id !== req.user._id.toString()) {
        io.to(id).emit('new_conversation', { conversation: populated });
      }
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add participants to a group conversation
exports.addParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const { participantIds } = req.body;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    if (conversation.type !== 'group') {
      return res.status(400).json({ message: 'Can only add participants to group conversations' });
    }
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const newIds = participantIds.filter(
      pid => !conversation.participants.some(p => p.toString() === pid)
    );

    if (newIds.length === 0) {
      return res.json(await conversation.populate('participants', 'name profilePicture university'));
    }

    conversation.participants.push(...newIds);
    await conversation.save();

    const populated = await conversation.populate('participants', 'name profilePicture university');

    const io = req.app.get('socketio');
    newIds.forEach(id => {
      io.to(id).emit('added_to_conversation', { conversation: populated });
    });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a participant from a group conversation
exports.removeParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { participantId } = req.body;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    if (conversation.type !== 'group') {
      return res.status(400).json({ message: 'Can only remove participants from group conversations' });
    }
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    conversation.participants = conversation.participants.filter(
      p => p.toString() !== participantId
    );
    await conversation.save();

    const populated = await conversation.populate('participants', 'name profilePicture university');

    const io = req.app.get('socketio');
    io.to(participantId).emit('removed_from_conversation', { conversationId: id });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update group conversation name/avatar
exports.updateConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, avatar } = req.body;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (name !== undefined) conversation.name = name;
    if (avatar !== undefined) conversation.avatar = avatar;
    await conversation.save();

    const populated = await conversation.populate('participants', 'name profilePicture university');

    const io = req.app.get('socketio');
    io.to(id).emit('conversation_updated', { conversation: populated });

    res.json(populated);
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

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: req.user._id },
        'readBy.user': { $ne: req.user._id }
      },
      {
        $push: { readBy: { user: req.user._id, readAt: new Date() } },
        $set: { read: true }
      }
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

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content: content.trim()
    });

    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMessage = await message.populate('sender', 'name profilePicture');

    const io = req.app.get('socketio');

    if (conversation.type === 'group' || conversation.type === 'broadcast') {
      io.to(conversationId).emit('new_message', {
        message: populatedMessage,
        conversationId
      });
    } else {
      const otherParticipant = conversation.participants.find(
        p => p.toString() !== req.user._id.toString()
      );
      if (otherParticipant) {
        io.to(otherParticipant.toString()).emit('new_message', {
          message: populatedMessage,
          conversationId
        });
      }
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    });

    const conversationIds = conversations.map(c => c._id);

    const unreadCount = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: req.user._id },
      'readBy.user': { $ne: req.user._id }
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
