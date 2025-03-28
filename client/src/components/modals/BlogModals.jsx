import React, { useState, useEffect } from 'react';
import { Modal, Button, TextInput, Textarea } from 'flowbite-react';

const BlogModals = ({ show, onClose, data, onSave }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Edit Blog</Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <TextInput
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            placeholder="Enter Blog Title"
            label="Title"
          />
        </div>
        <div className="mb-4">
          <Textarea
            name="content"
            value={formData.content || ''}
            onChange={handleChange}
            placeholder="Enter Blog Content"
            label="Content"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Save</Button>
        <Button color="gray" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BlogModals;