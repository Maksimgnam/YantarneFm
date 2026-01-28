const express = require('express');
const multer = require('multer');
const router = express.Router();
const backController = require('../controllers/backController');

// Multer config (temporary uploads folder)
const upload = multer({ dest: 'uploads/' }); 

/**
 * @swagger
 * /back-images:
 *   post:
 *     summary: Upload background images
 *     description: Upload up to 5 background images. Only last 5 are kept.
 *     tags:
 *       - Backgrounds
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Background images updated successfully
 *       400:
 *         description: No files uploaded
 *       500:
 *         description: Failed to upload background images
 */
router.post('/back-images', upload.array('images', 5), backController.uploadBackImages);

/**
 * @swagger
 * /back-images:
 *   get:
 *     summary: Get background images
 *     description: Returns all stored background images
 *     tags:
 *       - Backgrounds
 *     responses:
 *       200:
 *         description: List of background images
 *       500:
 *         description: Failed to fetch background images
 */
router.get('/back-images', backController.getBackImages);

/**
 * @swagger
 * /back-images/{id}:
 *   delete:
 *     summary: Delete a background image
 *     description: Deletes a background image by its index from Cloudinary and DB
 *     tags:
 *       - Backgrounds
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Index of the image in backgroundImages array
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Image not found
 *       500:
 *         description: Failed to delete background image
 */
router.delete('/back-images/:id', backController.deleteBackImage);

module.exports = router;
