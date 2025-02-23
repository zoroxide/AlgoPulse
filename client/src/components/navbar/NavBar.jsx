import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navbar, Dropdown, Avatar, Button } from 'flowbite-react';

const Nav = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Navbar fluid rounded>
      <Navbar.Brand onClick={() => navigate('/')}>
        <img
          src="https://flowbite-react.com/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          AlgoPulse
        </span>
      </Navbar.Brand>
      <Navbar.Collapse>
        <Navbar.Link onClick={() => navigate('/sheets')}>Sheets</Navbar.Link>
        <Navbar.Link onClick={() => navigate('/contests')}>Contests</Navbar.Link>
        <Navbar.Link onClick={() => navigate('/problems')}>Problem Sets</Navbar.Link>
      </Navbar.Collapse>
      <div>
        {user ? (
          <Dropdown
            inline
            label={
              <Avatar
                alt="User settings"
                img={user.avatar || 'https://www.gravatar.com/avatar/?d=identicon'}
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{user.username}</span>
              <span className="block truncate text-sm font-medium">{user.email}</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => navigate('/dashboard')}>
              Dashboard
            </Dropdown.Item>
            {user.isAdmin && (
              <Dropdown.Item onClick={() => navigate('/admin')}>
                Admin Panel
              </Dropdown.Item>
            )}
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <div className="flex justify-center space-x-4">
            <Button
              gradientDuoTone="purpleToBlue"
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Join
            </Button>
            <Button outline size="lg" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        )}
      </div>
    </Navbar>
  );
};

export default Nav;