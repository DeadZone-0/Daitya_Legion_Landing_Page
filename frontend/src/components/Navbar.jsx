import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Home, Shield } from 'lucide-react';
import AudioConsole from './AudioConsole.jsx';
import TeamLogo from '../assets/Daitya_Legion_LOGO.png';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Base', path: '/', icon: Home },
    { name: 'Rankings', path: '/rankings', icon: Trophy },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 selection:bg-primary selection:text-white">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between glass-panel px-8 py-3 bg-black/80 border-white/5 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
            <img 
              src={TeamLogo} 
              alt="Daitya Legion Official Logo" 
              className="h-full w-auto object-contain drop-shadow-[0_0_15px_rgba(136,8,8,0.5)]" 
              onError={(e) => { e.target.src = 'https://cricheroes.com/assets/images/team-profile-placeholder.png'; }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-white tracking-widest leading-none drop-shadow-sm select-none uppercase">
              DAITYA <span className="text-primary italic">LEGION</span>
            </span>
            <span className="text-[7px] sm:text-[8px] font-bold text-gray-500 uppercase tracking-[0.5em] mt-1 opacity-80 select-none">
              Operational Command
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4 lg:gap-8">
          <div className="hidden lg:flex flex-col items-end mr-6 text-gray-700">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[8px] font-black uppercase tracking-widest">Neural Link: Online</span>
             </div>
             <span className="text-[6px] font-bold text-primary/40 uppercase tracking-[0.4em] mt-1">Architect: Sagar Pathak</span>
          </div>

          <div className="hidden sm:block mr-2">
            <AudioConsole />
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
