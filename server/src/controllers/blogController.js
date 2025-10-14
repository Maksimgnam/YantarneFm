const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary');

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};





exports.createBlog = async (req, res) => {
  try {
    let imageUrl = null;


    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blogs'
      });
      imageUrl = result.secure_url;
    }

    const title = req.body.title;
    const description = req.body.description;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newBlog = new Blog({
      title,
      description,
      image: imageUrl
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blogs'
      });
      imageUrl = result.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        description: req.body.description,
        ...(imageUrl && { image: imageUrl })
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(updatedBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
