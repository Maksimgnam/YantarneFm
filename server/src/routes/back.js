
const express = require('express');
const multer = require('multer');
const router = express.Router();
const backController = require('../controllers/backController');


const upload = multer({ dest: 'uploads/' }); 


router.post('/back-images', upload.array('images', 5), backController.uploadBackImages);

router.delete('/back-images/:id', backController.deleteBackImage);

router.get('/back-images', backController.getBackImages);

module.exports = router;
