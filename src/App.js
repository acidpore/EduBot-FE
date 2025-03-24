import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/loginPage';
import ChatPage from './components/ChatPage/chatPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email, password) => {
    // Di sini seharusnya ada logika autentikasi yang sebenarnya
    // Untuk contoh ini, kita hanya simulasikan login berhasil
    console.log('Login dengan:', email, password);
    setIsAuthenticated(true);
    return true;
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/chat" /> : 
              <LoginPage onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/chat" 
          element={
            isAuthenticated ? 
              <ChatPage /> : 
              <Navigate to="/login" />
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;