import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Shield, Terminal, Activity, Zap } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsInitializing(true);
    setError('');

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
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setError(data.message || 'Access Denied: Neural Signature Mismatch');
        setIsInitializing(false);
      }
    } catch (err) {
      // Mock bypass for development if backend fails
      if (email === 'admin' && password === 'admin') {
         localStorage.setItem('adminToken', 'mock-token');
         setTimeout(() => navigate('/admin'), 1500);
      } else {
        setError('Encryption Error: System Offline');
        setIsInitializing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden selection:bg-primary selection:text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#88080811,transparent_70%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] z-10"
      >
        <div className="glass-panel p-8 md:p-12 border-white/5 bg-black/40 backdrop-blur-2xl relative overflow-hidden group">
          {/* Tactical Decorative Elements */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40 group-hover:border-primary transition-colors"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/40 group-hover:border-primary transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/40 group-hover:border-primary transition-colors"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/40 group-hover:border-primary transition-colors"></div>

          <div className="text-center mb-10">
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block p-4 rounded-full border border-primary/20 mb-6 bg-primary/5"
            >
              <Shield className="w-10 h-10 text-primary glow-text-primary" />
            </motion.div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
              Neural <span className="text-primary not-italic">Gateway</span>
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">Authorization Required</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isInitializing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-10"
              >
                <div className="flex gap-1 mb-4">
                  {[0, 1, 2].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: [10, 30, 10] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1 bg-primary"
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em] animate-pulse italic">Initializing Neural Link...</span>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleLogin} 
                className="space-y-6"
              >
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-primary/10 border border-primary/40 rounded-sm flex items-center gap-3"
                  >
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{error}</span>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-[8px] font-black text-gray-600 uppercase tracking-[0.5em] ml-1">Terminal ID</label>
                  <div className="relative">
                    <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                    <input 
                      type="text" 
                      placeholder="Neural Address" 
                      className="w-full bg-black/50 border border-white/5 py-4 pl-12 pr-4 text-white text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-800" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] font-black text-gray-600 uppercase tracking-[0.5em] ml-1">Encryption Key</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                    <input 
                      type="password" 
                      placeholder="Master Key" 
                      className="w-full bg-black/50 border border-white/5 py-4 pl-12 pr-4 text-white text-xs font-black uppercase tracking-[0.3em] focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-800" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-5 bg-primary/10 hover:bg-primary border border-primary/40 text-primary hover:text-white transition-all text-xs font-black uppercase tracking-[0.6em] group relative overflow-hidden shadow-[0_0_30px_rgba(136,8,8,0.1)] hover:shadow-[0_0_50px_rgba(136,8,8,0.3)]"
                >
                  <div className="flex items-center justify-center gap-4 relative z-10">
                    Access Core Matrix
                    <Zap className="w-4 h-4 group-hover:scale-125 transition-transform" />
                  </div>
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <span className="text-[8px] font-black text-gray-800 uppercase tracking-[0.4em] leading-relaxed">
              Proprietary Tactical Interface // Master Architect: SAGAR PATHAK
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
