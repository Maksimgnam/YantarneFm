const mongoose = require('mongoose');

const timetableEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  start_time: {
    type: String,
    required: true,
    trim: true
  },
  end_time: {
    type: String,
    required: true,
    trim: true
  },
  days: {
    type: [Number],
    default: []
  },
  date: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: '#6FA9F5'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TimetableEvent', timetableEventSchema);