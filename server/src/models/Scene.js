const mongoose = require('mongoose');

const SceneSchema = new mongoose.Schema({
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  },
  title: {
    type: String,
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
  // Scene metadata
  purpose: {
    type: String,
    enum: ['exposition', 'rising-action', 'climax', 'falling-action', 'resolution', 'other'],
    default: 'other'
  },
  pov: {
    character: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character'
    },
    type: {
      type: String,
      enum: ['first-person', 'third-person-limited', 'third-person-omniscient', 'second-person'],
      default: 'third-person-limited'
    }
  },
  setting: String,
  timeframe: String,
  // Scene structure
  sceneStructure: {
    goal: String,
    conflict: String,
    disaster: String,
    reaction: String,
    dilemma: String,
    decision: String
  },
  // Scene dynamics
  emotionalShift: {
    startingValue: {
      type: Number,
      min: -10,
      max: 10,
      default: 0
    },
    endingValue: {
      type: Number,
      min: -10,
      max: 10,
      default: 0
    }
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

// Virtual for beats (allows populate)
SceneSchema.virtual('beats', {
  ref: 'Beat',
  localField: '_id',
  foreignField: 'scene',
  options: { sort: { order: 1 } }
});

// Set virtuals to true when converting to JSON
SceneSchema.set('toJSON', { virtuals: true });
SceneSchema.set('toObject', { virtuals: true });

// Middleware to update timestamps
SceneSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
SceneSchema.index({ chapter: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Scene', SceneSchema);
