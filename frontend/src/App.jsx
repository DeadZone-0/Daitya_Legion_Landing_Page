import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Rankings from './pages/Rankings.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import BatarangEffect from './components/BatarangEffect.jsx';
import EntryGate from './components/EntryGate.jsx';
import { Analytics } from '@vercel/analytics/react';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = '/admin/login';
    return null;
  }
  return children;
};

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  if (!isAuthorized) {
    return <EntryGate onEnter={() => setIsAuthorized(true)} />;
  }

  return (
    <Router>
      <BatarangEffect>
        <div className="app-container bg-[#050505] min-h-screen selection:bg-primary selection:text-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </BatarangEffect>
      <Analytics />
    </Router>
  );
}

export default App;
