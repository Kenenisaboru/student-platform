import { motion } from 'framer-motion';
import { Sparkles, Heart, Zap } from 'lucide-react';

const ArsiMotivationCard = () => {
  const motivationalMessages = [
    {
      title: 'Born in Aseko, Building Ethiopia',
      message: 'Your roots run deep in Aseko. Your impact reaches across Ethiopia. Never forget where you come from as you reach for where you\'re going.',
      icon: Heart,
      color: 'from-rose-500/20 to-transparent border-rose-500/20'
    },
    {
      title: 'Unity in Diversity',
      message: 'From different universities, different programs, different cities. But one community. One mission. We rise together or not at all.',
      icon: Sparkles,
      color: 'from-purple-500/20 to-transparent border-purple-500/20'
    },
    {
      title: 'Excellence is Our Standard',
      message: 'You\'re not just here to pass. You\'re here to excel. You\'re not just studying—you\'re preparing to lead. Own your potential.',
      icon: Zap,
      color: 'from-amber-500/20 to-transparent border-amber-500/20'
    },
    {
      title: 'Network is Your Net Worth',
      message: 'The connections you build here, the relationships you forge, the mentors you meet—they\'ll define your career. Invest in your community.',
      icon: Heart,
      color: 'from-emerald-500/20 to-transparent border-emerald-500/20'
    },
    {
      title: 'Lift as You Climb',
      message: 'Your success means nothing if your community isn\'t rising with you. Be the mentor. Be the opportunity. Be the change.',
      icon: Sparkles,
      color: 'from-blue-500/20 to-transparent border-blue-500/20'
    },
    {
      title: 'Your Story Matters',
      message: 'Every achievement, every challenge, every lesson learned. Your story inspires others. Share it. Own it. Make it count.',
      icon: Zap,
      color: 'from-indigo-500/20 to-transparent border-indigo-500/20'
    }
  ];

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  const IconComponent = randomMessage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative rounded-[1.5rem] p-6 bg-gradient-to-br ${randomMessage.color} border overflow-hidden group mb-8`}
    >
      {/* Animated background accent */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconComponent className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <h3 className="font-black text-white text-sm tracking-tight">{randomMessage.title}</h3>
            </div>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed font-medium italic">
          {randomMessage.message}
        </p>

        {/* Subtle call to action */}
        <div className="mt-4 pt-4 border-t border-white/[0.05]">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
            Remember this. Live this. Be this.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ArsiMotivationCard;
