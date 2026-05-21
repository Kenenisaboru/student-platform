require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

async function testComment() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get a test user
    const user = await User.findOne({ email: 'student@example.com' });
    if (!user) {
      console.log('❌ Test user not found. Run: node seed_accounts.js');
      process.exit(1);
    }

    console.log('✅ Test User Found:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Verified: ${user.isVerified}`);
    console.log(`   Role: ${user.role}\n`);

    // Get a post to comment on
    const post = await Post.findOne().populate('author', 'name email');
    if (!post) {
      console.log('❌ No posts found. Create a post first.');
      process.exit(1);
    }

    console.log('✅ Test Post Found:');
    console.log(`   Title: ${post.title}`);
    console.log(`   Author: ${post.author.name} (${post.author.email})`);
    console.log(`   Post ID: ${post._id}\n`);

    // Try to create a comment
    console.log('🧪 Testing Comment Creation...\n');
    
    const commentData = {
      content: 'This is a test comment from the test script',
      post: post._id,
      author: user._id
    };

    const comment = await Comment.create(commentData);
    
    // Increment comment count
    await Post.findByIdAndUpdate(
      post._id,
      { $inc: { commentsCount: 1 } }
    );

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name profilePicture email');

    console.log('✅ Comment Created Successfully!');
    console.log(`   Comment ID: ${populatedComment._id}`);
    console.log(`   Content: ${populatedComment.content}`);
    console.log(`   Author: ${populatedComment.author.name}`);
    console.log(`   Post: ${post.title}\n`);

    console.log('✅ TEST PASSED - Comments are working!\n');

    // Clean up test comment
    await Comment.findByIdAndDelete(comment._id);
    await Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: -1 } });
    console.log('🧹 Test comment cleaned up');

    process.exit(0);
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    console.error('\nFull Error:', error);
    process.exit(1);
  }
}

testComment();
