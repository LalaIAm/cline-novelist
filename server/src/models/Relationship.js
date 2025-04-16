const mongoose = require('mongoose');

const RelationshipSchema = new mongoose.Schema({
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel',
    required: true
  },
  character1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
    required: true
  },
  character2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
    required: true
  },
  relationshipType: {
    type: String,
    enum: ['family', 'friend', 'romantic', 'colleague', 'enemy', 'acquaintance', 'other'],
    default: 'other'
  },
  description: String,
  strength: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  dynamics: String,
  evolution: [{
    stage: String,
    description: String,
    timepoint: String
  }],
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
RelationshipSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
RelationshipSchema.index({ novel: 1 });
RelationshipSchema.index({ character1: 1, character2: 1 }, { unique: true });
RelationshipSchema.index({ character1: 1 });
RelationshipSchema.index({ character2: 1 });

module.exports = mongoose.model('Relationship', RelationshipSchema);
