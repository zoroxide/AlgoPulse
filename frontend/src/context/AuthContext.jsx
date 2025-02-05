import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      axiosInstance
        .get('/get-user')
        .then((response) => {
          setUser(response.data);
          console.log('User data:', response.data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          logout();
        });
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };