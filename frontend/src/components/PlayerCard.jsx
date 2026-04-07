import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Zap, Target, Shield, Crosshair, Monitor, Activity } from 'lucide-react';
import PlayerDetailsModal from './PlayerDetailsModal.jsx';

// ─── Mobile-only Polaroid Flash ───────────────────────────────────────────────
const PolaroidFlash = ({ player, onDone }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center pointer-events-none md:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />
      <motion.div
        className="relative flex flex-col items-center justify-center"
        initial={{ y: 80, opacity: 0, rotate: -3 }}
        animate={{ y: 0, opacity: 1, rotate: [-3, 3, -2, 1, 0] }}
        transition={{ delay: 0.2, duration: 0.55, ease: 'easeOut' }}
        onAnimationComplete={onDone}
      >
        <div
          className="bg-white shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col items-center"
          style={{ width: 220, padding: '12px 12px 40px 12px' }}
        >
          <div className="w-full overflow-hidden" style={{ height: 200 }}>
            <img
              src={player.image_url || 'https://via.placeholder.com/200'}
              alt={player.name}
              className="w-full h-full object-cover object-top"
              style={{ filter: 'grayscale(100%) contrast(1.2) brightness(0.85)' }}
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="mt-3 text-black font-black uppercase tracking-widest text-xs text-center" style={{ fontFamily: 'monospace' }}>
            {player.name}
          </span>
          <span className="text-gray-500 uppercase tracking-widest text-[8px] mt-1" style={{ fontFamily: 'monospace' }}>
            DAITYA LEGION
          </span>
        </div>
        <motion.div className="mt-4" initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={{ delay: 0.25, duration: 0.4 }}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="white" opacity="0.7">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="12" r="5" fill="white"/>
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const PlayerCard = ({ player }) => {
  const [showModal, setShowModal] = useState(false);
  const [showPolaroid, setShowPolaroid] = useState(false);

  const winRate = useMemo(() => {
    if (!player.match_history?.length) return 0;
    const wins = player.match_history.filter(m => m.won).length;
    return Math.round((wins / player.match_history.length) * 100);
  }, [player.match_history]);

  const handleInsightClick = () => {
    if (window.innerWidth < 768) {
      setShowPolaroid(true);
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showPolaroid && (
          <PolaroidFlash player={player} onDone={() => { setShowPolaroid(false); setShowModal(true); }} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="relative w-full max-w-[300px] sm:max-w-[340px] flex flex-col glass-panel bg-[#0a0b10] border-white/5 shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden group hover:border-primary/40 transition-all duration-300"
      >
        <div className="w-full flex justify-between items-start p-5 absolute top-0 left-0 z-20 pointer-events-none">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-primary tracking-widest leading-none drop-shadow-md">Team</span>
            <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest drop-shadow-md">Player Profile</span>
          </div>
          <Shield className="w-4 h-4 text-white/50" />
        </div>

        {/* Image Section */}
        <div className="relative w-full h-64 overflow-hidden bg-black/50">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-transparent to-transparent z-10"></div>
          <img 
            src={player.image_url || 'https://via.placeholder.com/300'} 
            alt={player.name} 
            className="w-full h-full object-cover object-top md:grayscale md:contrast-125 md:brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 group-hover:scale-105" 
            referrerPolicy="no-referrer" 
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
          
          {/* Title Badges */}
          {player.titles && player.titles.length > 0 && (
            <div className="absolute top-4 right-4 z-40 flex flex-col gap-2 items-end">
              {player.titles.slice(0, 2).map((t, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="px-3 py-1.5 rounded-sm relative overflow-hidden shadow-[0_0_20px_rgba(201,153,31,0.4)] border border-[#c9991f]/40"
                  style={{background: 'linear-gradient(135deg, #1a1a1a 0%, #3a2e0a 100%)'}}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)] translate-x-[-100%] animate-[shimmer_3s_infinite]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c9991f] drop-shadow-sm flex items-center gap-1.5 leading-none">
                    <Trophy className="w-2.5 h-2.5" />
                    {t}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="p-4 sm:p-6 flex flex-col flex-1 relative z-10 -mt-10">
          <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white glow-text-primary tracking-tighter uppercase italic leading-none truncate mb-2 drop-shadow-lg">{player.name}</h2>
            <div className="flex justify-center mt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 border border-primary/30 rounded-sm">
                <Crosshair className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">{player.role}</span>
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-4 mb-6">
            <div className="flex flex-col bg-white/5 p-3 rounded-sm border border-white/5 hover:border-primary/20 transition-colors">
              <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Batting Avg</span>
              <span className="text-xl font-black text-white italic tracking-tighter flex items-center gap-1 mt-1"><Zap className="w-3 h-3 text-primary"/> {player.batting?.average || '0.00'}</span>
            </div>
            <div className="flex flex-col bg-white/5 p-3 rounded-sm border border-white/5 hover:border-primary/20 transition-colors">
              <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">S. Rate</span>
              <span className="text-xl font-black text-white italic tracking-tighter leading-none mt-1">{player.batting?.strike_rate || '0.00' }</span>
            </div>
            <div className="flex flex-col bg-white/5 p-3 rounded-sm border border-white/5 hover:border-red-900/20 transition-colors">
              <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Wickets</span>
              <span className="text-xl font-black text-red-500 italic tracking-tighter flex items-center gap-1 mt-1"><Target className="w-3 h-3 text-red-700"/> {player.wickets || 0}</span>
            </div>
            <div className="flex flex-col bg-white/5 p-3 rounded-sm border border-white/5 hover:border-red-900/20 transition-colors">
              <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Economy</span>
              <span className="text-xl font-black text-red-500 italic tracking-tighter leading-none mt-1">{player.bowling?.economy || '0.00'}</span>
            </div>
            <div className="flex col-span-2 justify-between items-center bg-white/5 p-3 rounded-sm border border-white/5 mt-[-6px]">
              <span className="text-[8px] sm:text-[9px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-1"><Crosshair className="w-3 h-3 text-gray-500" /> Fielding</span>
              <span className="text-base sm:text-lg font-black text-gray-300 italic tracking-tighter leading-none">{player.catches || 0} C <span className="text-[12px] not-italic text-gray-600">/</span> {player.run_outs || 0} RO</span>
            </div>
            <div className="flex col-span-2 justify-between items-center bg-primary/5 p-3 rounded-sm border border-primary/10 mt-[-6px]">
              <span className="text-[8px] sm:text-[9px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1"><Activity className="w-3 h-3 text-primary" /> Win Ratio</span>
              <span className="text-base sm:text-lg font-black text-primary italic tracking-tighter leading-none">{winRate}% <span className="text-[8px] not-italic text-gray-600">({player.matches || 0} Matches)</span></span>
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={handleInsightClick}
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
          <PlayerDetailsModal player={player} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default PlayerCard;
