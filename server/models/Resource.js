const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['PDF', 'Research', 'Book', 'Guide', 'Notes', 'Other'],
    default: 'Notes'
  },
  department: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  university: {
    type: String,
    default: 'Arsi Aseko University'
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
