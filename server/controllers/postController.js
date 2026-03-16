const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    // Handle image URL from Cloudinary upload or direct URL
    const images = [];
    if (req.file) {
      images.push(req.file.path);
    }
    if (req.body.imageUrl) {
      images.push(req.body.imageUrl);
    }

    const post = await Post.create({
      title,
      content,
      tags,
      images,
      author: req.user._id
    });
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

    const total = await Post.countDocuments();
    const posts = await Post.find()
      .populate('author', 'name profilePicture university')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
    const post = await Post.findById(req.params.id).populate('author', 'name profilePicture university department bio');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
      
      if (post.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: 'like',
          post: post._id
        });
        
        const io = req.app.get('socketio');
        io.to(post.author.toString()).emit('new_notification', {
          message: `${req.user.name} liked your post`,
          type: 'like'
        });
      }
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTrendingTags = async (req, res) => {
  try {
    const trending = await Post.aggregate([
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
