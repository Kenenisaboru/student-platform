const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires')
      .populate('followers', 'name profilePicture university')
      .populate('following', 'name profilePicture university');
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

    user.name = req.body.name !== undefined ? req.body.name : user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.university = req.body.university !== undefined ? req.body.university : user.university;
    user.department = req.body.department !== undefined ? req.body.department : user.department;
    user.profilePicture = req.body.profilePicture !== undefined ? req.body.profilePicture : user.profilePicture;

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
      role: updatedUser.role,
      isVerified: updatedUser.isVerified
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Follow / Unfollow a user
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) return res.status(404).json({ message: 'User not found' });
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const isFollowing = currentUser.following.some(id => id.toString() === req.params.id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);

      // Create notification
      const Notification = require('../models/Notification');
      await Notification.create({
        recipient: userToFollow._id,
        sender: req.user._id,
        type: 'follow'
      });

      // Real-time notification
      const io = req.app.get('socketio');
      io.to(userToFollow._id.toString()).emit('new_notification', {
        message: `${currentUser.name} started following you`,
        type: 'follow'
      });
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      isFollowing: !isFollowing,
      followersCount: userToFollow.followers.length,
      followingCount: currentUser.following.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Paginated search
exports.searchUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const keyword = req.query.search ? {
      $or: [
        { name: { $regex: req.query.search, $options: 'i' } },
        { university: { $regex: req.query.search, $options: 'i' } },
        { department: { $regex: req.query.search, $options: 'i' } }
      ]
    } : {};

    const total = await User.countDocuments({ ...keyword, _id: { $ne: req.user._id } });
    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .select('name profilePicture university department isOnline lastSeen')
      .skip(skip)
      .limit(limit);

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
      hasMore: page * limit < total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Paginated admin user list
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find()
      .select('-password -verificationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
      hasMore: page * limit < total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActiveUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name profilePicture university department isOnline lastSeen')
      .sort({ lastSeen: -1 })
      .limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleSavePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.postId;
    
    const isSaved = user.savedPosts.some(id => id.toString() === postId);
    
    if (isSaved) {
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    } else {
      user.savedPosts.push(postId);
    }
    
    await user.save();
    res.json({ isSaved: !isSaved, savedPosts: user.savedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedPosts',
      populate: { path: 'author', select: 'name profilePicture university' }
    });
    
    res.json(user.savedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
