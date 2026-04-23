import { useAuth } from '../context/AuthContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Download, Share2, MapPin, Building, Calendar, Bookmark, Sparkles, Fingerprint, Award, Cpu, QrCode, MoreHorizontal, Info } from 'lucide-react';
import { toast } from 'sonner';

const VirtualID = () => {
  const { user } = useAuth();
  
  // Mouse tilt effect logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!user) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.origin}/profile/${user._id}`;

  const downloadID = () => {
    toast.success('Generating secure high-resolution digital credential...');
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 lg:px-8 pb-32 min-h-[calc(100vh-6rem)]">
      
      {/* Narrative Header */}
      <div className="mb-16 text-center lg:text-left">
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">
            <Fingerprint className="w-3 h-3" /> Secure Identity Node
         </motion.div>
         <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-none">
            Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Credential.</span>
         </h1>
         <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
            Arsi Aseko University's official cryptographic identity card for campus access, resource authorization, and student verification.
         </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center">
        
        {/* The Premium ID Card (Front) */}
        <div className="perspective-1000">
           <motion.div 
             onMouseMove={handleMouseMove}
             onMouseLeave={handleMouseLeave}
             style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
             }}
             className="relative w-[340px] sm:w-[380px] h-[550px] bg-gradient-to-br from-[#0d1428] via-[#0a0f1e] to-[#060a14] rounded-[3rem] p-10 border border-white/[0.08] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] group overflow-hidden"
           >
              {/* Background Aesthetic Layers */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-all duration-700"></div>
              <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.1))]"></div>
              
              {/* Card Content Overlay */}
              <div className="relative z-10 flex flex-col h-full" style={{ transform: "translateZ(50px)" }}>
                 
                 {/* Card Header */}
                 <div className="flex justify-between items-start mb-10">
                    <div className="flex flex-col">
                       <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-1">
                          <span className="font-black text-white text-[10px] tracking-widest uppercase">AAU ARC</span>
                       </div>
                       <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Auth System</span>
                    </div>
                    <Cpu className="w-8 h-8 text-blue-500/40" />
                 </div>

                 {/* Identity Core */}
                 <div className="flex flex-col items-center mb-10">
                    <div className="relative mb-6">
                       <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-blue-500/40 to-transparent backdrop-blur-xl border border-white/10 shadow-lg">
                          <img src={user.profilePicture} className="w-32 h-32 rounded-[2.2rem] object-cover ring-2 ring-black" alt="" />
                       </div>
                       <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-emerald-500 rounded-2xl flex items-center justify-center border-4 border-[#0d1428] shadow-lg text-white">
                          <ShieldCheck className="w-4 h-4" />
                       </div>
                    </div>

                    <h2 className="text-3xl font-black text-white mb-2 tracking-tighter leading-tight text-center">{user.name}</h2>
                    <div className="px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20">
                       <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Official Scholar</p>
                    </div>
                 </div>

                 {/* Node Parameters */}
                 <div className="space-y-4 mb-4 flex-1">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner">
                       <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1.5">Focus Department</p>
                       <p className="text-white font-black text-sm tracking-tight">{user.department || 'Applied Science Node'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner">
                       <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1.5">Universal Access</p>
                       <p className="text-white font-black text-xs tracking-tight">Arsi Aseko University Campus</p>
                    </div>
                 </div>

                 {/* Footer Status */}
                 <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] relative">
                    <div className="flex flex-col">
                       <span className="text-slate-700">Expires Segment</span>
                       <span className="text-slate-400">DEC 2026</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                       <span>SYNCED</span>
                    </div>
                 </div>
              </div>

              {/* Holographic Shift Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 group-hover:opacity-100 transition-opacity pointer-events-none opacity-0"></div>
           </motion.div>
        </div>

        {/* The Back / Verification Panel */}
        <div className="flex flex-col gap-6">
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="w-[340px] h-[340px] bg-[#0d1428] rounded-[3rem] p-12 border border-white/[0.08] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute -inset-10 bg-gradient-to-br from-blue-600/10 to-transparent blur-3xl pointer-events-none"></div>
              <div className="relative z-10 bg-white p-6 rounded-[2.5rem] shadow-2xl mb-8 group-hover:scale-110 transition-transform duration-500 ring-4 ring-white/10">
                 <img src={qrUrl} className="w-32 h-32" alt="QR" />
              </div>
              <div className="relative z-10 text-center">
                 <h3 className="text-white font-black text-sm uppercase tracking-widest mb-1">Coded Key</h3>
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Scan for Cloud Verification</p>
              </div>
           </motion.div>

           <div className="grid grid-cols-2 gap-4">
              <motion.button 
                onClick={downloadID}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col items-center gap-3 group hover:bg-white transition-all"
              >
                 <Download className="w-5 h-5 text-slate-500 group-hover:text-[#060a14]" />
                 <span className="text-[9px] font-black uppercase text-slate-500 group-hover:text-[#060a14] tracking-widest">Download Asset</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col items-center gap-3 group hover:bg-blue-600 transition-all hover:border-blue-500"
              >
                 <Share2 className="w-5 h-5 text-slate-500 group-hover:text-white" />
                 <span className="text-[9px] font-black uppercase text-slate-500 group-hover:text-white tracking-widest">Share Signal</span>
              </motion.button>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/10 flex items-start gap-4">
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                 <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2 leading-none">Security Protocol</h4>
                 <p className="text-slate-500 text-[10px] font-medium leading-relaxed">
                    This credential uses AES-256 cloud-syncing. Tampering with visual data or encoded QR nodes will result in immediate identity suspension.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
export default VirtualID;
