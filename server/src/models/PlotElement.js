const mongoose = require('mongoose');

const PlotElementSchema = new mongoose.Schema({
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a plot element title'],
    trim: true
  },
  elementType: {
    type: String,
    enum: ['event', 'conflict', 'revelation', 'decision', 'other'],
    default: 'event'
  },
  description: String,
  // For timeline positioning
  timelinePosition: {
    order: Number,
    absoluteTime: String,  // e.g., "Day 1", "Year 1242"
    relativeTime: String   // e.g., "Before the war", "After the coronation"
  },
  // For story structure positioning
  structurePosition: {
    act: {
      type: String,
      enum: ['act1', 'act2', 'act3', 'other'],
      default: 'other'
    },
    narrativeBeat: String  // e.g., "Inciting Incident", "Midpoint", "Climax"
  },
  importance: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  // Characters involved in this plot element
  characters: [{
    character: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character'
    },
    involvement: {
      type: String,
      enum: ['central', 'major', 'minor', 'mentioned'],
      default: 'major'
    }
  }],
  // Scenes where this plot element appears
  scenes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scene'
  }],
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
PlotElementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
PlotElementSchema.index({ novel: 1 });
PlotElementSchema.index({ title: 'text', description: 'text' });
PlotElementSchema.index({ 'timelinePosition.order': 1 });
PlotElementSchema.index({ 'structurePosition.act': 1 });
PlotElementSchema.index({ elementType: 1 });

module.exports = mongoose.model('PlotElement', PlotElementSchema);
