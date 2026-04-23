/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Shield, Activity, Cpu, Zap } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

function TerminalReadout() {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const messages = [
      "INITIALIZING NEON_SNAKE_PROTOCOL...",
      "LOADING_ASSETS: SYNTH_DRIVERS... OK",
      "ESTABLISHING_NEURAL_LINK...",
      "SCANNING FOR INTRUSIONS...",
      "ENCRYPTION_KEY_ACCEPTED.",
      "SYSTEM_READY.",
      "AWAITING_INPUT_SIGNAL...",
      "WARNING: TEMP_BUFFER_OVERFLOW",
      "CORRECTING_STATE_ANOMALY...",
      "THROUGHPUT: 1.2 GB/S",
      "SYNC_ESTABLISHED."
    ];

    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-8), messages[i % messages.length]]);
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[10px] text-gray-400 p-4 border border-[#00f3ff]/10 rounded-xl bg-[#111111] h-48 overflow-y-auto flex flex-col gap-1 shrink-0">
      <div className="flex items-center gap-2 mb-2 text-[#00f3ff] border-b border-white/10 pb-2">
        <TerminalIcon size={12} />
        <span className="uppercase tracking-widest font-bold text-[10px]">System Log</span>
      </div>
      {logs.map((log, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-2"
        >
          <span className="text-[#ff00ff] shrink-0">[{new Date().toLocaleTimeString()}]</span>
          <span className="truncate">{log}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <div className="w-full h-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col p-6 relative">
      {/* Header Section from Design */}
      <header className="flex justify-between items-center mb-6 border-b border-[#00f3ff]/20 pb-4 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00f3ff] to-[#ff00ff] rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.5)]"></div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Syntropy <span className="text-[#00f3ff]">OS</span></h1>
        </div>
        <div className="flex gap-8">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">System Status</p>
            <p className="text-[#00f3ff] font-mono text-xs">OPERATIONAL // 01:24:09</p>
          </div>
          <div className="text-right border-l border-[#00f3ff]/20 pl-8">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Game Session</p>
            <p className="text-[#ff00ff] font-mono text-xs">ID: 4421-XB</p>
          </div>
        </div>
      </header>

      <div className="flex-grow flex flex-col lg:flex-row gap-6 overflow-hidden relative z-10">
        {/* Left Sidebar */}
        <aside className="lg:w-72 flex flex-col gap-4 overflow-y-auto shrink-0 pb-4">
          <MusicPlayer />
          <TerminalReadout />
          <div className="bg-gradient-to-t from-[#ff00ff]/10 to-transparent border border-[#ff00ff]/20 rounded-xl p-4 shrink-0">
            <p className="text-[10px] text-[#ff00ff] font-bold uppercase tracking-widest mb-1">Tip</p>
            <p className="text-[11px] leading-relaxed text-gray-400">The faster the beat, the faster the snake moves. Keep the rhythm to survive longer.</p>
          </div>
        </aside>

        {/* Main Center */}
        <main className="flex-grow flex min-w-0">
          <SnakeGame />
        </main>

        {/* Right Sidebar */}
        <aside className="lg:w-64 flex flex-col gap-4 overflow-y-auto shrink-0 pb-4">
          {/* Hardware Overrides */}
          <div className="bg-[#111111] border border-white/5 p-4 rounded-xl shrink-0">
             <h4 className="text-[10px] uppercase font-bold text-[#ff00ff] mb-3 tracking-[0.3em]">Hardware Overrides</h4>
             <div className="grid grid-cols-2 gap-2">
                {['SYNC', 'ENCRYPT', 'PURGE', 'BYPASS'].map(label => (
                    <button 
                        key={label}
                        className="p-2 border border-white/10 rounded-lg text-[10px] hover:bg-gradient-to-r hover:from-[#00f3ff] hover:to-[#ff00ff] hover:text-white transition-all font-bold text-gray-400 hover:border-transparent"
                    >
                        {label}
                    </button>
                ))}
             </div>
          </div>
          
          {/* Stats from original left side */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-4 shrink-0 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 text-[#00f3ff]/20">
                <Cpu size={24} />
             </div>
             <h4 className="text-[10px] uppercase tracking-widest text-[#00f3ff] mb-4 border-b border-white/10 pb-2 flex items-center gap-2 font-bold">
                <Shield size={12} className="text-[#ff00ff]" />
                Security Level Alpha
             </h4>
             <div className="space-y-4">
                {[
                  { label: "Core Sync", value: "98.2%", icon: Activity },
                  { label: "Neural Load", value: "42.0%", icon: Zap }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <stat.icon size={12} className="text-[#00f3ff]" />
                      <span className="text-[10px] uppercase font-bold text-gray-400">{stat.label}</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-white">{stat.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

