const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name profilePicture')
      .populate('following', 'name profilePicture');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.university = req.body.university || user.university;
    user.department = req.body.department || user.department;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      university: updatedUser.university,
      department: updatedUser.department,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const keyword = req.query.search ? {
      $or: [
        { name: { $regex: req.query.search, $options: 'i' } },
        { university: { $regex: req.query.search, $options: 'i' } },
        { department: { $regex: req.query.search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select('name profilePicture university department');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
