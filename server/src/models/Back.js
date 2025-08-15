const mongoose = require('mongoose');

const backSchema = new mongoose.Schema({
    backgroundImage: { type: String, required: true }
});

module.exports = mongoose.model('Back', backSchema);
