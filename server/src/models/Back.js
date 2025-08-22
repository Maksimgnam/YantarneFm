
const mongoose = require('mongoose');

const backSchema = new mongoose.Schema({
  backgroundImages: {
    type: [String], 
    default: []
  }
});

module.exports = mongoose.model('Back', backSchema);

