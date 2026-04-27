const express = require('express');
const router = express.Router();
const CommunityGoal = require('../models/CommunityGoal');
const CommunityStats = require('../models/CommunityStats');
const auth = require('../middleware/auth');

// Get all community goals
router.get('/', async (req, res) => {
  try {
    const goals = await CommunityGoal.find({ status: 'active' })
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get community statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await CommunityStats.findOne().sort({ createdAt: -1 });
    res.json(stats || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new community goal (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, targetValue, deadline, icon, color } = req.body;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create community goals' });
    }

    const goal = new CommunityGoal({
      title,
      description,
      category,
      targetValue,
      deadline,
      icon,
      color,
      createdBy: req.user._id,
    });

    await goal.save();
    await goal.populate('createdBy', 'name avatar');
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update goal progress (admin only)
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { increment } = req.body;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update goal progress' });
    }

    const goal = await CommunityGoal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    goal.currentValue += increment;
    goal.contributors.push({
      userId: req.user._id,
      contribution: increment,
    });

    // Check if completed
    if (goal.currentValue >= goal.targetValue) {
      goal.status = 'completed';
    }

    await goal.save();
    await goal.populate('createdBy', 'name avatar');
    res.json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update community stats (admin only)
router.put('/stats/update', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update stats' });
    }

    let stats = await CommunityStats.findOne();
    if (!stats) {
      stats = new CommunityStats();
    }

    Object.assign(stats, req.body);
    stats.lastUpdated = Date.now();
    await stats.save();
    res.json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
