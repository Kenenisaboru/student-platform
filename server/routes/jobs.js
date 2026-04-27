const express = require('express');
const router = express.Router();
const JobOpportunity = require('../models/JobOpportunity');
const auth = require('../middleware/auth');

// Get all active job opportunities
router.get('/', async (req, res) => {
  try {
    const { type, search, tag } = req.query;
    let query = { status: 'active' };

    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (tag) query.tags = tag;

    const jobs = await JobOpportunity.find(query)
      .populate('postedBy', 'name avatar email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single job opportunity
router.get('/:id', async (req, res) => {
  try {
    const job = await JobOpportunity.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('postedBy', 'name avatar email');

    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new job opportunity
router.post('/', auth, async (req, res) => {
  try {
    const { title, company, description, type, location, salary, requirements, benefits, deadline, tags } = req.body;

    const job = new JobOpportunity({
      title,
      company,
      description,
      type,
      location,
      salary,
      requirements,
      benefits,
      deadline,
      tags,
      postedBy: req.user._id,
    });

    await job.save();
    await job.populate('postedBy', 'name avatar email');
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Apply for job
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const job = await JobOpportunity.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Check if already applied
    const alreadyApplied = job.applicants.some(app => app.userId.toString() === req.user._id.toString());
    if (alreadyApplied) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    job.applicants.push({
      userId: req.user._id,
      status: 'pending',
    });

    await job.save();
    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's applications
router.get('/user/applications', auth, async (req, res) => {
  try {
    const jobs = await JobOpportunity.find({
      'applicants.userId': req.user._id,
    }).populate('postedBy', 'name avatar email');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job status (admin/poster only)
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await JobOpportunity.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete job (admin/poster only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await JobOpportunity.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    await JobOpportunity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
