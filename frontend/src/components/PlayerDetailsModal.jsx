import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Target, Activity, ExternalLink, Award, ChevronRight, X, Monitor, Crosshair, Eye, Trophy } from 'lucide-react';

const MatchRow = ({ match, index }) => {
  const won = match.won;
  const p = match.performance;
  const showBatting = p?.batting?.runs > 0 || p?.batting?.how_out !== 'DNB';
  const showBowling = p?.bowling?.overs > 0;

  const formatHowOut = (howOut) => {
    if (!howOut) return '';
    if (howOut.toLowerCase().includes('not out')) return '*';
    return howOut;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className="flex items-center gap-4 p-4 bg-[#0a0b10] border border-white/5 hover:border-primary/40 transition-all group/row relative overflow-hidden"
    >
      <div className={`w-1 h-full absolute left-0 ${won ? 'bg-primary' : 'bg-gray-800'}`}></div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <p className="text-white font-black text-xs sm:text-sm uppercase italic tracking-tighter group-hover/row:text-primary transition-colors">vs {match.opponent}</p>
          <div className="h-px w-4 bg-white/10"></div>
          <span className="text-[8px] text-gray-700 font-black tracking-widest uppercase">{match.date}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          {showBatting && (
            <span className="text-[10px] text-white font-black italic bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-sm">
              {p.batting.runs}{formatHowOut(p.batting.how_out)} <span className="text-[8px] not-italic text-gray-600">({p.batting.balls})</span>
            </span>
          )}
          {showBowling && (
            <span className="text-[10px] text-green-500 font-black italic border border-green-900/30 px-2 py-0.5 rounded-sm">
              {p.bowling.wickets}/{p.bowling.runs} <span className="text-[8px] not-italic text-gray-800">({p.bowling.overs})</span>
            </span>
          )}
        </div>
      </div>

      <div className="text-right hidden sm:block">
        <p className="text-[10px] font-black text-white italic">{match.my_score}</p>
        <p className="text-gray-700 text-[8px] font-bold uppercase tracking-tight">vs {match.opp_score}</p>
      </div>

      <a
        href={match.cricheroes_url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-primary/10 hover:bg-primary transition-all flex items-center justify-center border border-primary/20 group/link"
      >
        <ExternalLink className="w-4 h-4 text-primary group-hover:text-white" />
      </a>
    </motion.div>
  );
};

const PlayerDetailsModal = ({ player, onClose }) => {
  const [activeTab, setActiveTab] = useState('matches');
  
  const winRate = useMemo(() => {
    if (!player.match_history?.length) return 0;
    const wins = player.match_history.filter(m => m.won).length;
    return Math.round((wins / player.match_history.length) * 100);
  }, [player.match_history]);

  const recentMatches = useMemo(() => {
    return (player.match_history || []).slice(0, 10);
  }, [player.match_history]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-12 bg-black/95 backdrop-blur-3xl overflow-y-auto cursor-default">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#ef233c11,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="relative w-full max-w-[1500px] h-full md:max-h-[1000px] bg-[#050505] border border-white/10 shadow-[0_0_100px_rgba(239,35,60,0.1)] flex flex-col lg:flex-row min-h-screen lg:min-h-0"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-primary/10 hover:bg-primary border border-primary/20 flex items-center justify-center transition-all z-50 text-primary hover:text-white">
          <X className="w-6 h-6" />
        </button>

        {/* Sidebar Dossier */}
        <div className="w-full lg:w-[450px] max-w-full border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0a0b10] p-6 lg:p-16 flex flex-col items-center flex-shrink-0 group">
          <div className="relative mb-12 w-full max-w-[320px]">
            <div className="absolute inset-0 bg-primary/20 blur-[60px] animate-pulse"></div>
            <div className="relative aspect-[3/4] border border-primary/30 rounded-sm overflow-hidden shadow-2xl grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000">
               <img src={player.image_url || 'https://via.placeholder.com/400'} alt={player.name} className="w-full h-full object-cover object-top hover:scale-105 transition-all" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            </div>
          </div>

          <div className="w-full text-center md:text-left">
            <div className="flex flex-col mb-4">
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em] mb-1">Player Profile</span>
               <h2 className="text-3xl sm:text-4xl lg:text-7xl font-black text-white glow-text-primary tracking-tighter uppercase italic leading-none">{player.name}</h2>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
               <span className="px-4 py-1.5 bg-primary/10 border border-primary/30 text-[9px] font-black uppercase text-primary tracking-widest">{player.role}</span>
               <span className="px-4 py-1.5 bg-white/2 border border-white/5 text-[9px] font-black uppercase text-gray-500 tracking-widest">ID: {player.external_id?.slice(-8)}</span>
            </div>
          </div>

          <div className="w-full mt-12 grid grid-cols-2 gap-4">
             <div className="p-5 bg-white/2 border border-white/5 rounded-sm">
                <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest block mb-2">Matches</span>
                <span className="text-3xl font-black text-white italic">{player.matches}</span>
             </div>
             <div className="p-5 bg-white/2 border border-white/5 rounded-sm">
                <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest block mb-2">Win Rate</span>
                <span className="text-3xl font-black text-primary italic">{winRate}%</span>
             </div>
             <div className="p-5 bg-white/2 border border-white/5 rounded-sm">
                <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest block mb-2">Man of the Match</span>
                <span className="text-3xl font-black text-gold italic">{player.man_of_the_match || 0}</span>
             </div>
             <div className="p-5 bg-white/2 border border-white/5 rounded-sm">
                <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest block mb-2">Wickets</span>
                <span className="text-3xl font-black text-green-800 italic">{player.wickets || 0}</span>
             </div>
          </div>
        </div>

        {/* Main Content Terminal */}
        <div className="flex-1 flex flex-col bg-black">
          <div className="px-4 pt-6 md:px-10 md:pt-10 flex gap-2 md:gap-6 overflow-x-auto whitespace-nowrap border-b border-white/5 w-full scrollbar-none border-b border-white/5">
            {['matches', 'stats', 'awards'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`flex items-center gap-3 px-4 py-3 md:px-8 md:py-5 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-white'}`}
              >
                {activeTab === tab && <motion.div layoutId="modal-tab-indicator" className="absolute inset-0 bg-primary/10 border-t-2 border-primary" />}
                {tab === 'matches' && <Activity className="w-4 h-4" />}
                {tab === 'stats' && <Monitor className="w-4 h-4" />}
                {tab === 'awards' && <Trophy className="w-4 h-4" />}
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 md:p-10 overflow-y-visible md:overflow-y-auto min-h-[500px] md:min-h-0 custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 'matches' && (
                <motion.div key="matches" className="space-y-6">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                     <h4 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-tighter">Match History — Last 10</h4>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Data: Synchronized</span>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {recentMatches.map((m, i) => <MatchRow key={i} match={m} index={i} />)}
                   </div>
                </motion.div>
              )}
              {activeTab === 'stats' && (
                <motion.div key="stats" className="space-y-12">
                   <div>
                     <h4 className="text-xl font-black text-primary italic uppercase tracking-widest mb-8 flex items-center gap-4">
                        <Zap className="w-5 h-5" /> Batting Stats
                     </h4>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
                        {[
                          { label: "High Score", val: `${player.batting?.high_score || 0}`, icon: Trophy },
                          { label: "Strike Rate", val: player.batting?.strike_rate, icon: Zap },
                          { label: "Batting Avg", val: player.batting?.average, icon: Target },
                        ].map((s, i) => (
                           <div key={i} className="p-4 sm:p-8 bg-[#0a0b10] border border-white/5 group hover:border-primary/40 transition-all">
                              <span className="text-[9px] font-black uppercase text-gray-700 tracking-widest block mb-2">{s.label}</span>
                              <span className="text-2xl sm:text-4xl font-black text-white italic uppercase">{s.val}</span>
                           </div>
                        ))}
                     </div>
                   </div>
                   <div>
                     <h4 className="text-xl font-black text-green-800 italic uppercase tracking-widest mb-8 flex items-center gap-4">
                        <Target className="w-5 h-5" /> Bowling Stats
                     </h4>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
                        {[
                          { label: "Best Bowling", val: player.bowling?.best_bowling, icon: Crosshair },
                          { label: "Wickets", val: player.wickets, icon: Target },
                          { label: "Economy", val: player.bowling?.economy, icon: Activity },
                        ].map((s, i) => (
                           <div key={i} className="p-4 sm:p-8 bg-[#0a0b10] border border-white/5 group hover:border-green-900/40 transition-all">
                              <span className="text-[9px] font-black uppercase text-gray-700 tracking-widest block mb-2">{s.label}</span>
                              <span className="text-2xl sm:text-4xl font-black text-white italic uppercase">{s.val}</span>
                           </div>
                        ))}
                     </div>
                   </div>
                </motion.div>
              )}
              {activeTab === 'awards' && (
                <motion.div key="awards" className="flex flex-col items-center justify-center h-full text-center">
                   <div className="w-32 h-32 rounded-full border border-primary/20 flex items-center justify-center mb-10 relative">
                      <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
                      <Trophy className="w-16 h-16 text-primary glow-text-primary" />
                   </div>
                   <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">{player.man_of_the_match}× Man of the Match</h3>
                   <p className="text-gray-700 font-bold uppercase tracking-[0.5em] text-xs">🏆 Outstanding Performance Awards</p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-12 mt-10 md:mt-20 w-full max-w-2xl px-4 md:px-10">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest mb-2">Catches</span>
                        <span className="text-3xl font-black text-white">{player.catches || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest mb-2">Run Outs</span>
                        <span className="text-3xl font-black text-white">{player.run_outs || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest mb-2">Tournaments</span>
                        <span className="text-3xl font-black text-white">{player.tournaments || 0}</span>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerDetailsModal;
