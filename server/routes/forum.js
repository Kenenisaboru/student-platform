const express = require('express');
const router = express.Router();
const DiscussionThread = require('../models/DiscussionThread');
const auth = require('../middleware/auth');

// Get all threads by category
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'trending') sortOption = { views: -1 };
    if (sort === 'recent-replies') sortOption = { 'replies.0.createdAt': -1 };

    const threads = await DiscussionThread.find(query)
      .populate('author', 'name avatar')
      .populate('replies.author', 'name avatar')
      .populate('likes', '_id')
      .sort(sortOption)
      .limit(100);

    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single thread
router.get('/:id', async (req, res) => {
  try {
    const thread = await DiscussionThread.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name avatar')
      .populate('replies.author', 'name avatar')
      .populate('likes', '_id');

    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new thread
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const thread = new DiscussionThread({
      title,
      content,
      category,
      tags,
      author: req.user._id,
    });

    await thread.save();
    await thread.populate('author', 'name avatar');
    res.status(201).json(thread);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add reply to thread
router.post('/:id/reply', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const thread = await DiscussionThread.findById(req.params.id);

    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    thread.replies.push({
      author: req.user._id,
      content,
    });

    await thread.save();
    await thread.populate('replies.author', 'name avatar');
    res.status(201).json(thread);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Like thread
router.post('/:id/like', auth, async (req, res) => {
  try {
    const thread = await DiscussionThread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    const alreadyLiked = thread.likes.includes(req.user._id);

    if (alreadyLiked) {
      thread.likes = thread.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      thread.likes.push(req.user._id);
    }

    await thread.save();
    res.json(thread);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Like reply
router.post('/:id/reply/:replyId/like', auth, async (req, res) => {
  try {
    const thread = await DiscussionThread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    const reply = thread.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ error: 'Reply not found' });

    const alreadyLiked = reply.likes.includes(req.user._id);

    if (alreadyLiked) {
      reply.likes = reply.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      reply.likes.push(req.user._id);
    }

    await thread.save();
    res.json(thread);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Pin thread (admin only)
router.put('/:id/pin', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can pin threads' });
    }

    const thread = await DiscussionThread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    thread.isPinned = !thread.isPinned;
    await thread.save();
    res.json(thread);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark thread as resolved
router.put('/:id/resolve', auth, async (req, res) => {
  try {
    const thread = await DiscussionThread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    if (thread.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to resolve this thread' });
    }

    thread.resolved = !thread.resolved;
    await thread.save();
    res.json(thread);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
