import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Annual Tech Symposium',
      date: 'May 15, 2026',
      time: '09:00 AM - 05:00 PM',
      location: 'Main Auditorium',
      category: 'Technology',
      description: 'Join us for a day of innovation, featuring keynote speakers from top tech companies and student project showcases.'
    },
    {
      id: 2,
      title: 'Cultural Festival',
      date: 'June 2, 2026',
      time: '10:00 AM - 08:00 PM',
      location: 'Campus Square',
      category: 'Culture',
      description: 'Celebrate the diverse cultures of Ethiopia with music, dance, traditional food, and art exhibitions.'
    },
    {
      id: 3,
      title: 'Career Fair 2026',
      date: 'June 20, 2026',
      time: '08:30 AM - 04:00 PM',
      location: 'Student Union Building',
      category: 'Career',
      description: 'Connect with over 50 employers offering internships and full-time positions for graduating students.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <Helmet>
        <title>Events & Calendar | Arsi Aseko University</title>
        <meta name="description" content="Stay updated with upcoming events, symposiums, and cultural festivals at Arsi Aseko University." />
      </Helmet>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] p-8 mb-10 overflow-hidden bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border border-white/[0.05] shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] mix-blend-screen"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">
            <CalendarIcon className="w-3.5 h-3.5" /> Campus Life
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter leading-tight">
            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Events</span>
          </h1>
          <p className="text-slate-400 text-base font-medium leading-relaxed max-w-xl">
            Discover what's happening around campus. From academic symposiums to cultural festivals, stay engaged with the Arsi Aseko community.
          </p>
        </div>
      </motion.div>

      {/* Events List */}
      <div className="space-y-6">
        {upcomingEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-[#0a0f1e]/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/[0.04] hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <Star className="w-5 h-5 text-amber-400" />
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Date Block */}
              <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 flex flex-col items-center justify-center">
                 <span className="text-sm font-bold text-blue-400 uppercase">{event.date.split(' ')[0]}</span>
                 <span className="text-3xl font-black text-white">{event.date.split(' ')[1].replace(',', '')}</span>
              </div>

              {/* Event Details */}
              <div className="flex-1">
                <div className="inline-block px-2.5 py-1 rounded-md bg-white/[0.03] text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                  {event.category}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">{event.title}</h3>
                <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-400/70" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-400/70" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400/70" />
                    Open to All
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
         <Link to="/academic-calendar" className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all flex items-center justify-between group">
            <div>
               <h4 className="text-white font-bold mb-1">Academic Calendar</h4>
               <p className="text-xs text-slate-500">View semester timelines and exam dates</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
         </Link>
         <Link to="/announcements" className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all flex items-center justify-between group">
            <div>
               <h4 className="text-white font-bold mb-1">Official Announcements</h4>
               <p className="text-xs text-slate-500">Important notices from the administration</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
         </Link>
      </div>
    </div>
  );
};

export default Events;
