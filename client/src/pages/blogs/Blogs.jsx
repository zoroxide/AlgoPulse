import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-quill/dist/quill.snow.css";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const blogsPerPage = 10;
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axiosInstance.get('/blogs');
                const sortedBlogs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setBlogs(sortedBlogs.map(blog => ({
                    ...blog,
                    userVote: blog.upvotedBy.includes(user._id) ? 'upvote' : blog.downvotedBy.includes(user._id) ? 'downvote' : null
                })));
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch blogs');
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [user]);

    const handleUpvote = async (blogId) => {
        if (!user || !user._id) {
            toast.error('Something went wrong');
            console.error('User ID is required');
            return;
        }

        const blog = blogs.find(blog => blog._id === blogId);
        if (blog.userVote === 'upvote') {
            // Remove upvote
            try {
                await axiosInstance.post(`/blogs/${blogId}/downvote`, { userId: user._id });
                setBlogs(blogs.map(blog => blog._id === blogId ? { ...blog, upvotes: blog.upvotes - 1, userVote: null } : blog));
                toast.success('Upvote removed');
            } catch (err) {
                toast.error('Failed to remove upvote');
            }
        } else {
            try {
                await axiosInstance.post(`/blogs/${blogId}/upvote`, { userId: user._id });
                setBlogs(blogs.map(blog => blog._id === blogId ? { ...blog, upvotes: blog.upvotes + 1, downvotes: blog.userVote === 'downvote' ? blog.downvotes - 1 : blog.downvotes, userVote: 'upvote' } : blog));
                toast.success('Blog upvoted successfully');
            } catch (err) {
                toast.error('Failed to upvote blog');
            }
        }
    };

    const handleDownvote = async (blogId) => {
        if (!user || !user._id) {
            toast.error('Something went wrong');
            console.error('User ID is required');
            return;
        }

        const blog = blogs.find(blog => blog._id === blogId);
        if (blog.userVote === 'downvote') {
            // Remove downvote
            try {
                await axiosInstance.post(`/blogs/${blogId}/remove-vote`, { userId: user._id });
                setBlogs(blogs.map(blog => blog._id === blogId ? { ...blog, downvotes: blog.downvotes - 1, userVote: null } : blog));
                toast.success('Downvote removed');
            } catch (err) {
                toast.error('Failed to remove downvote');
            }
        } else {
            // Add downvote
            try {
                await axiosInstance.post(`/blogs/${blogId}/downvote`, { userId: user._id });
                setBlogs(blogs.map(blog => blog._id === blogId ? { ...blog, downvotes: blog.downvotes + 1, upvotes: blog.userVote === 'upvote' ? blog.upvotes - 1 : blog.upvotes, userVote: 'downvote' } : blog));
                toast.success('Blog downvoted successfully');
            } catch (err) {
                toast.error('Failed to downvote blog');
            }
        }
    };

    const handleRemoveVote = async (blogId) => {
        if (!user || !user._id) {
            toast.error('Something went wrong');
            console.error('User ID is required');
            return;
        }

        try {
            await axiosInstance.post(`/blogs/${blogId}/remove-vote`, { userId: user._id });
            const blog = blogs.find(blog => blog._id === blogId);
            setBlogs(blogs.map(blog => blog._id === blogId ? {
                ...blog,
                upvotes: blog.userVote === 'upvote' ? blog.upvotes - 1 : blog.upvotes,
                downvotes: blog.userVote === 'downvote' ? blog.downvotes - 1 : blog.downvotes,
                userVote: null
            } : blog));
            toast.success('Vote removed');
        } catch (err) {
            toast.error('Failed to remove vote');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredBlogs = blogs.filter(blog => blog.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const pageCount = Math.ceil(filteredBlogs.length / blogsPerPage);
    const offset = currentPage * blogsPerPage;
    const currentBlogs = filteredBlogs.slice(offset, offset + blogsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <ToastContainer />
            <h1 className="text-3xl font-semibold mb-4">Blogs</h1>
            <input
                type="text"
                placeholder="Search by title"
                value={searchTerm}
                onChange={handleSearch}
                className="mb-4 p-2 border rounded"
            />
            {currentBlogs.map(blog => (
                <div key={blog._id} className="mb-6 p-4 border rounded shadow">
                    <div className="flex items-center mb-4">
                        <img
                            alt={`${blog.author.username} avatar`}
                            src={blog.author.avatar}
                            className="rounded-full h-12 w-12 mr-2"
                        />
                        <div>
                            <h3 className="text-lg font-semibold">{blog.author.name}</h3>
                            <p className="text-sm text-gray-500">@{blog.author.username}</p>
                            <p className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    <div className="flex items-center">
                        <button
                            className={`mr-4 flex items-center ${blog.userVote === 'upvote' ? 'text-blue-500' : 'text-gray-500'}`}
                            onClick={() => handleUpvote(blog._id)}
                        >
                            <FaArrowUp className="mr-1" /> Upvote ({blog.upvotes})
                        </button>
                        <button
                            className={`mr-4 flex items-center ${blog.userVote === 'downvote' ? 'text-red-500' : 'text-gray-500'}`}
                            onClick={() => handleDownvote(blog._id)}
                        >
                            <FaArrowDown className="mr-1" /> Downvote ({blog.downvotes})
                        </button>
                        {/* <button
                            className="flex items-center text-gray-500"
                            onClick={() => handleRemoveVote(blog._id)}
                        >
                            ❌ Remove Vote
                        </button> */}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Blogs;