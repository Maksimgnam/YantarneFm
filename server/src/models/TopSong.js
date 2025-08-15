const mongoose = require('mongoose');

const topSongSchema = new mongoose.Schema({
  index: Number, // for sorting
  title: String,
  artist: String,
  image: String, // cover URL
  audio: String  // mp3 URL
});

module.exports = mongoose.model('TopSong', topSongSchema);
