import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, Coffee, Zap, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak) {
        if (soundEnabled) playNotification();
        setIsBreak(true);
        setTimeLeft(5 * 60);
        setIsActive(false);
      } else {
        if (soundEnabled) playNotification();
        setIsBreak(false);
        setTimeLeft(25 * 60);
        setIsActive(false);
      }
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, soundEnabled]);

  const playNotification = () => {
    // Basic beep synthesizer if Audio is available
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn('Audio notification failed', e);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  const skipBreak = () => {
    setIsBreak(false);
    setTimeLeft(25 * 60);
    setIsActive(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const totalTime = isBreak ? 5 * 60 : 25 * 60;
  const progress = ((totalTime - timeLeft) / totalTime);
  const dashArray = 2 * Math.PI * 45; // r=45
  const dashOffset = dashArray - (dashArray * progress);

  return (
    <div className="glass-card p-8 relative overflow-hidden group">
      {/* Dynamic Background Glow */}
      <motion.div 
        animate={{ 
          opacity: isActive ? [0.05, 0.1, 0.05] : 0.05,
          scale: isActive ? [1, 1.1, 1] : 1
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className={`absolute inset-0 pointer-events-none ${isBreak ? 'bg-green-500/20' : 'bg-brand-500/20'} blur-[100px]`}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Side: Info */}
        <div className="flex flex-col gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className={`p-4 rounded-2xl shadow-lg border ${
              isBreak 
                ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-green-500/10' 
                : 'bg-brand-500/10 text-brand-400 border-brand-500/20 shadow-brand-500/10'
            }`}>
              {isBreak ? <Coffee className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">{isBreak ? 'Break Time' : 'Deep Work'}</h3>
              <p className="text-gray-400 text-sm font-medium">{isBreak ? 'Time to recharge' : 'Eliminate all distractions'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center md:justify-start">
             <button 
               onClick={() => setSoundEnabled(!soundEnabled)}
               className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
               title={soundEnabled ? 'Disable sound' : 'Enable sound'}
             >
               {soundEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
             </button>
             <button 
               onClick={resetTimer}
               className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
               title="Restart Session"
             >
               <RotateCcw className="w-4 h-4" />
             </button>
             {isBreak && (
                <button 
                  onClick={skipBreak}
                  className="px-4 py-2 rounded-xl bg-brand-500/10 text-brand-400 text-xs font-bold border border-brand-500/20 hover:bg-brand-500 hover:text-white transition-all uppercase tracking-wider"
                >
                  Skip
                </button>
             )}
          </div>
        </div>

        {/* Center: Circular Progress */}
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="45" 
                className="stroke-current text-white/5" 
                strokeWidth="4" 
                fill="none" 
              />
              <motion.circle 
                cx="50" cy="50" r="45" 
                className={`stroke-current ${isBreak ? 'text-green-500' : 'text-brand-500'}`}
                strokeWidth="4" 
                strokeLinecap="round"
                fill="none" 
                strokeDasharray={dashArray}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </svg>
            
            {/* Timer Display */}
            <div className="absolute flex flex-col items-center">
               <span className="text-4xl font-black text-white tracking-widest font-mono select-none drop-shadow-md">
                 {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
               </span>
               <div className="mt-1">
                  {isActive ? (
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="px-2 py-0.5 rounded bg-brand-500/20 text-[8px] font-black text-brand-400 uppercase tracking-widest"
                    >
                      Active
                    </motion.div>
                  ) : (
                    <div className="px-2 py-0.5 rounded bg-white/5 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                      Paused
                    </div>
                  )}
               </div>
            </div>
        </div>

        {/* Right Side: Primary Action */}
        <div className="flex flex-col items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl relative ${
              isActive 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : isBreak 
                  ? 'bg-green-600 text-white shadow-green-500/30'
                  : 'bg-brand-600 text-white shadow-brand-500/30 border border-brand-400/50'
            }`}
          >
            {isActive ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
            
            {/* Pulsing ring when active */}
            {isActive && (
              <motion.div 
                animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-amber-500/40"
              />
            )}
          </motion.button>
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
            {isActive ? 'Pause Session' : 'Start Session'}
          </p>
        </div>
      </div>
    </div>
  );
}
