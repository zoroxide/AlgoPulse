const Blog = require('../../models/Blog');
const mongoose = require('mongoose');

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'username avatar name');
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch blogs', error: err.message });
    }
};

exports.getBlogById = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid blog ID' });
    }

    try {
        const blog = await Blog.findById(id).populate('author', 'username avatar name');
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch blog', error: err.message });
    }
};

exports.upvoteBlog = async (req, res) => {
    const { id } = req.params;
    const userId = req.body.userId;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid blog ID' });
    }

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Initialize upvotedBy and downvotedBy arrays if they are undefined
        if (!blog.upvotedBy) blog.upvotedBy = [];
        if (!blog.downvotedBy) blog.downvotedBy = [];

        // Check if the user has already upvoted the blog
        if (blog.upvotedBy.includes(userId)) {
            return res.status(400).json({ message: 'You have already upvoted this blog' });
        }

        // shhhhhhhhhhhhhhhhh yarab ma7ad ya5od baloh men el 5ara dah
        if (blog.downvotedBy.includes(userId)) {
            blog.downvotes -= 1;
        }

        // Remove user from downvotedBy array if they have downvoted the blog
        blog.downvotedBy = blog.downvotedBy.filter(user => user.toString() !== userId.toString());

        blog.upvotes += 1;
        blog.upvotedBy.push(userId);
        await blog.save();
        res.json({ message: 'Blog upvoted successfully', blog });
    } catch (err) {
        res.status(500).json({ message: 'Failed to upvote blog', error: err.message });
    }
};

exports.downvoteBlog = async (req, res) => {
    const { id } = req.params;
    const userId = req.body.userId;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid blog ID' });
    }

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Initialize upvotedBy and downvotedBy arrays if they are undefined
        if (!blog.upvotedBy) blog.upvotedBy = [];
        if (!blog.downvotedBy) blog.downvotedBy = [];

        // Check if the user has already downvoted the blog
        if (blog.downvotedBy.includes(userId)) {
            return res.status(400).json({ message: 'You have already downvoted this blog' });
        }

        // shhhhhhhhhhhhhhhhh yarab ma7ad ya5od baloh men el 5ara dah
        if (blog.upvotedBy.includes(userId)) {
            blog.upvotes -= 1;
        }

        // Remove user from upvotedBy array if he was upvoted the blog
        blog.upvotedBy = blog.upvotedBy.filter(user => user.toString() !== userId.toString());

        blog.downvotes += 1;
        blog.downvotedBy.push(userId);
        await blog.save();
        res.json({ message: 'Blog downvoted successfully', blog });
    } catch (err) {
        res.status(500).json({ message: 'Failed to downvote blog', error: err.message });
    }
};