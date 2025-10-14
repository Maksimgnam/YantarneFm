const express = require('express');
const router = express.Router();
const cnnController = require('../controllers/cnnController');

router.get('/cnn-texts', cnnController.getCnnTexts);
router.post('/cnn-texts', cnnController.addCnnText);
router.delete('/cnn-texts', cnnController.deleteCnnText);


module.exports = router;
