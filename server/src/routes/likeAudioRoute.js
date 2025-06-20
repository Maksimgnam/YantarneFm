const express = require('express');
const router = express.Router();
const appController = require('../controllers/likeAudio');

router.post('/addSong', appController.likeAudio);

module.exports = router;