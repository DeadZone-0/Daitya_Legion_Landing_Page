import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BatarangEffect = ({ children }) => {
  const [batarangs, setBatarangs] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      const id = Date.now();
      const newBatarang = {
        id,
        x: e.clientX,
        y: e.clientY,
        angle: Math.random() * 360,
      };
      setBatarangs((prev) => [...prev, newBatarang]);
      
      // Cleanup
      setTimeout(() => {
        setBatarangs((prev) => prev.filter((b) => b.id !== id));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {children}
      <AnimatePresence>
        {batarangs.map((bat) => (
          <motion.div
            key={bat.id}
            initial={{ 
              opacity: 1, 
              scale: 0.2, 
              x: bat.x - 40, 
              y: bat.y - 40, 
              rotate: 0 
            }}
            animate={{ 
              opacity: 0, 
              scale: 2, 
              x: bat.x + (Math.random() - 0.5) * 800, 
              y: bat.y + (Math.random() - 0.5) * 800,
              rotate: 1080 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed pointer-events-none z-[9999]"
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="rgba(239, 35, 60, 0.8)"
              className="drop-shadow-[0_0_15px_rgba(239,35,60,0.6)]"
            >
              <path d="M12 2C6.47 2 2 4.47 2 7.5c0 1.25.75 2.39 2 3.3.36 1.48 1.45 2.72 3 3.44.1.34.25.68.44 1.01.21.36.46.71.74 1.05.3.38.64.73 1 1.05.41.36.85.71 1.32 1.01.5.31 1 .59 1.5.84.5.25 1 .47 1.5.64 1.5.54 3 1.01 4.5 1.41C21.25 21 22 21 22 21s-.75-.25-1.5-.75-1.5-.54-2.25-1.01c-.5-.31-1-.59-1.5-.84s-1-.47-1.5-.64c-.5-.17-1-.34-1.5-.5s-1-.34-1.5-.5c-.44-.14-.88-.25-1.32-.36-.44-.1-.88-.17-1.32-.21-.36-.04-.71-.05-1.07-.05H8.38c-.35 0-.71.01-1.07.05-.44.04-.88.11-1.32.21-.44.11-.88.22-1.32.36-.5.16-1 .34-1.5.5s-1 .33-1.5.5c-.5.17-1 .33-1.5.47-.75.21-1.5.36-2.25.47C1.75 20.75 1 20.75 1 20.75s1 0 2-.25c1.5-.4 3-.87 4.5-1.41.5-.17 1-.39 1.5-.64s1-.53 1.5-.84c.47-.31.91-.65 1.32-1.01.36-.32.7-.67 1-1.05.28-.34.53-.69.74-1.05.19-.33.34-.67.44-1.01 1.55-.72 2.64-1.96 3-3.44 1.25-.91 2-2.05 2-3.3C22 4.47 17.53 2 12 2z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BatarangEffect;
