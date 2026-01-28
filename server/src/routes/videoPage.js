const express = require('express');
const router = express.Router();
const appController = require('../controllers/videoPageController');

/**
 * @swagger
 * tags:
 *   name: Video Page
 *   description: API for managing video page data
 */

/**
 * @swagger
 * /videoPage:
 *   post:
 *     summary: Create or update video page data
 *     description: Add new video page data or update existing data
 *     tags:
 *       - Video Page
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My Video Page"
 *               url:
 *                 type: string
 *                 example: "https://example.com/video.mp4"
 *               description:
 *                 type: string
 *                 example: "This is a description of the video page"
 *     responses:
 *       201:
 *         description: Video page data created/updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/videoPage', appController.videoPage);

/**
 * @swagger
 * /getVideoPage:
 *   get:
 *     summary: Get video page data
 *     description: Retrieve the current video page data
 *     tags:
 *       - Video Page
 *     responses:
 *       200:
 *         description: Video page data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "My Video Page"
 *                 url:
 *                   type: string
 *                   example: "https://example.com/video.mp4"
 *                 description:
 *                   type: string
 *                   example: "This is a description of the video page"
 *       404:
 *         description: Video page data not found
 *       500:
 *         description: Server error
 */
router.get('/getVideoPage', appController.getVideoPage);

module.exports = router;
