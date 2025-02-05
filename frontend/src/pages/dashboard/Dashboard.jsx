import React, { useContext, useState, useEffect } from 'react';
import { Card, Avatar, Label, TextInput, Button, Modal, Table } from 'flowbite-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const getUserData = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("admin panel error: no token found");
            throw new Error('No token found. Please log in.');
        }
        const response = await axiosInstance.get('/get-user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [imageLink, setImageLink] = useState(user?.avatar || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [codeforcesHandle, setCodeforcesHandle] = useState(user?.cf_handle || '');
  const [submissions, setSubmissions] = useState([]);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setName(userData.name);
        setImageLink(userData.avatar);
        setPhone(userData.phone);
        setCodeforcesHandle(userData.cf_handle);
        fetchUserSubmissions(userData._id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUserSubmissions = async (userId) => {
      try {
        const response = await axiosInstance.get(`/submissions/user/${userId}`);
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching user submissions:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProblemClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  const handleFailedTestCaseClick = (testCase) => {
    setSelectedTestCase(testCase);
    setIsModalOpen(true);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

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
            <p>Codefroces Handle: {user.cf_handle || 'No Codeforces handle'}</p>
            <p>Role: {user.isAdmin ? 'Admin' : 'User'}</p>
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
          </Table.Head>
          <Table.Body>
            {submissions.map((submission) => (
              <Table.Row key={submission._id}>
                <Table.Cell>
                  <button onClick={() => handleProblemClick(submission.problem._id)}>
                    {submission.problem.name}
                  </button>
                </Table.Cell>
                <Table.Cell>{new Date(submission.time).toLocaleString()}</Table.Cell>
                <Table.Cell>{submission.accepted ? 'Yes' : 'No'}</Table.Cell>
                <Table.Cell>
                  {submission.failedTestcase !== null ? (
                    <button onClick={() => handleFailedTestCaseClick(submission.failedTestcase)}>
                      {submission.failedTestcase}
                    </button>
                  ) : 'N/A'}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      <Modal show={isModalOpen} onClose={handleCloseModal}>
        <Modal.Header>{selectedTestCase ? 'Failed Testcase Info' : 'Edit Profile'}</Modal.Header>
        <Modal.Body>
          {selectedTestCase ? (
            <div>
              <p><strong>Input:</strong> {selectedTestCase.input}</p>
              <p><strong>Expected Output:</strong> {selectedTestCase.expectedOutput}</p>
              <p><strong>Actual Output:</strong> {selectedTestCase.actualOutput}</p>
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