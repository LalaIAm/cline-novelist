// Export all models from this central file for easier imports

const User = require('./User');
const Novel = require('./Novel');
const Version = require('./Version');
const Chapter = require('./Chapter');
const Scene = require('./Scene');
const Beat = require('./Beat');
const Character = require('./Character');
const Relationship = require('./Relationship');
const PlotElement = require('./PlotElement');
const Comment = require('./Comment');

module.exports = {
  User,
  Novel,
  Version,
  Chapter,
  Scene,
  Beat,
  Character,
  Relationship,
  PlotElement,
  Comment
};
