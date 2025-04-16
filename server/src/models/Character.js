const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a character name'],
    trim: true
  },
  role: {
    type: String,
    enum: ['protagonist', 'antagonist', 'supporting', 'minor'],
    default: 'supporting'
  },
  description: String,
  attributes: {
    physical: {
      age: Number,
      gender: String,
      appearance: String,
      // Additional physical attributes
      height: String,
      weight: String,
      eyeColor: String,
      hairColor: String,
      distinguishingFeatures: String
    },
    personality: {
      traits: [String],
      strengths: [String],
      flaws: [String],
      // Additional personality attributes
      values: [String],
      fears: [String],
      desires: [String],
      temperament: String
    },
    background: {
      history: String,
      occupation: String,
      education: String,
      // Additional background information
      birthplace: String,
      familyBackground: String,
      significantEvents: [String],
      skills: [String]
    }
  },
  arc: {
    type: String,
    enum: ['flat', 'growth', 'fall', 'transformation', 'none'],
    default: 'none'
  },
  goals: [String],
  motivations: [String],
  conflicts: [String],
  // Scenes where this character appears
  appearances: [{
    scene: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scene'
    },
    significance: {
      type: String,
      enum: ['major', 'moderate', 'minor'],
      default: 'moderate'
    }
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
CharacterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
CharacterSchema.index({ novel: 1 });
CharacterSchema.index({ novel: 1, name: 1 });
CharacterSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Character', CharacterSchema);
