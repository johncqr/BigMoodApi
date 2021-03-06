const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const profileSchema = new Schema({
  mood: String,
  goal: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  context: { type: Schema.Types.Mixed }
}, { versionKey: false });

module.exports = mongoose.model('Profile', profileSchema);