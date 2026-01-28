const express = require('express');
const multer = require('multer');
const { getTopSongs, updateTopSong } = require('../controllers/topSongsController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 

/**
 * @swagger
 * tags:
 *   name: Top Songs
 *   description: API for managing top songs
 */

/**
 * @swagger
 * /top-songs:
 *   get:
 *     summary: Get top songs
 *     description: Retrieve a list of top songs
 *     tags:
 *       - Top Songs
 *     responses:
 *       200:
 *         description: List of top songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "64f123abcd456ef7890gh12"
 *                   title:
 *                     type: string
 *                     example: "Song Title"
 *                   artist:
 *                     type: string
 *                     example: "Artist Name"
 *                   audioUrl:
 *                     type: string
 *                     example: "https://example.com/audio.mp3"
 *       500:
 *         description: Server error
 */
router.get('/top-songs', getTopSongs);

/**
 * @swagger
 * /top-songs/{id}:
 *   put:
 *     summary: Update a top song
 *     description: Update a top song by ID. You can upload a new audio file.
 *     tags:
 *       - Top Songs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the top song to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Top song updated successfully
 *       404:
 *         description: Song not found
 *       500:
 *         description: Server error
 */
router.put('/top-songs/:id', upload.single('audio'), updateTopSong);

module.exports = router;
