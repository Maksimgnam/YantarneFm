const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
});



module.exports = mongoose.model('VideoPage', videoSchema);