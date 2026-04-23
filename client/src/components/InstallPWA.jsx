import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-4 right-4 z-[100] sm:left-auto sm:right-8 sm:bottom-8 sm:w-80"
      >
        <div className="bg-[#0d1428]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl shadow-blue-500/10">
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="pt-1">
              <h3 className="text-white font-bold text-sm">Install AAU Portal</h3>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Add to your home screen for a full-screen experience and offline access.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstall}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            Install Mobile App
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPWA;
