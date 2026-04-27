const mongoose = require('mongoose');

const discussionThreadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Career Advice', 'Academic Support', 'Personal Development', 'University Life', 'Projects & Ideas', 'Announcements'],
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    replies: [{
      author: mongoose.Schema.Types.ObjectId,
      content: String,
      likes: [mongoose.Schema.Types.ObjectId],
      createdAt: { type: Date, default: Date.now },
    }],
    likes: [mongoose.Schema.Types.ObjectId],
    views: {
      type: Number,
      default: 0,
    },
    tags: [String],
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DiscussionThread', discussionThreadSchema);
