const mongoose = require('mongoose');

const topSongSchema = new mongoose.Schema({
  index: Number, 
  title: String,
  artist: String,
  image: String, 
  audio: String  
});

module.exports = mongoose.model('TopSong', topSongSchema);
