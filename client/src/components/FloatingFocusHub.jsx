import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Play, Pause, RotateCcw, Headphones, X, Edit3, Save, CheckCircle, Sparkles, Clock } from 'lucide-react';

const FloatingFocusHub = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('timer'); // timer, notes, sounds

  // Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, break

  // Notes State
  const [noteContent, setNoteContent] = useState('');
  const [saved, setSaved] = useState(false);

  // Sounds State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Load notes from local storage
  useEffect(() => {
    const savedNotes = localStorage.getItem('focusHubNotes');
    if (savedNotes) {
      setNoteContent(savedNotes);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a small notification sound
      try {
        new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
      } catch (e) {
        console.log("Audio play failed");
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const saveNotes = () => {
    localStorage.setItem('focusHubNotes', noteContent);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleSound = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play().catch(() => console.log('Autoplay prevented'));
      setIsPlaying(true);
    }
  };

  return (
    <>
      {/* Hidden audio element for ambient sounds */}
      <audio 
        ref={audioRef} 
        loop 
        src="https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg" 
      />

      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white focus:outline-none focus:ring-4 focus:ring-purple-500/30 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Target className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            
            {/* Notification dot if timer is running */}
            {isActive && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expandable Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[340px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col text-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-sm text-white">Focus Hub <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded ml-1">BETA</span></span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-2 gap-1 bg-slate-800/30">
              <button
                onClick={() => setActiveTab('timer')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'timer' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Clock className="w-3.5 h-3.5" /> Timer
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'notes' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Notes
              </button>
              <button
                onClick={() => setActiveTab('sounds')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'sounds' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Headphones className="w-3.5 h-3.5" /> Focus
              </button>
            </div>

            {/* Content Area */}
            <div className="p-5 h-[280px] overflow-hidden relative">
              <AnimatePresence mode="wait">
                
                {/* TIMER TAB */}
                {activeTab === 'timer' && (
                  <motion.div
                    key="timer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col items-center justify-center h-full"
                  >
                    <div className="flex gap-2 mb-6 bg-slate-800/80 p-1 rounded-lg">
                      <button 
                        onClick={() => switchMode('focus')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'focus' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        Focus
                      </button>
                      <button 
                        onClick={() => switchMode('break')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'break' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        Break
                      </button>
                    </div>

                    <div className="relative mb-8 flex items-center justify-center group">
                      <svg width="140" height="140" className="transform -rotate-90">
                        <circle cx="70" cy="70" r="65" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                        <circle 
                          cx="70" cy="70" r="65" 
                          stroke="currentColor" 
                          strokeWidth="4" 
                          fill="transparent" 
                          strokeDasharray={408.4}
                          strokeDashoffset={408.4 - (408.4 * timeLeft) / (mode === 'focus' ? 25 * 60 : 5 * 60)}
                          strokeLinecap="round"
                          className={`${mode === 'focus' ? 'text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'} transition-all duration-1000 ease-linear`}
                        />
                      </svg>
                      <span className="absolute text-4xl font-extrabold tracking-tighter text-white font-mono">
                        {formatTime(timeLeft)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button 
                        onClick={toggleTimer}
                        className={`w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg transition-all ${isActive ? 'bg-red-500/80 hover:bg-red-500 ring-4 ring-red-500/20' : 'bg-indigo-500 hover:bg-indigo-400 ring-4 ring-indigo-500/20'}`}
                      >
                        {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                      </button>
                      <button 
                        onClick={resetTimer}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* NOTES TAB */}
                {activeTab === 'notes' && (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Scratchpad</span>
                       <button 
                         onClick={saveNotes}
                         className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded transition-all ${saved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                       >
                         {saved ? <CheckCircle className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                         {saved ? 'Saved' : 'Save'}
                       </button>
                    </div>
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Jot down quick thoughts... (auto-saves locally)"
                      className="flex-1 w-full bg-slate-900 border border-slate-700 p-3 text-sm text-slate-300 rounded-xl resize-none outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all font-mono leading-relaxed"
                    />
                  </motion.div>
                )}

                {/* SOUNDS TAB */}
                {activeTab === 'sounds' && (
                  <motion.div
                    key="sounds"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col h-full justify-center items-center gap-6"
                  >
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-2">
                        <Sparkles className={`w-8 h-8 text-emerald-400 ${isPlaying ? 'animate-pulse' : ''}`} />
                      </div>
                      <h3 className="text-sm font-bold text-white">Deep Focus Audio</h3>
                      <p className="text-xs text-slate-400 px-6 text-center">Block out distractions with continuous heavy rain ambient noise.</p>
                    </div>

                    <button
                      onClick={toggleSound}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${isPlaying ? 'bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/30' : 'bg-slate-800 text-white hover:bg-slate-700 hover:scale-105'}`}
                    >
                      {isPlaying ? (
                        <>
                          <div className="flex gap-0.5 items-end h-4">
                            <span className="w-1 bg-emerald-400 animate-[bounce_1s_infinite] rounded-t" style={{height: '100%'}}></span>
                            <span className="w-1 bg-emerald-400 animate-[bounce_1s_infinite_0.2s] rounded-t" style={{height: '60%'}}></span>
                            <span className="w-1 bg-emerald-400 animate-[bounce_1s_infinite_0.4s] rounded-t" style={{height: '80%'}}></span>
                            <span className="w-1 bg-emerald-400 animate-[bounce_1s_infinite_0.1s] rounded-t" style={{height: '40%'}}></span>
                          </div>
                          Playing Rain
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" /> Play Premium Rain
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingFocusHub;
