const Blog = require('../../models/Blog');

exports.createBlog = async (req, res) => {
    const { title, content } = req.body;
    const author = req.user._id;

    try {
        const newBlog = new Blog({ title, content, author });
        await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully!', blog: newBlog });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create blog', error: err.message });
    }
};

exports.editBlog = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, { title, content }, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ message: 'Blog updated successfully!', blog: updatedBlog });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update blog', error: err.message });
    }
};

exports.deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete blog', error: err.message });
    }
};