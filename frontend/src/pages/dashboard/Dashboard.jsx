import React, { useContext, useState, useEffect } from 'react';
import { Card, Avatar, Label, TextInput, Button, Modal, Table, Badge } from 'flowbite-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import MonacoEditor from '@monaco-editor/react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [imageLink, setImageLink] = useState(user?.avatar || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [codeforcesHandle, setCodeforcesHandle] = useState(user?.cf_handle || '');
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSubmissions = async (userId) => {
      try {
        const response = await axiosInstance.get(`/submissions/user/${userId}`);
        const sortedSubmissions = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
        setSubmissions(sortedSubmissions);
      } catch (error) {
        console.error('Error fetching user submissions:', error);
      }
    };

    if (user) {
      setName(user.name);
      setImageLink(user.avatar);
      setPhone(user.phone);
      setCodeforcesHandle(user.cf_handle);
      fetchUserSubmissions(user._id);
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProblemClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const getBadge = (score) => {
    if (score < 50) return 'Beginner';
    if (score <= 100) return 'Survival';
    if (score <= 200) return 'Veteran';
    return 'Expert';
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <div className="flex items-center space-x-4">
          <Avatar img={user.avatar} size="xl" />
          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p>Name: {user.name || 'No Name Provided'}</p>
            <p>Email: {user.email || 'No email available'}</p>
            <p>Phone Number: {user.phone || 'No phone available'}</p>
            <p>Codeforces Handle: {user.cf_handle || 'No Codeforces handle'}</p>
            <p>Role: {user.isAdmin ? 'Admin' : 'User'}</p>
          </div>
          <div className="ml-auto text-right">
            <p>Score: {user.score}</p>
            <Badge color="info">{getBadge(user.score)}</Badge>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="solved_problems" value="Solved Problems" />
          <TextInput
            id="solved_problems"
            type="text"
            value={user.solved_problems ? user.solved_problems.length : 0}
            readOnly={true}
          />
        </div>
        <Button className="mt-4" onClick={handleEditProfile}>
          Edit Profile
        </Button>
      </Card>

      <Card className="mt-4">
        <h2 className="text-xl font-bold mb-4">Submissions</h2>
        <Table>
          <Table.Head>
            <Table.HeadCell>Problem Name</Table.HeadCell>
            <Table.HeadCell>Time</Table.HeadCell>
            <Table.HeadCell>Accepted</Table.HeadCell>
            <Table.HeadCell>Failed Testcase</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {submissions.map((submission) => (
              <Table.Row key={submission._id} className={submission.accepted ? 'bg-green-100' : 'bg-red-100'}>
                <Table.Cell>
                  <button onClick={() => handleProblemClick(submission.problem._id)}>
                    {submission.problem.name}
                  </button>
                </Table.Cell>
                <Table.Cell>{new Date(submission.time).toLocaleString()}</Table.Cell>
                <Table.Cell>{submission.accepted ? 'Yes' : 'No'}</Table.Cell>
                <Table.Cell>
                  {submission.failedTestcase !== null ? (
                    <button onClick={() => handleSubmissionClick(submission)}>
                      {submission.failedTestcase}
                    </button>
                  ) : 'N/A'}
                </Table.Cell>
                <Table.Cell>
                  <Button onClick={() => handleSubmissionClick(submission)}>
                    View Code
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      <Modal show={isModalOpen} onClose={handleCloseModal}>
        <Modal.Header>Submission Details</Modal.Header>
        <Modal.Body>
          {selectedSubmission ? (
            <div>
              <p><strong>User:</strong> {selectedSubmission.user.username}</p>
              <p><strong>Problem:</strong> {selectedSubmission.problem.name}</p>
              <p><strong>Time:</strong> {new Date(selectedSubmission.time).toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedSubmission.accepted ? 'Accepted' : 'Rejected'}</p>
              <p><strong>Code:</strong></p>
              <MonacoEditor
                height="400px"
                language="cpp"
                theme='vs-dark'
                value={selectedSubmission.code}
                options={{ readOnly: true }}
              />
              <p><strong>Failed Testcase:</strong> {selectedSubmission.failedTestcase !== null ? selectedSubmission.failedTestcase : 'N/A'}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="imageLink" className="block text-sm font-medium text-gray-700">Image Link</label>
                <input
                  type="text"
                  id="imageLink"
                  value={imageLink}
                  onChange={(e) => setImageLink(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="codeforcesHandle" className="block text-sm font-medium text-gray-700">Codeforces Handle</label>
                <input
                  type="text"
                  id="codeforcesHandle"
                  value={codeforcesHandle}
                  onChange={(e) => setCodeforcesHandle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;