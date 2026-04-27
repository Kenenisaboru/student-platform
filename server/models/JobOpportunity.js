const mongoose = require('mongoose');

const jobOpportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Job', 'Internship', 'Scholarship', 'Contract', 'Fellowship'],
      required: true,
    },
    location: {
      type: String,
      default: 'Remote',
    },
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'ETB' },
    },
    requirements: [String],
    benefits: [String],
    deadline: {
      type: Date,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicants: [{
      userId: mongoose.Schema.Types.ObjectId,
      appliedAt: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ['pending', 'reviewing', 'accepted', 'rejected'],
        default: 'pending',
      },
    }],
    tags: [String],
    status: {
      type: String,
      enum: ['active', 'closed', 'filled'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobOpportunity', jobOpportunitySchema);
