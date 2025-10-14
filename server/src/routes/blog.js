const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/blogs', blogController.getAllBlogs);


router.get('/blogs/:id', blogController.getBlogById);


router.post('/blogs', upload.single('image'), blogController.createBlog);

router.put('/blogs/:id', upload.single('image'), blogController.updateBlog);


router.delete('/blogs/:id', blogController.deleteBlog);


module.exports = router;
