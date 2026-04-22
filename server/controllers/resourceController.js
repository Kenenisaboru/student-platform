const Resource = require('../models/Resource');

// @desc    Get all resources
// @route   GET /api/resources
exports.getResources = async (req, res) => {
  try {
    const { category, department, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (department) query.department = department;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const resources = await Resource.find(query)
      .populate('author', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload new resource
// @route   POST /api/resources
exports.uploadResource = async (req, res) => {
  try {
    const { title, description, fileUrl, category, department } = req.body;

    const resource = await Resource.create({
      title,
      description,
      fileUrl,
      category,
      department,
      author: req.user.id
    });

    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (resource.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await resource.deleteOne();
    res.status(200).json({ message: 'Resource removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
