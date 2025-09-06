const express = require('express');
const router = express.Router();
const appController = require('../controllers/videoPageController');

router.post('/videoPage', appController.videoPage);

router.get('/getVideoPage', appController.getVideoPage)

module.exports = router;