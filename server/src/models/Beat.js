const mongoose = require('mongoose');

const BeatSchema = new mongoose.Schema({
  scene: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scene',
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please add a beat description'],
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  beatType: {
    type: String,
    enum: ['action', 'dialogue', 'emotion', 'thought', 'transition', 'description', 'other'],
    default: 'other'
  },
  purpose: String,
  // Characters actively involved in this beat
  characters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  notes: String,
  // For tracking emotional arcs
  emotionalValue: {
    type: Number,
    min: -10, // Negative value (low point, conflict)
    max: 10,  // Positive value (high point, resolution)
    default: 0
  },
  // For tracking conflict intensity
  tensionLevel: {
    type: Number,
    min: 0,
    max: 10,
    default: 5
  },
  // For tracking beat in the editor
  contentPosition: {
    startIndex: Number,
    endIndex: Number
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

// Middleware to update timestamps
BeatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
BeatSchema.index({ scene: 1, order: 1 }, { unique: true });
BeatSchema.index({ scene: 1, beatType: 1 });
BeatSchema.index({ description: 'text' });

module.exports = mongoose.model('Beat', BeatSchema);
