const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Telegram route is working!');
});

module.exports = router;
