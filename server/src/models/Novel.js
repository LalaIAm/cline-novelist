const mongoose = require('mongoose');

const NovelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'co-author'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  genre: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'revision', 'completed'],
    default: 'draft'
  },
  wordCount: {
    type: Number,
    default: 0
  },
  settings: {
    aiAssistanceLevel: {
      type: String,
      enum: ['minimal', 'moderate', 'extensive'],
      default: 'moderate'
    },
    privacyLevel: {
      type: String,
      enum: ['private', 'collaborators', 'public'],
      default: 'private'
    }
  },
  // Reference to current active version
  currentVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Version',
  },
  // Statistics and metadata
  statistics: {
    lastModified: {
      type: Date,
      default: Date.now
    },
    readTime: Number,
    averageWordCount: Number,
    editFrequency: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update timestamps
NovelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
NovelSchema.index({ user: 1 });
NovelSchema.index({ 'collaborators.user': 1 });
NovelSchema.index({ title: 'text', description: 'text' });
NovelSchema.index({ status: 1 });
NovelSchema.index({ genre: 1 });

module.exports = mongoose.model('Novel', NovelSchema);
