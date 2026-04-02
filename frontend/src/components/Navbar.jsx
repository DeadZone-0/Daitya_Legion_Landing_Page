import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Home, Shield, Crosshair, Zap } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Base', path: '/', icon: Home },
    { name: 'Rankings', path: '/rankings', icon: Trophy },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between glass-panel px-8 py-3 bg-black/80 border-white/5 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-all">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-widest leading-none">DAITYA <span className="text-primary italic">LEGION</span></span>
            <span className="text-[7px] font-bold text-gray-600 uppercase tracking-[0.5em] mt-1">Operational Command</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 mr-6 text-gray-700">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[8px] font-black uppercase tracking-widest">Neural Link: Online</span>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`relative flex items-center gap-3 px-6 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] transition-all group overflow-hidden ${location.pathname === item.path ? 'text-white' : 'text-gray-500 hover:text-white'}`}
              >
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-primary/10 border-b-2 border-primary" 
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={`w-3.5 h-3.5 relative z-10 transition-colors ${location.pathname === item.path ? 'text-primary' : 'group-hover:text-primary'}`} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
