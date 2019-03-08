const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const healthSchema = new Schema({
  date: Date,
  info: Schema.Types.Mixed,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { versionKey: false });

module.exports = mongoose.model('Health', healthSchema);