import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: 'PROTOCOL_X.exe',
    artist: 'QUANTUM_SYNTH',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: '#00ffff'
  },
  {
    id: 2,
    title: 'MAGENTA_DRIFT.sys',
    artist: 'NEON_VOYAGER',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: '#ff00ff'
  },
  {
    id: 3,
    title: 'CYAN_CORE.log',
    artist: 'CYBER_ROOT',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: '#ffff00'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  return (
    <div className="bg-[#111111] border border-[#00f3ff]/10 rounded-xl p-4 flex flex-col gap-4 w-full h-full">
      <h2 className="text-[10px] text-[#00f3ff] uppercase tracking-[0.2em] font-bold">Music Library</h2>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      {/* Current Track Player Area styling */}
      <div className="bg-[#1a1a1a] p-3 rounded-lg border border-l-4 border-white/5 border-l-[#00f3ff] flex items-center gap-3">
        <div className="w-10 h-10 bg-[#080808] rounded flex items-center justify-center shrink-0 border border-white/10">
           {isPlaying ? <div className="w-4 h-1 bg-[#00f3ff] rounded-full animate-pulse shadow-[0_0_8px_#00f3ff]" /> : <Music size={16} className="text-gray-500" />}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-bold text-white truncate px-1">{currentTrack.title}</p>
          <p className="text-[10px] text-gray-500 truncate px-1">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="relative h-1 mb-2 w-full bg-gray-800 rounded-full overflow-hidden shrink-0 mt-2">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00f3ff] to-[#ff00ff]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-6 py-2 border-t border-white/5 shrink-0">
        <button onClick={prevTrack} className="text-gray-500 hover:text-white transition-colors">
          <SkipBack size={18} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-12 h-12 rounded-full border-2 border-[#ff00ff] flex items-center justify-center text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black hover:shadow-[0_0_15px_rgba(255,0,255,0.5)] transition-all"
        >
          {isPlaying ? <span className="text-[10px] font-black w-3 h-3 bg-current rounded-[1px]"></span> : <Play size={20} className="ml-1" fill="currentColor" />}
        </button>

        <button onClick={nextTrack} className="text-gray-500 hover:text-white transition-colors">
          <SkipForward size={18} />
        </button>
      </div>

      {/* Playlist / Upcoming */}
      <div className="space-y-2 mt-2 overflow-y-auto flex-grow">
        {TRACKS.map((track, i) => (
          <div 
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(i);
              setIsPlaying(true);
            }}
            className={`cursor-pointer p-3 rounded-lg flex items-center gap-3 transition-colors ${
              i === currentTrackIndex 
                ? 'hidden' 
                : 'bg-transparent border border-white/5 opacity-60 hover:opacity-100 hover:bg-white/5'
            }`}
          >
            <div className="w-8 h-8 bg-[#080808] rounded flex items-center justify-center border border-white/10 shrink-0">
               <Music size={12} className="text-gray-500" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{track.title}</p>
              <p className="text-[10px] text-gray-500 truncate">{track.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
