import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Zap, Target, Shield, Crosshair, Monitor, Activity } from 'lucide-react';
import PlayerDetailsModal from './PlayerDetailsModal.jsx';

const PlayerCard = ({ player }) => {
  const [showModal, setShowModal] = useState(false);

  const winRate = useMemo(() => {
    if (!player.match_history?.length) return 0;
    const wins = player.match_history.filter(m => m.won).length;
    return Math.round((wins / player.match_history.length) * 100);
  }, [player.match_history]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="relative w-full max-w-[340px] flex flex-col glass-panel bg-[#0a0b10] border-white/5 shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden group hover:border-primary/40 transition-all duration-300"
      >
        <div className="w-full flex justify-between items-start p-5 absolute top-0 left-0 z-20 pointer-events-none">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-primary tracking-widest leading-none drop-shadow-md">Syndicate</span>
            <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest drop-shadow-md">Asset // Locked</span>
          </div>
          <Shield className="w-4 h-4 text-white/50" />
        </div>

        {/* Player Image Area */}
        <div className="relative w-full h-64 overflow-hidden bg-black/50">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-transparent to-transparent z-10"></div>
          <img 
            src={player.image_url || 'https://via.placeholder.com/300'} 
            alt={player.name} 
            className="w-full h-full object-cover object-top grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 group-hover:scale-105" 
            referrerPolicy="no-referrer" 
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
        </div>

        {/* Card Content */}
        <div className="p-6 flex flex-col flex-1 relative z-10 -mt-10">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-black text-white glow-text-primary tracking-tighter uppercase italic leading-none truncate mb-2 drop-shadow-lg">{player.name}</h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 border border-primary/30 rounded-sm">
              <Crosshair className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black uppercase text-primary tracking-widest">{player.role}</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-4 mb-6">
             <div className="flex flex-col bg-white/5 p-3 rounded-sm border border-white/5 hover:border-primary/20 transition-colors">
               <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Batting Avg</span>
               <span className="text-xl font-black text-white italic tracking-tighter flex items-center gap-1 mt-1"><Zap className="w-3 h-3 text-primary"/> {player.batting?.average || '0.00'}</span>
             </div>
             <div className="flex flex-col bg-white/5 p-3 rounded-sm border border-white/5 hover:border-primary/20 transition-colors">
               <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">S. Rate</span>
               <span className="text-xl font-black text-white italic tracking-tighter leading-none mt-1">{player.batting?.strike_rate || '0.00'}</span>
             </div>
             <div className="flex flex-col bg-white/5 p-3 rounded-sm border border-white/5 hover:border-red-900/20 transition-colors">
               <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Executions</span>
               <span className="text-xl font-black text-red-500 italic tracking-tighter flex items-center gap-1 mt-1"><Target className="w-3 h-3 text-red-700"/> {player.wickets || 0}</span>
             </div>
             <div className="flex flex-col bg-white/5 p-3 rounded-sm border border-white/5 hover:border-red-900/20 transition-colors">
               <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Economy</span>
               <span className="text-xl font-black text-red-500 italic tracking-tighter leading-none mt-1">{player.bowling?.economy || '0.00'}</span>
             </div>
             <div className="flex col-span-2 justify-between items-center bg-primary/5 p-3 rounded-sm border border-primary/10">
               <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1"><Activity className="w-3 h-3 text-primary" /> Win Ratio</span>
               <span className="text-lg font-black text-primary italic tracking-tighter leading-none">{winRate}% <span className="text-[9px] not-italic text-gray-600">({player.matches || 0} Matches)</span></span>
             </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={() => setShowModal(true)}
              className="w-full py-4 bg-white/5 text-gray-300 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary hover:text-white border border-white/10 hover:border-primary/50 transition-all flex items-center justify-center gap-2 rounded-sm"
            >
              Insight
              <span className="group-hover:translate-x-1 transition-transform tracking-normal text-lg leading-none">→</span>
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <PlayerDetailsModal 
            player={player} 
            onClose={() => setShowModal(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PlayerCard;
