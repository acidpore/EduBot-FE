import React, { useState } from 'react';
import './loginPage.css';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../api/auth';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await loginUser({ email, password });
        onLoginSuccess();
        navigate('/chat');
      } else {
        // Sign up
        await registerUser({ name, email, password });
        // After successful registration, switch to login
        setIsLogin(true);
        setError('Berhasil mendaftar! Silakan login.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleGoogleLogin = () => {
    // Di sini Anda akan mengimplementasikan login dengan Google
    // Untuk contoh ini, kita hanya arahkan ke halaman chat
    onLoginSuccess();
    navigate('/chat');
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
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
        
        <h1>{isLogin ? 'Login ke EduBot' : 'Daftar EduBot'}</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Nama</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Daftar'}
          </button>
        </form>
        
        <div className="register-link">
          <p>
            {isLogin ? 'Belum memiliki akun?' : 'Sudah memiliki akun?'} 
            <a href="#" onClick={toggleAuthMode}>
              {isLogin ? 'Sign up' : 'Login'}
            </a>
          </p>
        </div>
        
        {isLogin && (
          <>
            <div className="divider">
              <span>ATAU</span>
            </div>
            
            <button className="google-login" onClick={handleGoogleLogin} disabled={loading}>
              <FcGoogle size={20} />
              <span>Login dengan Google</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;