import React, { useContext, useState } from 'react';
import { Card, Avatar, Label, TextInput, Button, Modal } from 'flowbite-react';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [imageLink, setImageLink] = useState(user?.avatar || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [codeforcesHandle, setCodeforcesHandle] = useState(user?.cf_handle || '');
  const placeholderAvatar = 'https://www.gravatar.com/avatar/?d=identicon';

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <div className="flex items-center space-x-4">
          <Avatar img={user.avatar} size="xl" />
          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p>{user.name || 'No Name Provided'}</p>
            <p>{user.email || 'No email available'}</p>
            <p>{user.phone || 'No phone available'}</p>
            <p>{user.cf_handle || 'No Codeforces handle'}</p>
            <p>{user.isAdmin ? 'Admin' : 'User'}</p>
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

      <Modal show={isModalOpen} onClose={handleCloseModal}>
        <Modal.Header>Edit Profile</Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;