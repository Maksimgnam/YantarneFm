const mongoose = require('mongoose');
const {generateID} = require('../utils/idGenerator');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  id: {
    type: Number,
    default: generateID()
  },
  email: {
    type: String,
    required: true
  },
  savedSongs: {
    type: Array,
    required: true,
    default: []
  }
});

userSchema.index({ telegramId: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);