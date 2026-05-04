import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(null);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const doctorLogin = (profile) => setDoctorProfile(profile);
  const doctorLogout = () => setDoctorProfile(null);

  const isDoctorAuthenticated = doctorProfile !== null;

  return (
    <AuthContext.Provider value={{
      isAuthenticated, login, logout,
      doctorProfile, doctorLogin, doctorLogout, isDoctorAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
