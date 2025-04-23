import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get('token') || '');
  const [loading, setLoading] = useState(true); // Add loading state

  const login = (newToken) => {
    Cookies.set('token', newToken, { expires: 7 });
    setToken(newToken);
  };

  const logout = () => {
    Cookies.remove('token');
    setToken('');
    setUser(null);
    setLoading(false); // Ensure loading is false after logout
  };

  useEffect(() => {
    if (token) {
      setLoading(true); // Start loading
      axiosInstance
        .get('/get-user')
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          logout();
        })
        .finally(() => {
          setLoading(false); // End loading
        });
    } else {
      setLoading(false); // No token, not loading
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };