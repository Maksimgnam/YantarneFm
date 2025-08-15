const mongoose = require('mongoose');

const cnnSchema = new mongoose.Schema({
    cnnTexts: [
        {
          id: String,
          text: String
        }
      ]
});



module.exports = mongoose.model('CNN', cnnSchema);