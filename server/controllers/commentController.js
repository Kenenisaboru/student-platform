const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.createComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body;
    const { postId } = req.params;

    const commentData = {
      content,
      post: postId,
      author: req.user._id
    };

    // If it's a reply to another comment
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent) return res.status(404).json({ message: 'Parent comment not found' });
      commentData.parentComment = parentComment;
    }

    const comment = await Comment.create(commentData);

    const post = await Post.findById(postId);
    if (post) {
      post.commentsCount += 1;
      await post.save();
    }

    // Notification to post author
    if (post && post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'comment',
        post: postId
      });

      const io = req.app.get('socketio');
      io.to(post.author.toString()).emit('new_notification', {
        message: `${req.user.name} commented on your post`,
        type: 'comment'
      });
    }

    // Notification to parent comment author (for replies)
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (parent && parent.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: parent.author,
          sender: req.user._id,
          type: 'comment',
          post: postId
        });

        const io = req.app.get('socketio');
        io.to(parent.author.toString()).emit('new_notification', {
          message: `${req.user.name} replied to your comment`,
          type: 'comment'
        });
      }
    }

    const populatedComment = await comment.populate('author', 'name profilePicture');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Paginated comments with threaded replies
exports.getCommentsByPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get top-level comments (no parent)
    const total = await Comment.countDocuments({ 
      post: req.params.postId, 
      parentComment: null 
    });

    const comments = await Comment.find({ 
      post: req.params.postId, 
      parentComment: null 
    })
      .populate('author', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get all replies for these comments
    const commentIds = comments.map(c => c._id);
    const replies = await Comment.find({
      post: req.params.postId,
      parentComment: { $in: commentIds }
    })
      .populate('author', 'name profilePicture')
      .sort({ createdAt: 1 });

    // Attach replies to their parent comments
    const commentsWithReplies = comments.map(comment => {
      const commentObj = comment.toObject();
      commentObj.replies = replies.filter(
        r => r.parentComment.toString() === comment._id.toString()
      );
      return commentObj;
    });

    res.json({
      comments: commentsWithReplies,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalComments: total,
      hasMore: page * limit < total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: comment._id });
    const repliesCount = await Comment.countDocuments({ parentComment: comment._id });

    const post = await Post.findById(comment.post);
    if (post) {
      post.commentsCount = Math.max(0, post.commentsCount - 1 - repliesCount);
      await post.save();
    }

    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/unlike a comment
exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isLiked = comment.likes.some(id => id.toString() === req.user._id.toString());

    if (isLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      comment.likes.push(req.user._id);
    }

    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
