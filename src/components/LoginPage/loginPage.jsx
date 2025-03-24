import React, { useState } from 'react';
import './loginPage.css';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Panggil fungsi onLogin yang diberikan dari App.js
    const loginSuccess = onLogin(email, password);
    
    if (loginSuccess) {
      navigate('/chat');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleGoogleLogin = () => {
    // Di sini Anda akan mengimplementasikan login dengan Google
    // Untuk contoh ini, kita hanya arahkan ke halaman chat
    onLogin('google-user@example.com', '');
    navigate('/chat');
  };

  return (
    <div className={`login-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="mode-toggle">
        <button onClick={toggleDarkMode}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      
      <div className="login-card">
        <div className="logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 2H5C3.89543 2 3 2.89543 3 4V18C3 19.1046 3.89543 20 5 20H9L12 23L15 20H19C20.1046 20 21 19.1046 21 18V4C21 2.89543 20.1046 2 19 2Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h1>Selamat datang di EduBot</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        
        <div className="register-link">
          <p>Belum memiliki akun? <a href="/signup">Sign up</a></p>
        </div>
        
        <div className="divider">
          <span>ATAU</span>
        </div>
        
        <button className="google-login" onClick={handleGoogleLogin}>
          <FcGoogle size={20} />
          <span>Login dengan Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;