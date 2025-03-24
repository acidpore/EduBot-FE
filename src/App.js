import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/loginPage';
import ChatPage from './components/ChatPage/chatPage';
import { isAuthenticated, logoutUser } from './api/auth';

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on mount
    setIsAuth(isAuthenticated());
  }, []);

  const handleLogin = () => {
    // Successful login will be handled in the LoginPage component
    // Just update the auth state here
    setIsAuth(true);
    return true;
  };

  const handleLogout = () => {
    // Call the logout API function
    logoutUser();
    setIsAuth(false);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuth ? 
              <Navigate to="/chat" /> : 
              <LoginPage onLoginSuccess={handleLogin} />
          } 
        />
        <Route 
          path="/chat" 
          element={
            isAuth ? 
              <ChatPage onLogout={handleLogout} /> : 
              <Navigate to="/login" />
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;