const Back = require('../models/Back');
const cloudinary = require('../config/cloudinary');

exports.uploadBackImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'backgrounds'
    });

    // Update or create
    let backDoc = await Back.findOne();
    if (backDoc) {
      backDoc.backgroundImage = result.secure_url;
      await backDoc.save();
    } else {
      backDoc = await Back.create({ backgroundImage: result.secure_url });
    }

    res.json({ message: 'Background updated successfully', backgroundImage: backDoc.backgroundImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload background image' });
  }
};

exports.getBackImage = async (req, res) => {
  try {
    const backDoc = await Back.findOne();
    res.json({ backgroundImage: backDoc ? backDoc.backgroundImage : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch background image' });
  }
};
