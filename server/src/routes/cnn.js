const express = require('express');
const router = express.Router();
const cnnController = require('../controllers/cnnController');

/**
 * @swagger
 * tags:
 *   name: CNN Texts
 *   description: API for managing CNN texts
 */

/**
 * @swagger
 * /cnn-texts:
 *   get:
 *     summary: Get all CNN texts
 *     description: Retrieve a list of all CNN texts stored in the database
 *     tags:
 *       - CNN Texts
 *     responses:
 *       200:
 *         description: List of CNN texts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cnnTexts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "64f123abcd456ef7890gh12"
 *                       text:
 *                         type: string
 *                         example: "This is a sample CNN text."
 *       500:
 *         description: Server error
 */
router.get('/cnn-texts', cnnController.getCnnTexts);

/**
 * @swagger
 * /cnn-texts:
 *   post:
 *     summary: Add a new CNN text
 *     description: Add a new CNN text to the database
 *     tags:
 *       - CNN Texts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: "This is a sample CNN text."
 *     responses:
 *       201:
 *         description: CNN text added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/cnn-texts', cnnController.addCnnText);

/**
 * @swagger
 * /cnn-texts:
 *   delete:
 *     summary: Delete a CNN text
 *     description: Delete a CNN text. The text to delete should be provided in the request body.
 *     tags:
 *       - CNN Texts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: "This is a sample CNN text to delete."
 *     responses:
 *       200:
 *         description: CNN text deleted successfully
 *       404:
 *         description: Text not found
 *       500:
 *         description: Server error
 */
router.delete('/cnn-texts', cnnController.deleteCnnText);

module.exports = router;
