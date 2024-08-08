import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Here you can implement token validation and set the user state accordingly
      setUser({ token });
    }
  }, []);

  const register = (token) => {
    setUser({ token });
  };

  const login = (token) => {
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const loginOrNot = () => {
    return user;
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, loginOrNot }}
    >
      {children}
    </AuthContext.Provider>
  );
};
