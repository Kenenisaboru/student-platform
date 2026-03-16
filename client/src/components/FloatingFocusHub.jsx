import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Play, Pause, RotateCcw, Headphones, X, Edit3, Save, CheckCircle, Sparkles, Clock } from 'lucide-react';

const FloatingFocusHub = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('timer');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus');
  const [noteContent, setNoteContent] = useState('');
  const [saved, setSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('focusHubNotes');
    if (savedNotes) setNoteContent(savedNotes);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      try { new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(); } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60); };
  const switchMode = (newMode) => { setIsActive(false); setMode(newMode); setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60); };
  const formatTime = (seconds) => { const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`; };
  const saveNotes = () => { localStorage.setItem('focusHubNotes', noteContent); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const toggleSound = () => { if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); } else { audioRef.current?.play().catch(() => {}); setIsPlaying(true); } };

  return (
    <>
      <audio ref={audioRef} loop src="https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg" />

      <AnimatePresence>
        {!isOpen && (
          <motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(true)}
            className="fixed bottom-20 lg:bottom-6 right-6 z-40 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-2xl shadow-indigo-500/20 flex items-center justify-center text-white focus:outline-none overflow-hidden group">
            <Target className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            {isActive && <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#060a14] rounded-full animate-pulse" />}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 lg:bottom-6 right-6 z-40 w-[320px] bg-[#0a0f1e]/95 backdrop-blur-2xl border border-white/[0.06] shadow-2xl rounded-2xl overflow-hidden flex flex-col text-slate-200">
            
            <div className="flex items-center justify-between p-3.5 border-b border-white/[0.04] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-sm text-white">Focus Hub <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded ml-1">BETA</span></span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex p-1.5 gap-1 bg-white/[0.01]">
              <button onClick={() => setActiveTab('timer')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-lg transition-all ${activeTab === 'timer' ? 'bg-indigo-500/15 text-indigo-300' : 'text-slate-500 hover:bg-white/[0.03]'}`}>
                <Clock className="w-3 h-3" /> Timer
              </button>
              <button onClick={() => setActiveTab('notes')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-lg transition-all ${activeTab === 'notes' ? 'bg-purple-500/15 text-purple-300' : 'text-slate-500 hover:bg-white/[0.03]'}`}>
                <Edit3 className="w-3 h-3" /> Notes
              </button>
              <button onClick={() => setActiveTab('sounds')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-lg transition-all ${activeTab === 'sounds' ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-500 hover:bg-white/[0.03]'}`}>
                <Headphones className="w-3 h-3" /> Focus
              </button>
            </div>

            <div className="p-4 h-[260px] overflow-hidden relative">
              <AnimatePresence mode="wait">
                {activeTab === 'timer' && (
                  <motion.div key="timer" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="flex flex-col items-center justify-center h-full">
                    <div className="flex gap-1.5 mb-5 bg-white/[0.03] p-1 rounded-lg border border-white/[0.04]">
                      <button onClick={() => switchMode('focus')} className={`px-4 py-1.5 text-[11px] font-bold rounded-md transition-all ${mode === 'focus' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Focus</button>
                      <button onClick={() => switchMode('break')} className={`px-4 py-1.5 text-[11px] font-bold rounded-md transition-all ${mode === 'break' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Break</button>
                    </div>
                    <div className="relative mb-6 flex items-center justify-center">
                      <svg width="130" height="130" className="transform -rotate-90">
                        <circle cx="65" cy="65" r="60" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/[0.04]" />
                        <circle cx="65" cy="65" r="60" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * timeLeft) / (mode === 'focus' ? 25 * 60 : 5 * 60)} strokeLinecap="round" className={`${mode === 'focus' ? 'text-indigo-400' : 'text-purple-400'} transition-all duration-1000 ease-linear`} />
                      </svg>
                      <span className="absolute text-3xl font-extrabold tracking-tighter text-white font-mono">{formatTime(timeLeft)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={toggleTimer} className={`w-11 h-11 flex items-center justify-center rounded-xl text-white shadow-lg transition-all ${isActive ? 'bg-red-500/80 hover:bg-red-500' : 'bg-indigo-500 hover:bg-indigo-400'}`}>
                        {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>
                      <button onClick={resetTimer} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-slate-400"><RotateCcw className="w-3.5 h-3.5" /></button>
                    </div>
                  </motion.div>
                )}
                {activeTab === 'notes' && (
                  <motion.div key="notes" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Scratchpad</span>
                      <button onClick={saveNotes} className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase rounded transition-all ${saved ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.06]'}`}>
                        {saved ? <CheckCircle className="w-3 h-3" /> : <Save className="w-3 h-3" />} {saved ? 'Saved' : 'Save'}
                      </button>
                    </div>
                    <textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder="Jot down thoughts..." className="flex-1 w-full bg-white/[0.03] border border-white/[0.06] p-3 text-sm text-slate-300 rounded-xl resize-none outline-none focus:border-purple-500/20 transition-all font-mono leading-relaxed" />
                  </motion.div>
                )}
                {activeTab === 'sounds' && (
                  <motion.div key="sounds" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="flex flex-col h-full justify-center items-center gap-5">
                    <div className="text-center space-y-1.5">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 mb-2"><Sparkles className={`w-7 h-7 text-emerald-400 ${isPlaying ? 'animate-pulse' : ''}`} /></div>
                      <h3 className="text-sm font-bold text-white">Deep Focus Audio</h3>
                      <p className="text-[11px] text-slate-500 px-4">Block distractions with ambient rain.</p>
                    </div>
                    <button onClick={toggleSound} className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold transition-all text-sm ${isPlaying ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20' : 'bg-white/[0.04] text-white hover:bg-white/[0.06]'}`}>
                      {isPlaying ? 'Playing Rain' : <><Play className="w-4 h-4 fill-current" /> Play Rain</>}
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
