import React, { useState, useEffect } from 'react';
import { Modal, Button, TextInput } from 'flowbite-react';
import { toast } from 'react-toastify';

const ModeratorsModals = ({ show, onClose, data, onSave }) => {
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
      <Modal.Header>Edit Data</Modal.Header>
      <Modal.Body>
        {Object.keys(formData).map((key) => (
          <div key={key} className="mb-4">
            <TextInput
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
            />
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Save</Button>
        <Button color="gray" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModeratorsModals;