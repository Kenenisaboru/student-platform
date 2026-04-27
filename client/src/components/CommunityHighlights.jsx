import { motion } from 'framer-motion';
import { Users, Award, BookOpen, Zap, Globe, Heart } from 'lucide-react';

const CommunityHighlights = () => {
  const highlights = [
    {
      icon: Users,
      title: '500+ Active Members',
      description: 'Arsi Aseko students across 25+ Ethiopian universities',
      stat: '500+',
      color: 'emerald'
    },
    {
      icon: Award,
      title: 'Scholarship Winners',
      description: '45 students received scholarships through network recommendations',
      stat: '45',
      color: 'blue'
    },
    {
      icon: BookOpen,
      title: 'Study Resources',
      description: '1000+ shared study materials, past papers, and guides',
      stat: '1000+',
      color: 'purple'
    },
    {
      icon: Globe,
      title: 'International Connections',
      description: 'Alumni studying abroad supporting current students',
      stat: '30+',
      color: 'cyan'
    },
    {
      icon: Zap,
      title: 'Internship Placements',
      description: 'Career opportunities facilitated through community',
      stat: '60+',
      color: 'amber'
    },
    {
      icon: Heart,
      title: 'Community Projects',
      description: 'Educational initiatives and mentorship programs',
      stat: '12',
      color: 'rose'
    }
  ];

  const colorClasses = {
    emerald: 'from-emerald-500/20 to-transparent border-emerald-500/20 text-emerald-400',
    blue: 'from-blue-500/20 to-transparent border-blue-500/20 text-blue-400',
    purple: 'from-purple-500/20 to-transparent border-purple-500/20 text-purple-400',
    cyan: 'from-cyan-500/20 to-transparent border-cyan-500/20 text-cyan-400',
    amber: 'from-amber-500/20 to-transparent border-amber-500/20 text-amber-400',
    rose: 'from-rose-500/20 to-transparent border-rose-500/20 text-rose-400'
  };

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-1 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
        <h2 className="text-2xl font-black text-white tracking-tighter">Community Achievements</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.08 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {highlights.map((highlight, idx) => {
          const IconComponent = highlight.icon;
          const bgGradient = colorClasses[highlight.color];
          
          return (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`relative rounded-[1.5rem] p-6 bg-gradient-to-br ${bgGradient} border overflow-hidden group hover:scale-105 transition-transform cursor-pointer`}
            >
              {/* Animated background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${bgGradient}`}></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <IconComponent className="w-6 h-6" />
                  <div className="text-right">
                    <p className="text-2xl font-black">{highlight.stat}</p>
                  </div>
                </div>
                
                <h3 className="text-white font-bold text-sm mb-1">{highlight.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{highlight.description}</p>
              </div>

              {/* Corner accent */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 rounded-[1.5rem] bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10 border border-emerald-500/20 text-center"
      >
        <p className="text-slate-300 text-sm font-medium mb-3">
          Your achievements matter to our community. The stronger we are together, the higher we all rise.
        </p>
        <p className="text-[11px] text-slate-500 uppercase font-bold tracking-widest">
          Join thousands of ambitious Arsi Aseko students building their futures together
        </p>
      </motion.div>
    </div>
  );
};

export default CommunityHighlights;
