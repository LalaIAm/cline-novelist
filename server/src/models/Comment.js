const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add comment content'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Polymorphic reference - can be attached to Novel, Chapter, Scene, etc.
  targetType: {
    type: String,
    enum: ['Novel', 'Chapter', 'Scene', 'Character', 'PlotElement', 'Beat'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  // For specific position within text content
  textPosition: {
    startIndex: Number,
    endIndex: Number
  },
  // For threaded comments
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'hidden'],
    default: 'active'
  },
  // Comment type for categorization
  commentType: {
    type: String,
    enum: ['feedback', 'question', 'suggestion', 'correction', 'general', 'technical'],
    default: 'general'
  },
  // If this comment is from AI
  isAiGenerated: {
    type: Boolean,
    default: false
  },
  // Tags for easier filtering
  tags: [String],
  // Reactions to comments (likes, etc.)
  reactions: {
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
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

// Virtual for child comments (replies)
CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment'
});

// Set virtuals to true when converting to JSON
CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });

// Middleware to update timestamps
CommentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
CommentSchema.index({ targetType: 1, targetId: 1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ user: 1 });
CommentSchema.index({ status: 1 });
CommentSchema.index({ commentType: 1 });
CommentSchema.index({ content: 'text' });
CommentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Comment', CommentSchema);
