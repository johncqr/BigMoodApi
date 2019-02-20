const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: String,
    firstName: String,
    lastName: String,
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);