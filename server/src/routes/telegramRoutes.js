const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Telegram
 *   description: Test route for Telegram API
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Test Telegram route
 *     description: Simple test route to check if Telegram route is working
 *     tags:
 *       - Telegram
 *     responses:
 *       200:
 *         description: Telegram route is working
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Telegram route is working!
 */
router.get('/', (req, res) => {
  res.send('Telegram route is working!');
});

module.exports = router;
