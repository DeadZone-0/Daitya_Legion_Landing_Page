import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error, please check backend');
      // For demo without backend, add a simple bypass using 'admin' / 'admin'
      if (email === 'admin' && password === 'admin') {
         localStorage.setItem('adminToken', 'mock-token');
         navigate('/admin');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1rem' }}>
      <motion.div 
        className="glass-panel" 
        style={{ width: '400px', padding: '2rem' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--accent)' }}>Admin Login</h2>
        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Email (or 'admin' for mock login)" 
            className="input-field" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn" style={{ width: '100%' }}>Login</button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
