import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from '../../context/AuthContext';
import { HR } from "flowbite-react";

Quill.register("modules/imageResize", ImageResize);

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndCheckUser = async () => {
      try {
        if (!user || !user.isAdmin) {
          console.log("User is not an admin. Redirecting...");
          navigate('/login', { replace: true });
        } else {
          console.log("User is an admin. Access granted.");
        }
      } catch (error) {
        console.error("Failed to perform admin check:", error);
        navigate('/login', { replace: true });
      }
    };

    fetchAndCheckUser();
  }, [user, navigate]);

  const handleValidation = () => {
    if (!title) {
      toast.error("Blog title is required!");
      return false;
    }
    if (!content || content.trim() === "<p><br></p>") {
      toast.error("Blog content is required!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    try {
      const response = await axiosInstance.post("admin/blogs", {
        title,
        content
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      });
      if (response.status === 201) {
        toast.success("Blog created successfully!");
        setTitle("");
        setContent("");
      } else {
        toast.error(response.data.message || "Failed to create blog. Please try again.");
      }
    } catch (error) {
      console.error("Error creating blog", error);
      toast.error("Failed to create blog. Please try again.");
    }
  };

  const toolbarOptions = [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ];

  const modules = {
    toolbar: toolbarOptions,
    imageResize: {
      modules: ["Resize", "DisplaySize", "Toolbar"],
    },
  };

  return (
    <div className="flex justify-center items-start mt-10 px-5">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-center mb-5">Add New Blog</h1>
        <div>
          <Label htmlFor="blog-title" value="Blog Title" />
          <TextInput
            id="blog-title"
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="content" value="Blog Content" />
          <ReactQuill
            id="content"
            value={content}
            onChange={setContent}
            placeholder="Enter blog content..."
            theme="snow"
            modules={modules}
            className="mt-2"
            style={{ height: "500px" }}
          />
        </div>
        <HR />
        <div className="flex justify-center">
          <Button type="submit" gradientDuoTone="cyanToBlue" className="px-10">
            Submit
          </Button>
       </div>
       <br></br>
      </form>
    </div>
  );
};

export default AddBlog;