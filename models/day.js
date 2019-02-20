const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const daySchema = new Schema({
  mood: String,
  date: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { versionKey: false });

module.exports = mongoose.model('Day', daySchema);