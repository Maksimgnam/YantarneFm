const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     description: Retrieve a list of all blogs
 *     tags:
 *       - Blogs
 *     responses:
 *       200:
 *         description: List of blogs
 *       500:
 *         description: Server error
 */
router.get('/blogs', blogController.getAllBlogs);

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get blog by ID
 *     description: Retrieve a single blog by its ID
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Blog ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.get('/blogs/:id', blogController.getBlogById);

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog
 *     description: Create a new blog with optional image upload
 *     tags:
 *       - Blogs
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My Blog Post"
 *               description:
 *                 type: string
 *                 example: "This is the content of my blog."
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/blogs', upload.single('image'), blogController.createBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update a blog
 *     description: Update a blog by ID, can also update image
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Blog ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.put('/blogs/:id', upload.single('image'), blogController.updateBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog
 *     description: Delete a blog by its ID
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Blog ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.delete('/blogs/:id', blogController.deleteBlog);

module.exports = router;
