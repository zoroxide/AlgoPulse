import React, { useState, useEffect } from 'react';
import { Modal, Button, TextInput } from 'flowbite-react';

const SheetModals = ({ show, onClose, data, onSave, allProblems = [] }) => { // Default value for allProblems
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    difficulty: '',
    problems: [],
    ...data, // Merge with incoming data
  });
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setFormData({
      name: '',
      content: '',
      difficulty: '',
      problems: [],
      ...data, // Merge with incoming data
    });
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

  const filteredProblems = allProblems.filter((problem) =>
    problem.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Modal show={show} onClose={onClose} size="lg">
        <Modal.Header>Edit Sheet</Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <TextInput
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="Enter Sheet Name"
              label="Name"
            />
          </div>
          <div className="mb-4">
            <TextInput
              name="content"
              value={formData.content || ''}
              onChange={handleChange}
              placeholder="Enter Sheet Content"
              label="Content"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Problems</h3>
            {formData.problems.map((problemId) => {
              const problem = allProblems.find((p) => p._id === problemId);
              return (
                <div key={problemId} className="mb-2">
                  {problem ? problem.name : 'Unknown Problem'}
                </div>
              );
            })}
            <Button
              color="success"
              className="mt-4"
              onClick={() => setShowProblemModal(true)}
            >
              Manage Problems
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>Save</Button>
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Problem Management Modal */}
      <Modal show={showProblemModal} onClose={() => setShowProblemModal(false)} size="lg">
        <Modal.Header>Manage Problems</Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <TextInput
              placeholder="Search for a problem"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            {filteredProblems.map((problem) => (
              <div key={problem._id} className="flex items-center justify-between mb-2">
                <span>{problem.name}</span>
                <input
                  type="checkbox"
                  checked={formData.problems.includes(problem._id)}
                  onChange={() => handleProblemToggle(problem._id)}
                />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowProblemModal(false)}>Done</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SheetModals;