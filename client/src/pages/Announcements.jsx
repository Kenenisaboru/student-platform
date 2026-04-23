import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Megaphone, Bell, Info, ShieldAlert, ArrowRight } from 'lucide-react';

const Announcements = () => {
  const announcements = [
    {
      id: 1,
      title: 'Portal Migration Complete',
      date: 'April 23, 2026',
      type: 'system',
      content: 'The Arsi Aseko University student platform has been successfully migrated to the new production servers. You may notice improved loading times and enhanced security features.'
    },
    {
      id: 2,
      title: 'Library Hours Extended for Finals',
      date: 'April 20, 2026',
      type: 'academic',
      content: 'Starting next week, the main campus library will be open 24/7 to support students during the upcoming final examination period. Student ID is required for entry after 10 PM.'
    },
    {
      id: 3,
      title: 'Campus Wi-Fi Maintenance',
      date: 'April 18, 2026',
      type: 'alert',
      content: 'Scheduled maintenance for the campus Wi-Fi network will occur this Saturday from 2 AM to 6 AM. Intermittent connectivity issues are expected in dormitories during this window.'
    }
  ];

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'system': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'academic': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'alert': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'system': return <Info className="w-5 h-5 text-blue-400" />;
      case 'academic': return <Bell className="w-5 h-5 text-emerald-400" />;
      case 'alert': return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      default: return <Megaphone className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <Helmet>
        <title>Announcements | Arsi Aseko University</title>
        <meta name="description" content="Official announcements and notices from Arsi Aseko University administration." />
      </Helmet>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] p-8 mb-10 overflow-hidden bg-[#0d1428] border border-white/[0.05] shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] mix-blend-screen"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-4">
            <Megaphone className="w-3.5 h-3.5" /> Official Comm
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter leading-tight">
            University <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Notices</span>
          </h1>
          <p className="text-slate-400 text-base font-medium leading-relaxed max-w-xl">
            Important updates, alerts, and official communications from the Arsi Aseko University administration.
          </p>
        </div>
      </motion.div>

      {/* Announcements List */}
      <div className="space-y-6">
        {announcements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#0a0f1e]/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/[0.04] hover:border-white/[0.1] transition-all duration-300 group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform">
                {getIcon(announcement.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <h3 className="text-xl font-bold text-white leading-tight">{announcement.title}</h3>
                  <div className={`shrink-0 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest ${getBadgeStyle(announcement.type)}`}>
                    {announcement.type}
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{announcement.date}</span>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed pl-16">
              {announcement.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
