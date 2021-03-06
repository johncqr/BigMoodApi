const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const eventSchema = new Schema({
  logs: [],
  date: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { versionKey: false });

module.exports = mongoose.model('Event', eventSchema);