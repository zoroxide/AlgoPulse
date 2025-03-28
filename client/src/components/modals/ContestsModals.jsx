import React, { useState, useEffect } from 'react';
import { Modal, Button, TextInput, Textarea, Select, Checkbox } from 'flowbite-react';

const ContestModals = ({ show, onClose, data, onSave, problems }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProblemToggle = (problemId) => {
    const updatedProblems = formData.problems.includes(problemId)
      ? formData.problems.filter((id) => id !== problemId)
      : [...formData.problems, problemId];
    setFormData({ ...formData, problems: updatedProblems });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal show={show} onClose={onClose} size="lg">
      <Modal.Header>Edit Contest</Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <TextInput
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="Enter Contest Name"
            label="Name"
          />
        </div>
        <div className="mb-4">
          <Textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Enter Contest Description"
            label="Description"
          />
        </div>
        <div className="mb-4">
          <Select
            name="difficulty"
            value={formData.difficulty || ''}
            onChange={handleChange}
            label="Difficulty"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </div>
        <div className="mb-4">
          <TextInput
            name="startTime"
            type="datetime-local"
            value={formData.startTime || ''}
            onChange={handleChange}
            label="Start Time"
          />
        </div>
        <div className="mb-4">
          <TextInput
            name="endTime"
            type="datetime-local"
            value={formData.endTime || ''}
            onChange={handleChange}
            label="End Time"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">Problems</h3>
          {problems.map((problem) => (
            <div key={problem._id} className="flex items-center mb-2">
              <Checkbox
                checked={formData.problems.includes(problem._id)}
                onChange={() => handleProblemToggle(problem._id)}
              />
              <span className="ml-2">{problem.name}</span>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Save</Button>
        <Button color="gray" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContestModals;