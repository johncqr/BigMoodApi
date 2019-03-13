const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const eventMetaSchema = new Schema({
  name: String,
  happyScore: Number,
  neutralScore: Number,
  sadScore: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { versionKey: false });

module.exports = mongoose.model('EventMeta', eventMetaSchema);