const express = require('express');
const router = express.Router();
const appController = require('../controllers/user');

router.get('/user/:id', appController.getUser);

module.exports = router;