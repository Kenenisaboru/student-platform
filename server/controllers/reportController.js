const Report = require('../models/Report');
const Post = require('../models/Post');

exports.createReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, description } = req.body;

    // Check if user already reported this target
    const existingReport = await Report.findOne({
      reporter: req.user._id,
      targetId,
      targetType
    });

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this content' });
    }

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
      description: description || ''
    });

    // Increment report count on post if it's a post report
    if (targetType === 'post') {
      const post = await Post.findById(targetId);
      if (post) {
        post.reportCount = (post.reportCount || 0) + 1;
        // Auto-hide if too many reports
        if (post.reportCount >= 5) {
          post.isHidden = true;
        }
        await post.save();
      }
    }

    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all reports
exports.getReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'pending';

    const total = await Report.countDocuments({ status });
    const reports = await Report.find({ status })
      .populate('reporter', 'name profilePicture')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      reports,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
      hasMore: page * limit < total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update report status
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);
    
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = status;
    report.reviewedBy = req.user._id;
    await report.save();

    // If resolved and it's a post, hide the post
    if (status === 'resolved' && report.targetType === 'post') {
      await Post.findByIdAndUpdate(report.targetId, { isHidden: true });
    }

    // If dismissed, unhide the post
    if (status === 'dismissed' && report.targetType === 'post') {
      await Post.findByIdAndUpdate(report.targetId, { isHidden: false, reportCount: 0 });
    }

    res.json({ message: `Report ${status}`, report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
