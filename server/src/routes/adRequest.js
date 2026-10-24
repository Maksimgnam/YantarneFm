const express = require('express');
const { createAdRequest } = require('../controllers/adRequestController');

const router = express.Router();

/**
 * @swagger
 * /ad-request:
 *   post:
 *     summary: Заявка «Замовити рекламу» з сайту
 *     description: Перевіряє дані й надсилає заявку адміністраторам у Telegram (ADS_CHAT_ID).
 *     tags:
 *       - Ads
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, types]
 *             properties:
 *               types: { type: array, items: { type: string } }
 *               name: { type: string }
 *               company: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *               contactVia: { type: string }
 *               start: { type: string }
 *               budget: { type: string }
 *               about: { type: string }
 *     responses:
 *       200: { description: Заявку надіслано }
 *       400: { description: Не заповнено обов'язкові поля }
 *       429: { description: Забагато заявок з однієї IP }
 *       503: { description: Не налаштовано ADS_CHAT_ID }
 */
router.post('/ad-request', createAdRequest);

module.exports = router;
