const express = require('express');
const router = express.Router();
const {sendToAdmin} = require('../controllers/telegramController');

router.post('/send-message', sendToAdmin);

module.exports = router;