const express = require('express');
const router = express.Router();
const MentorshipMatch = require('../models/MentorshipMatch');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all mentors with their expertise
router.get('/mentors', async (req, res) => {
  try {
    const { expertise, search } = req.query;
    let query = {};

    if (expertise) query['mentor.expertise'] = expertise;
    if (search) {
      query.$or = [
        { 'mentor.bio': { $regex: search, $options: 'i' } },
      ];
    }

    const mentors = await MentorshipMatch.find(query)
      .populate('mentor.userId', 'name avatar email university')
      .distinct('mentor.userId');

    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mentor profile with active matches
router.get('/mentor/:userId', async (req, res) => {
  try {
    const matches = await MentorshipMatch.find({
      'mentor.userId': req.params.userId,
      status: { $in: ['active', 'pending'] },
    })
      .populate('mentor.userId', 'name avatar email university bio')
      .populate('mentee.userId', 'name avatar email university');

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's mentorship matches
router.get('/user/matches', auth, async (req, res) => {
  try {
    const matches = await MentorshipMatch.find({
      $or: [
        { 'mentor.userId': req.user._id },
        { 'mentee.userId': req.user._id },
      ],
    })
      .populate('mentor.userId', 'name avatar email university')
      .populate('mentee.userId', 'name avatar email university')
      .sort({ createdAt: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request mentorship match
router.post('/request', auth, async (req, res) => {
  try {
    const { mentorId, goals, interests } = req.body;

    // Check if already has active match with this mentor
    const existingMatch = await MentorshipMatch.findOne({
      'mentor.userId': mentorId,
      'mentee.userId': req.user._id,
      status: { $in: ['active', 'pending'] },
    });

    if (existingMatch) {
      return res.status(400).json({ error: 'You already have a pending or active match with this mentor' });
    }

    const mentor = await User.findById(mentorId);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });

    const match = new MentorshipMatch({
      mentor: {
        userId: mentorId,
        expertise: mentor.expertise || [],
        yearsOfExperience: mentor.yearsOfExperience || 0,
        bio: mentor.bio || '',
      },
      mentee: {
        userId: req.user._id,
        goals,
        interests,
      },
      status: 'pending',
    });

    await match.save();
    await match.populate('mentor.userId', 'name avatar email');
    await match.populate('mentee.userId', 'name avatar email');
    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Accept mentorship request
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const match = await MentorshipMatch.findById(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    if (match.mentor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the mentor can accept the request' });
    }

    match.status = 'active';
    match.matchedAt = Date.now();
    match.startDate = Date.now();
    match.expectedEndDate = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000); // 6 months

    await match.save();
    res.json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reject mentorship request
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const match = await MentorshipMatch.findById(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    if (match.mentor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the mentor can reject the request' });
    }

    match.status = 'rejected';
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add meeting notes
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const { notes, progress } = req.body;
    const match = await MentorshipMatch.findById(req.params.id);

    if (!match) return res.status(404).json({ error: 'Match not found' });

    if (match.mentor.userId.toString() !== req.user._id.toString() && 
        match.mentee.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to add notes' });
    }

    match.meetingNotes.push({
      date: Date.now(),
      notes,
      progress,
    });

    await match.save();
    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Complete mentorship
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const { feedback, rating } = req.body;
    const match = await MentorshipMatch.findById(req.params.id);

    if (!match) return res.status(404).json({ error: 'Match not found' });

    if (match.mentee.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to complete this match' });
    }

    match.status = 'completed';
    match.feedback.menteeFeedback = feedback;
    match.feedback.rating = rating;
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
