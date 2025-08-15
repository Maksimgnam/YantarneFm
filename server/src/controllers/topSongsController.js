const TopSong = require('../models/TopSong');

// Get all top songs
exports.getTopSongs = async (req, res) => {
  try {
    const songs = await TopSong.find().sort({ index: 1 }).limit(5);
    res.json({ songs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a song
exports.updateTopSong = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSong = await TopSong.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedSong);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
