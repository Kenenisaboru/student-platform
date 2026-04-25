const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.createPost = async (req, res) => {
  try {
    let { title, content, tags, poll } = req.body;
    
    // Parse poll if it's a string (from FormData)
    if (typeof poll === 'string') {
      try {
        poll = JSON.parse(poll);
      } catch (err) {
        console.error('Error parsing poll data:', err);
      }
    }
    // Handle image URL from Cloudinary upload or direct URL
    const images = [];
    if (req.file) {
      images.push(req.file.path);
    }
    if (req.body.imageUrl) {
      images.push(req.body.imageUrl);
    }

    const postData = {
      title,
      content,
      tags,
      images,
      author: req.user._id
    };

    // Add poll if provided
    if (poll && poll.question && poll.options && poll.options.length >= 2) {
      postData.poll = {
        question: poll.question,
        options: poll.options.map(opt => ({
          text: typeof opt === 'string' ? opt : opt.text,
          votes: []
        })),
        endsAt: poll.endsAt || null
      };
    }

    const post = await Post.create(postData);
    const populatedPost = await post.populate('author', 'name profilePicture university');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Paginated posts
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments({ isHidden: { $ne: true } });
    const posts = await Post.find({ isHidden: { $ne: true } })
      .populate('author', 'name profilePicture university')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      hasMore: page * limit < total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePicture university department bio')
      .lean();
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Secure update — only whitelisted fields
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Whitelist allowed fields
    const allowedFields = ['title', 'content', 'tags'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    post = await Post.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('author', 'name profilePicture university');
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
      
      // Notifications (Wrapped in try/catch so they don't break the main flow)
      try {
        if (post.author.toString() !== req.user._id.toString()) {
          await Notification.create({
            recipient: post.author,
            sender: req.user._id,
            type: 'like',
            post: post._id
          });
          
          const io = req.app.get('socketio');
          if (io) {
            io.to(post.author.toString()).emit('new_notification', {
              message: `${req.user.name} liked your post`,
              type: 'like'
            });
          }
        }
      } catch (notifError) {
        console.error('Like notification error:', notifError);
      }
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vote on poll
exports.votePoll = async (req, res) => {
  try {
    const { optionId } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.poll || !post.poll.question) {
      return res.status(400).json({ message: 'This post has no poll' });
    }

    // Check if poll has ended
    if (post.poll.endsAt && new Date(post.poll.endsAt) < new Date()) {
      return res.status(400).json({ message: 'This poll has ended' });
    }

    // Check if user already voted on any option
    const hasVoted = post.poll.options.some(opt => 
      opt.votes.some(v => v.toString() === req.user._id.toString())
    );

    if (hasVoted) {
      // Remove previous vote
      post.poll.options.forEach(opt => {
        opt.votes = opt.votes.filter(v => v.toString() !== req.user._id.toString());
      });
    }

    // Add vote to selected option
    const option = post.poll.options.id(optionId);
    if (!option) return res.status(404).json({ message: 'Poll option not found' });
    
    option.votes.push(req.user._id);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTrendingTags = async (req, res) => {
  try {
    const trending = await Post.aggregate([
      { $match: { isHidden: { $ne: true } } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { tag: '$_id', posts: '$count', _id: 0 } }
    ]);
    res.json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCommunityStats = async (req, res) => {
  try {
    const User = require('../models/User');
    const totalStudents = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalTags = await Post.distinct('tags');
    
    res.json({
      totalStudents,
      totalPosts,
      totalTags: totalTags.length,
      activeToday: Math.min(totalStudents, Math.ceil(totalStudents * 0.4))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
