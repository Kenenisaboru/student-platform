import { motion } from 'framer-motion';
import { Star, Quote, MapPin } from 'lucide-react';

const ArsiTestimonials = () => {
  const testimonials = [
    {
      name: 'Abebe Wolde',
      university: 'Addis Ababa University',
      program: 'Computer Science',
      testimonial: 'Being part of this Arsi Aseko community has been transformative. I found mentors, study partners, and lifelong friends. We celebrate each other\'s wins and support through challenges.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      achievement: 'Founded Tech Innovation Club'
    },
    {
      name: 'Fiona Getnet',
      university: 'Jimma University',
      program: 'Medical Sciences',
      testimonial: 'The platform connected me with students pursuing medicine across different universities. We share study materials, clinical experiences, and motivate each other daily.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      achievement: 'Top Performer in Clinical Rounds'
    },
    {
      name: 'Kedir Assefa',
      university: 'Hawassa University',
      program: 'Engineering',
      testimonial: 'Through this community, I got internship opportunities and connected with industry professionals from Aseko. My network here opened doors I didn\'t expect.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      achievement: 'Secured Internship at Leading Tech Company'
    },
    {
      name: 'Meskerem Teklemariam',
      university: 'Bahir Dar University',
      program: 'Business Administration',
      testimonial: 'The entrepreneurship support from this community is incredible. I launched my startup with backing and mentorship from fellow Arsi students. We\'re building the future together.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
      achievement: 'Founder of Sustainable Fashion Brand'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-1 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
        <h2 className="text-2xl font-black text-white tracking-tighter">Success Stories</h2>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
          Arsi Achievers
        </span>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {testimonials.map((testimonial, idx) => (
          <motion.div
            key={testimonial.name}
            variants={itemVariants}
            className="relative rounded-[1.5rem] p-6 bg-gradient-to-br from-[#0d1428] via-[#0a0f1e] to-[#060a14] border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-500 group overflow-hidden"
          >
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>

            <div className="relative z-10">
              {/* Header with avatar and stars */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white/10 group-hover:border-emerald-500/30 transition-all"
                  />
                  <div>
                    <h3 className="font-bold text-white text-sm">{testimonial.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{testimonial.program}</p>
                  </div>
                </div>
                <Quote className="w-4 h-4 text-emerald-500/30 group-hover:text-emerald-500/60 transition-colors" />
              </div>

              {/* University info */}
              <div className="flex items-center gap-1.5 mb-4 text-[11px] font-medium text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-500/60" />
                {testimonial.university}
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">
                "{testimonial.testimonial}"
              </p>

              {/* Achievement badge */}
              <div className="inline-block px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                {testimonial.achievement}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ArsiTestimonials;
