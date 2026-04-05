import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TimelessMusic from '../assets/Timeless (Instrumental).mp3';

const AudioConsole = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    return parseInt(localStorage.getItem('daitya_volume') || '50');
  });
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Trim configuration
  const START_SKIP = 5;
  const END_SKIP = 5;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      
      // Initial Play attempt after EntryGate interaction
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          // Set start time to 5s if at beginning
          if (audioRef.current.currentTime < START_SKIP) {
            audioRef.current.currentTime = START_SKIP;
          }
        }).catch(error => {
          console.warn("Autoplay was slightly delayed or blocked by browser protocols.");
        });
      }
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    const duration = audioRef.current.duration;
    // Check if we hit the end skip point
    if (duration > 0 && audioRef.current.currentTime >= (duration - END_SKIP)) {
       audioRef.current.currentTime = START_SKIP;
       audioRef.current.play();
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Audio error:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseInt(e.target.value);
    setVolume(newVol);
    localStorage.setItem('daitya_volume', newVol.toString());
    if (audioRef.current) {
      audioRef.current.volume = newVol / 100;
    }
    if (newVol > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md border border-white/5 px-4 py-2 rounded-sm group relative">
      <audio 
        ref={audioRef} 
        src={TimelessMusic} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
            audioRef.current.currentTime = START_SKIP;
            audioRef.current.play();
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="flex flex-col items-center justify-center mr-2">
         <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-1">COMMS</span>
         <Music className={`w-3 h-3 ${isPlaying ? 'text-primary animate-pulse' : 'text-gray-700'}`} />
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-primary/20 border border-white/10 transition-all rounded-sm shadow-[0_0_15px_rgba(136,8,8,0.1)] hover:shadow-[0_0_20px_rgba(136,8,8,0.3)]"
        >
          {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-primary fill-primary" />}
        </button>

        <div className="flex items-center gap-3">
          <button onClick={toggleMute} className="text-gray-500 hover:text-white transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-primary" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <div className="relative w-24 flex items-center group/slider">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={handleVolumeChange}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded opacity-0 group-hover/slider:opacity-100 transition-opacity whitespace-nowrap">
              GAIN: {volume}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_10px_rgba(136,8,8,0.5)]"></div>
    </div>
  );
};

export default AudioConsole;
