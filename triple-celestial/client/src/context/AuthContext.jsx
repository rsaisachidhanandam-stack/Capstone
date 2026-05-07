import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('intelliplace_token'));
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUser = async () => {
    const storedToken = localStorage.getItem('intelliplace_token');
    
    if (!storedToken) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      const user = res.data.data;
      setCurrentUser(user);
      setRole(user.role);
      setIsAuthenticated(true);
      localStorage.setItem('intelliplace_user', JSON.stringify(user));
    } catch (error) {
      localStorage.removeItem('intelliplace_token');
      localStorage.removeItem('intelliplace_user');
      setToken(null);
      setCurrentUser(null);
      setRole(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: userToken, user } = res.data.data;
      
      localStorage.setItem('intelliplace_token', userToken);
      localStorage.setItem('intelliplace_user', JSON.stringify(user));
      
      setToken(userToken);
      setCurrentUser(user);
      setRole(user.role);
      setIsAuthenticated(true);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      localStorage.removeItem('intelliplace_token');
      localStorage.removeItem('intelliplace_user');
      setToken(null);
      setCurrentUser(null);
      setRole(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  const value = {
    currentUser,
    token,
    role,
    loading,
    isAuthenticated,
    login,
    logout,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
