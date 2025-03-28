import React, { useState, useEffect } from 'react';
import { Modal, Button, TextInput, Textarea, Select } from 'flowbite-react';

const ProblemsModals = ({ show, onClose, data, onSave }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.testcases];
    updatedTestCases[index][field] = value;
    setFormData({ ...formData, testcases: updatedTestCases });
  };

  const handleAddTestCase = () => {
    const newTestCase = { input: '', output: '' }; // Default empty test case
    setFormData({ ...formData, testcases: [...formData.testcases, newTestCase] });
  };

  const handleDeleteTestCase = (index) => {
    const updatedTestCases = formData.testcases.filter((_, i) => i !== index);
    setFormData({ ...formData, testcases: updatedTestCases });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal show={show} onClose={onClose} size="lg">
      <Modal.Header>Edit Problem</Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <TextInput
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="Enter Problem Name"
            label="Name"
          />
        </div>
        <div className="mb-4">
          <Textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Enter Problem Description"
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
        <div>
          <h3 className="text-lg font-bold mb-2">Test Cases</h3>
          {formData.testcases.map((testCase, index) => (
            <div key={index} className="mb-4 border p-4 rounded bg-gray-100">
              <TextInput
                name="input"
                value={testCase.input || ''}
                onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                placeholder="Enter Test Case Input"
                label={`Test Case ${index + 1} Input`}
              />
              <TextInput
                name="output"
                value={testCase.output || ''}
                onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                placeholder="Enter Test Case Output"
                label={`Test Case ${index + 1} Output`}
              />
              <Button
                color="failure"
                size="xs"
                className="mt-2"
                onClick={() => handleDeleteTestCase(index)}
              >
                Delete Test Case
              </Button>
            </div>
          ))}
          <Button color="success" className="mt-4" onClick={handleAddTestCase}>
            Add Test Case
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Save</Button>
        <Button color="gray" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProblemsModals;