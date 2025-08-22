
const Back = require('../models/Back');
const cloudinary = require('../config/cloudinary');

exports.uploadBackImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Upload all images to Cloudinary
    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, { folder: 'backgrounds' })
    );
    const results = await Promise.all(uploadPromises);

    const newImages = results.map(r => r.secure_url);

    // Find or create Back document
    let backDoc = await Back.findOne();

    if (backDoc) {
      // Append new images, max 5
      backDoc.backgroundImages = [
        ...backDoc.backgroundImages,
        ...newImages
      ].slice(-5); // keep only latest 5
      await backDoc.save();
    } else {
      backDoc = await Back.create({
        backgroundImages: newImages.slice(-5)
      });
    }

    res.json({
      message: 'Background images updated successfully',
      backgroundImages: backDoc.backgroundImages
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload background images' });
  }
};

exports.getBackImages = async (req, res) => {
  try {
    const backDoc = await Back.findOne();
    res.json({ backgroundImages: backDoc ? backDoc.backgroundImages : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch background images' });
  }
};


exports.deleteBackImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find document
    const backDoc = await Back.findOne();
    if (!backDoc) return res.status(404).json({ error: 'No backgrounds found' });

    // Remove from Cloudinary
    const imageUrl = backDoc.backgroundImages[id];
    if (!imageUrl) return res.status(404).json({ error: 'Image not found' });

    // extract public_id from URL
    const publicId = imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`backgrounds/${publicId}`);

    // Remove from DB array
    backDoc.backgroundImages.splice(id, 1);
    await backDoc.save();

    res.json({ message: 'Image deleted successfully', backgroundImages: backDoc.backgroundImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete background image' });
  }
};
