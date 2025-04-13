const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  version: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Version',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a chapter title'],
    trim: true
  },
  order: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  wordCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['outline', 'draft', 'revision', 'completed'],
    default: 'draft'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update timestamps
ChapterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
ChapterSchema.index({ version: 1, order: 1 }, { unique: true });
ChapterSchema.index({ title: 'text' });

module.exports = mongoose.model('Chapter', ChapterSchema);
