const mongoose = require('mongoose');

const mentorshipMatchSchema = new mongoose.Schema(
  {
    mentor: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      expertise: [String],
      yearsOfExperience: Number,
      bio: String,
      availability: {
        type: String,
        enum: ['Very Active', 'Active', 'Limited', 'Unavailable'],
        default: 'Active',
      },
    },
    mentee: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      goals: [String],
      interests: [String],
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'paused', 'completed', 'rejected'],
      default: 'pending',
    },
    matchedAt: Date,
    startDate: Date,
    expectedEndDate: Date,
    goals: [{
      title: String,
      description: String,
      completed: Boolean,
      completedAt: Date,
    }],
    meetingNotes: [{
      date: Date,
      notes: String,
      progress: String,
    }],
    feedback: {
      mentorFeedback: String,
      menteeFeedback: String,
      rating: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MentorshipMatch', mentorshipMatchSchema);
