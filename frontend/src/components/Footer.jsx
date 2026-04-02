import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Shield, Code, User, Terminal, ExternalLink, Activity } from 'lucide-react';

const Footer = () => {
  const whatsappUrl = "https://wa.me/9187559903705?text=Reporting%20for%20Digital%20Operations%20Deployment.";

  return (
    <footer className="relative w-full py-20 bg-[#050505] border-t border-white/5 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,#ef233c11,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center border-b border-white/5 pb-16">
          
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-6 group cursor-crosshair">
               <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center p-2 group-hover:bg-primary transition-all">
                  <Shield className="w-full h-full text-primary group-hover:text-white" />
               </div>
               <span className="text-2xl font-black text-white tracking-widest uppercase italic group-hover:text-primary transition-colors">Daitya <span className="text-primary not-italic">Legion</span></span>
            </div>
            <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed max-w-xs text-center md:text-left">
              Strategic Cricket Operations Syndicate // Established 2024. All Tactical Logs Encrypted.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
             <div className="flex items-center gap-4 text-gray-800 mb-4 px-6 py-2 border border-white/2 rounded-full">
                <Activity className="w-3.5 h-3.5 animate-pulse text-green-700" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Network: Tactical Mesh Online</span>
             </div>
             <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-4">Master Architect</p>
             <h4 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 glow-text-primary">SAGAR PATHAK</h4>
             <a 
               href={whatsappUrl} 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-4 px-10 py-4 bg-primary/5 hover:bg-primary border border-primary/40 text-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.5em] group shadow-[0_0_30px_rgba(239,35,60,0.1)]"
             >
               <MessageCircle className="w-4 h-4" />
               Establish Neural Link
             </a>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-6">
             <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-px bg-white/10"></div>
                ))}
             </div>
             <div className="text-right flex flex-col items-center md:items-end">
                <div className="flex items-center gap-2 mb-2 text-gray-700">
                   <Terminal className="w-3.5 h-3.5" />
                   <span className="text-[9px] font-black uppercase tracking-[0.3em]">Operational Codebase V3.0</span>
                </div>
                <div className="flex items-center gap-2 text-gray-800">
                   <Code className="w-3.5 h-3.5" />
                   <span className="text-[9px] font-black uppercase tracking-[0.3em]">Compiled via Carbon Syndicate</span>
                </div>
             </div>
          </div>

        </div>

        <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8 opacity-20 hover:opacity-100 transition-opacity duration-1000">
           <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.8em]">© 2024 Daitya Legion Syndicate // All Rights Reserved</p>
           <div className="flex gap-10">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.8em] cursor-pointer hover:text-primary transition-colors">Privacy Protocol</span>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.8em] cursor-pointer hover:text-primary transition-colors">Terms of Engagement</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
