const TopSong = require('../models/TopSong');
const cloudinary = require('../config/cloudinary');



exports.updateTopSong = async (req, res) => {
  try {
    const { id } = req.params;

    let audioUrl = req.body.audio || null;
    let imageUrl = req.body.image || null;


    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'top-songs/audio',
        resource_type: 'video', 
      });
      audioUrl = result.secure_url;
    }

    const updateData = {
      title: req.body.title,
      artist: req.body.artist,
      image: imageUrl, 
      ...(audioUrl && { audio: audioUrl }),
    };

    const updatedSong = await TopSong.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedSong);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update song' });
  }
};

exports.getTopSongs = async (req, res) => {
  try {
    const songs = await TopSong.find().sort({ index: 1 }).limit(5);
    res.json({ songs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
