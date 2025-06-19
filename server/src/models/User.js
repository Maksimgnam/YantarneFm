const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    default: 0
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Індекси для оптимізації пошуку
userSchema.index({ telegramId: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);