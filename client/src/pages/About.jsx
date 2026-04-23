import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Target, Eye, Shield, Users, BookOpen, Globe } from 'lucide-react';

const About = () => {
  const values = [
    { icon: Target, title: 'Excellence', desc: 'Striving for the highest academic standards.' },
    { icon: Users, title: 'Community', desc: 'Fostering an inclusive environment for all.' },
    { icon: Globe, title: 'Innovation', desc: 'Embracing new ideas and global perspectives.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 pb-24">
      <Helmet>
        <title>About | Arsi Aseko University</title>
        <meta name="description" content="Learn about Arsi Aseko University's mission, vision, and core values." />
      </Helmet>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] p-10 lg:p-16 mb-16 overflow-hidden bg-gradient-to-br from-[#060a14] to-[#0a0f1e] border border-white/[0.05] shadow-2xl"
      >
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80&w=1920" 
             className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
             alt="University Campus"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5" /> Institution Profile
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Arsi Aseko</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
            Empowering the next generation of Ethiopian leaders through innovative education, rigorous research, and a commitment to community development.
          </p>
        </div>
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
         <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/10"
         >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
               <Target className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-slate-400 leading-relaxed">
               To provide accessible, high-quality education that fosters critical thinking, technological proficiency, and ethical leadership, preparing students to solve complex challenges in Ethiopia and beyond.
            </p>
         </motion.div>

         <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/10"
         >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
               <Eye className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-slate-400 leading-relaxed">
               To be a premier African institution recognized globally for academic excellence, cutting-edge research, and transformative societal impact.
            </p>
         </motion.div>
      </div>

      {/* Core Values */}
      <div className="mb-16">
         <h2 className="text-3xl font-black text-center text-white mb-10">Core Values</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((val, idx) => (
               <motion.div 
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="bg-[#0a0f1e]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/[0.04] text-center group hover:border-white/[0.1] transition-colors"
               >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <val.icon className="w-6 h-6 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                  <p className="text-slate-500 text-sm">{val.desc}</p>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default About;
