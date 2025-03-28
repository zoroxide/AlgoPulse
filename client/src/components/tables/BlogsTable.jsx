import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BlogModals from "../modals/BlogModals";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axiosInstance";
import "./UserTable.css";

const BlogsTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/blogs")
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setBlogs(data);
        } else {
          console.error("Expected an array but got:", data);
          setBlogs([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const optionsBodyTemplate = (rowData) => {
    return (
      <div className="flex space-x-2">
        <Button color="info" size="xs" onClick={() => handleEdit(rowData)}>
          Edit
        </Button>
        <Button color="failure" size="xs" onClick={() => handleDelete(rowData)}>
          Delete
        </Button>
      </div>
    );
  };

  const handleEdit = (rowData) => {
    setSelectedBlog(rowData);
    setIsModalOpen(true);
  };

  const handleDelete = (rowData) => {
    axiosInstance
      .delete(`/admin/blogs/${rowData._id}`)
      .then((response) => {
        toast.success("Blog deleted successfully!");
        setBlogs(blogs.filter((blog) => blog._id !== rowData._id));
      })
      .catch((error) => {
        toast.error("Error deleting blog!");
        console.error("Error deleting blog:", error);
      });
  };

  const handleSave = (updatedBlog) => {
    axiosInstance
      .put(`/admin/blogs/${updatedBlog._id}`, updatedBlog)
      .then((response) => {
        toast.success("Blog updated successfully!");
        setBlogs(
          blogs.map((blog) =>
            blog._id === updatedBlog._id ? updatedBlog : blog
          )
        );
        setIsModalOpen(false);
      })
      .catch((error) => {
        toast.error("Error updating blog!");
        console.error("Error updating blog:", error);
      });
  };

  const header = (
    <div className="table-header flex justify-between items-center">
      <span>List of Blogs</span>
      <Button
        onClick={() => navigate("/admin/create-blog")}
        gradientDuoTone="cyanToBlue"
      >
        Add Blog
      </Button>
    </div>
  );

  return (
    <div className="blogs-table-container">
      <ToastContainer />
      <DataTable
        value={blogs}
        paginator
        rows={10}
        dataKey="_id"
        loading={loading}
        globalFilterFields={[
          "title",
          "author.name",
          "upvotedBy",
          "downvotedBy",
        ]}
        header={header}
        emptyMessage="No blogs found."
        className="p-datatable-custom"
      >
        <Column
          field="createdAt"
          header="Created Date"
          body={(rowData) => new Date(rowData.createdAt).toLocaleDateString()}
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="title"
          header="Title"
          filter
          filterPlaceholder="Search by title"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="author.name"
          header="Author Name"
          filter
          filterPlaceholder="Search by author name"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="upvotedBy"
          header="Upvotes"
          body={(rowData) => rowData.upvotedBy.length}
          filter
          filterPlaceholder="Search by upvotes"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="downvotedBy"
          header="Downvotes"
          body={(rowData) => rowData.downvotedBy.length}
          filter
          filterPlaceholder="Search by downvotes"
          style={{ minWidth: "12rem" }}
        />
        <Column
          header="Options"
          body={optionsBodyTemplate}
          style={{ minWidth: "10rem" }}
        />
      </DataTable>
      {selectedBlog && (
        <BlogModals
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedBlog}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default BlogsTable;
