const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  },
  analysis: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for faster querying
resumeSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
