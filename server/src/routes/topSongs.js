const express = require('express');
const multer = require('multer');
const { getTopSongs, updateTopSong } = require('../controllers/topSongsController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 


router.get('/top-songs', getTopSongs);


router.put('/top-songs/:id', upload.single('audio'), updateTopSong);

module.exports = router;
