const express = require('express');
const multer = require('multer');
const router = express.Router();
const backController = require('../controllers/backController');

const upload = multer({ dest: 'uploads/' }); // temp storage before Cloudinary upload

router.post('/back-image', upload.single('image'), backController.uploadBackImage);
router.get('/back-image', backController.getBackImage);

module.exports = router;
