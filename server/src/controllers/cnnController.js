const { v4: uuidv4 } = require('uuid');
const CNN = require('../models/CNN');


exports.getCnnTexts = async (req, res) => {
  try {
    const cnnId = '689ca2db2059cab0a253a27d';
    const cnnDoc = await CNN.findById(cnnId);
    if (!cnnDoc) return res.status(404).json({ message: 'CNN document not found' });

    res.json({ cnnTexts: cnnDoc.cnnTexts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.addCnnText = async (req, res) => {
  try {
    const cnnId = '689ca2db2059cab0a253a27d';
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const newObj = { id: uuidv4(), text: text.trim() };

    const updated = await CNN.findByIdAndUpdate(
      cnnId,
      { $push: { cnnTexts: newObj } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'CNN document not found' });

    res.json(updated.cnnTexts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.deleteCnnText = async (req, res) => {
  try {
    const cnnId = '689ca2db2059cab0a253a27d';
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }

    const updated = await CNN.findByIdAndUpdate(
      cnnId,
      { $pull: { cnnTexts: { id: id } } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'CNN document not found' });

    res.json(updated.cnnTexts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
