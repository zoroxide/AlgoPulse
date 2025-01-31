import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/user/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
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
