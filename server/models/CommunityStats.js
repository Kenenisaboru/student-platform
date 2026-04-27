const mongoose = require('mongoose');

const communityStatsSchema = new mongoose.Schema(
  {
    totalMembers: {
      type: Number,
      default: 0,
    },
    activeMembers: {
      type: Number,
      default: 0,
    },
    successfulPlacements: {
      type: Number,
      default: 0,
    },
    scholarshipsAwarded: {
      type: Number,
      default: 0,
    },
    projectsCompleted: {
      type: Number,
      default: 0,
    },
    eventsHeld: {
      type: Number,
      default: 0,
    },
    resourcesShared: {
      type: Number,
      default: 0,
    },
    mentorshipMatches: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CommunityStats', communityStatsSchema);
