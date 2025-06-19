const express = require('express');
const router = express.Router();
const appController = require('../controllers/verify');

router.get('/user/:code', appController.getUserByCode);

module.exports = router;