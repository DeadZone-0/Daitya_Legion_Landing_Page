import {
  animate,
  motion
} from "framer-motion";
import {
  Activity,
  Crosshair,
  ExternalLink,
  Monitor,
  Shield,
  Target,
  Trophy,
  Zap
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CaptainSection from "../components/CaptainSection.jsx";
import Footer from "../components/Footer.jsx";
import Hero from "../components/Hero.jsx";
import Navbar from "../components/Navbar.jsx";
import PlayerCard from "../components/PlayerCard.jsx";
import ViceCaptainSection from "../components/ViceCaptainSection.jsx";

const Counter = ({ value, title, icon: Icon, color }) => {
  const countRef = useRef(null);
  useEffect(() => {
    const node = countRef.current;
    if (!node) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = Math.round(value);
      },
    });
    return () => controls.stop();
  }, [value]);

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 glass-panel border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden bg-[#0a0b10]">
      <div
        className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-3xl opacity-5 bg-primary/20`}
      ></div>
      <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
      </div>
      <span
        ref={countRef}
        className="text-3xl md:text-5xl font-black text-white glow-text-primary tracking-tighter italic"
      >
        0
      </span>
      <div className="flex items-center gap-2 mt-4">
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
          {title}
        </span>
      </div>
    </div>
  );
};

const Home = () => {
  const [players, setPlayers] = useState([]);
  const [teamStats, setTeamStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "";
        const [playersRes, teamRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/players`),
          fetch(`${API_BASE_URL}/api/team`),
        ]);
        
        const playersRaw = await playersRes.json();
        const playersData = Array.isArray(playersRaw) ? playersRaw : [];
        const teamData = await teamRes.json();

        const topScorer = [...playersData].sort(
          (a, b) => (b.runs || 0) - (a.runs || 0),
        )[0];
        const topWicketer = [...playersData].sort(
          (a, b) => (b.wickets || 0) - (a.wickets || 0),
        )[0];

        setPlayers(playersData);
        setTeamStats({ ...teamData, topScorer, topWicketer });
      } catch (error) {
        console.error("Backend connection failure:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative pb-0 overflow-hidden bg-[#050505] selection:bg-primary selection:text-white">
      <Navbar />

      {/* Cinematic Background Layering */}
      <div className="fixed inset-0 -z-50">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#ef233c,transparent_60%)] opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_120%,#ff0000,transparent_50%)] opacity-10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <Hero />

      {/* Mission Status Header */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 mb-12 md:mb-20 relative z-10">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-1.5 h-12 bg-primary/80"></div>
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none mb-1">
              Mission <span className="text-primary not-italic">Briefing</span>
            </h2>
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.5em]">
              Active Strategic Deployment Area
            </span>
          </div>
        </div>

        {/* Live Link Tactical Bridge */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <a
            href="https://cricheroes.com/team-profile/11183415/daitya-legion"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="glass-panel p-6 md:p-8 border-red-500/20 bg-[#0a0b10] flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 relative overflow-hidden text-center lg:text-left group-hover:border-primary/60">
              <div className="absolute top-0 right-0 p-4">
                <Monitor className="w-4 h-4 text-gray-800" />
              </div>

              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-10"></div>
                  <div className="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center bg-black relative z-10">
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-sm">
                      Hot Connection
                    </span>
                    <span className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">
                      Encryption Level: Delta
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase">
                    NEURAL BATTLE{" "}
                    <span className="text-primary not-italic tracking-[0.1em]">
                      FEED
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-6 px-10 py-5 bg-primary text-white font-black uppercase text-xs tracking-[0.3em] hover:bg-black hover:text-primary border border-primary transition-all shadow-[0_0_40px_rgba(239,35,60,0.3)]">
                Initialize Stream
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </a>
        </motion.div>

        {/* Command Center Stats Hub */}
        {teamStats && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-40 relative"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-5">
                <div className="w-1 w-1 bg-primary"></div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase group hover:text-primary transition-colors cursor-default">
                  Tactical Matrix
                </h3>
              </div>
              {teamStats.best_win && (
                <div className="hidden lg:flex items-center gap-5 glass-panel px-6 py-3 border-primary/20 bg-primary/5">
                  <Trophy className="w-5 h-5 text-primary" />
                  <div>
                    <span className="text-[7px] font-black uppercase text-gray-600 tracking-widest block mb-1">
                      Peak Performance Log
                    </span>
                    <span className="text-sm font-black text-white tracking-tighter italic uppercase italic">
                      "{teamStats.best_win}"
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
              <Counter
                value={teamStats.total_matches}
                title="Battle Logs"
                icon={Activity}
              />
              <Counter
                value={teamStats.total_runs}
                title="Neural Runs"
                icon={Zap}
              />
              <Counter
                value={teamStats.total_wickets}
                title="Executions"
                icon={Target}
              />
              <Counter
                value={teamStats.win_percentage?.replace("%", "") || 50}
                title="K/D Ratio %"
                icon={Shield}
              />
              <Counter
                value={teamStats.total_tournaments || 5}
                title="Tourney Ops"
                icon={Monitor}
              />
              <Counter value={42} title="Assets Locked" icon={Crosshair} />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="glass-panel p-6 md:p-10 flex flex-col md:flex-row items-center gap-4 md:gap-8 bg-[#0a0b10] text-center md:text-left border-white/5 group hover:border-primary/40">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-sm bg-primary/5 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform duration-500 shrink-0">
                  <Zap className="text-primary w-10 h-10 glow-text-primary" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mb-2">
                    Prime Asset: Offense
                  </h4>
                  <p className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors block">
                    {teamStats.topScorer?.name || "---"}
                  </p>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mt-2">
                    {teamStats.topScorer?.runs || 0} Confirmed Neural Damage
                  </span>
                </div>
              </div>
              <div className="glass-panel p-6 md:p-10 flex flex-col md:flex-row items-center gap-4 md:gap-8 bg-[#0a0b10] text-center md:text-left border-white/5 group hover:border-red-900/40">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-sm bg-red-950/20 flex items-center justify-center border border-red-900/40 group-hover:scale-105 transition-transform duration-500 shrink-0">
                  <Target className="text-red-700 w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mb-2">
                    Prime Asset: Suppression
                  </h4>
                  <p className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter group-hover:text-red-700 transition-colors block">
                    {teamStats.topWicketer?.name || "---"}
                  </p>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mt-2">
                    {teamStats.topWicketer?.wickets || 0} Confirmed Termination
                    Units
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Personnel Files Grid */}
        <div className="flex flex-col items-center mb-12 md:mb-24 text-center px-4">
          <div className="h-px w-32 bg-primary/20 mb-8"></div>
          <h2 className="text-5xl md:text-8xl lg:text-[12rem] font-black mb-6 text-white glow-text-primary tracking-tighter leading-none italic uppercase">
            PERSONNEL{" "}
            <span className="text-primary not-italic tracking-[0.2em]">
              GRID
            </span>
          </h2>
          <p className="text-gray-700 font-bold uppercase tracking-[0.5em] text-xs">
            Battle Ready Operational Personnel Files
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-20 h-20 border-4 border-primary/5 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-10 text-gray-800 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
              Establishing Scrambled Neural Link...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 justify-items-center mb-40">
            {players.map((player) => (
              <PlayerCard key={player._id || player.name} player={player} />
            ))}
          </div>
        )}
      </div>

      {!loading && (
        <>
          <CaptainSection
            captain={players.find((p) => p.name?.toLowerCase().includes("bruce")) || players[0]}
          />
          <ViceCaptainSection
            vc={players.find((p) => p.name?.toLowerCase().includes("ashraya")) || players[1] || players[0]}
          />
        </>
      )}

      <Footer />
    </div>
  );
};

export default Home;
