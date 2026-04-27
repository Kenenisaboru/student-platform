const mongoose = require('mongoose');

const communityGoalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Members', 'Placements', 'Scholarships', 'Projects', 'Events', 'Resources'],
      required: true,
    },
    icon: {
      type: String,
      default: 'star',
    },
    targetValue: {
      type: Number,
      required: true,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'emerald',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
    deadline: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contributors: [{
      userId: mongoose.Schema.Types.ObjectId,
      contribution: Number,
      date: { type: Date, default: Date.now },
    }],
    milestones: [{
      label: String,
      value: Number,
      achieved: Boolean,
      achievedAt: Date,
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('CommunityGoal', communityGoalSchema);
