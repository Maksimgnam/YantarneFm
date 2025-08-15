const express = require('express');
const router = express.Router();
const topSongsController = require('../controllers/topSongsController');

// GET all
router.get('/top-songs', topSongsController.getTopSongs);

// UPDATE one song
router.put('/top-songs/:id', topSongsController.updateTopSong);

// OPTIONAL: Seed data
module.exports = router;
