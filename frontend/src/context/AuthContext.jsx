import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get('token') || '');

  const login = (newToken) => {
    Cookies.set('token', newToken, { expires: 7 });
    setToken(newToken);
  };

  const logout = () => {
    Cookies.remove('token');
    setToken('');
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      axiosInstance
        .get('/get-user')
        .then((response) => {
          setUser(response.data);
          // console.log('User data:', response.data);
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