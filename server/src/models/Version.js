const mongoose = require('mongoose');

const VersionSchema = new mongoose.Schema({
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel',
    required: true
  },
  versionNumber: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    default: function() {
      return `Version ${this.versionNumber}`;
    }
  },
  description: String,
  // Parent version (for branching)
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Version'
  },
  // Branch information
  branch: {
    name: String,
    isMainBranch: {
      type: Boolean,
      default: true
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient querying
VersionSchema.index({ novel: 1, versionNumber: 1 }, { unique: true });
VersionSchema.index({ parent: 1 });
VersionSchema.index({ 'branch.name': 1 });

module.exports = mongoose.model('Version', VersionSchema);
