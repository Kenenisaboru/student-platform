import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, AlertCircle, BookOpen, CheckCircle2 } from 'lucide-react';

const AcademicCalendar = () => {
  const semesters = [
    {
      term: 'Fall 2026',
      status: 'upcoming',
      dates: [
        { event: 'Registration Opens', date: 'Aug 15, 2026', type: 'admin' },
        { event: 'First Day of Classes', date: 'Sep 5, 2026', type: 'academic' },
        { event: 'Midterm Examinations', date: 'Oct 20-25, 2026', type: 'exam' },
        { event: 'Final Examinations', date: 'Dec 15-22, 2026', type: 'exam' },
        { event: 'End of Semester', date: 'Dec 24, 2026', type: 'admin' }
      ]
    },
    {
      term: 'Spring 2027',
      status: 'planned',
      dates: [
        { event: 'Registration Opens', date: 'Jan 10, 2027', type: 'admin' },
        { event: 'First Day of Classes', date: 'Jan 25, 2027', type: 'academic' },
        { event: 'Midterm Examinations', date: 'Mar 15-20, 2027', type: 'exam' },
        { event: 'Final Examinations', date: 'May 10-18, 2027', type: 'exam' },
        { event: 'Graduation Ceremony', date: 'May 25, 2027', type: 'admin' }
      ]
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'exam': return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'academic': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'admin': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <Helmet>
        <title>Academic Calendar | Arsi Aseko University</title>
        <meta name="description" content="Official academic calendar for Arsi Aseko University including registration, exams, and holidays." />
      </Helmet>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] p-8 mb-10 overflow-hidden bg-gradient-to-br from-slate-900 to-[#0a0f1e] border border-white/[0.05] shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] mix-blend-screen"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">
            <CalendarIcon className="w-3.5 h-3.5" /> Official Schedule
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter leading-tight">
            Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Calendar</span>
          </h1>
          <p className="text-slate-400 text-base font-medium leading-relaxed max-w-xl">
            Plan your academic year. Stay informed about crucial dates for registration, examinations, and university holidays.
          </p>
        </div>
      </motion.div>

      {/* Calendar Timeline */}
      <div className="space-y-12">
        {semesters.map((semester, idx) => (
          <motion.div 
            key={semester.term}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center gap-4 mb-6">
               <h2 className="text-2xl font-black text-white tracking-tight">{semester.term}</h2>
               <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${semester.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                  {semester.status}
               </div>
            </div>
            
            <div className="bg-[#0a0f1e]/80 backdrop-blur-xl rounded-[2rem] border border-white/[0.04] overflow-hidden">
              <div className="divide-y divide-white/[0.04]">
                {semester.dates.map((item, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform">
                        {getIcon(item.type)}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-base mb-1">{item.event}</h4>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">{item.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AcademicCalendar;
