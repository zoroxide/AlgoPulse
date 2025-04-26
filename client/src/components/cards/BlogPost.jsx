import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const BlogPost = ({ blog }) => {
  return (
    <div className="mb-6 p-4 border rounded shadow">
      <div className="flex items-center mb-4">
        <img
          alt={`${blog.author.username} avatar`}
          src={blog.author.avatar}
          className="rounded-full h-12 w-12 mr-2"
        />
        <div>
          <h3 className="text-lg font-semibold">{blog.author.name}</h3>
          <p className="text-sm text-gray-500">@{blog.author.username}</p>
          <p className="text-sm text-gray-500">
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
};

export default BlogPost;