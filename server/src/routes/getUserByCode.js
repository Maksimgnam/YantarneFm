const express = require('express');
const router = express.Router();
const appController = require('../controllers/verify');

router.get('/userByCode/:code', appController.getUserByCode);

module.exports = router;