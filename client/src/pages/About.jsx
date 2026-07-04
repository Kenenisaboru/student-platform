import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Target, Eye, Users, BookOpen, Globe, GraduationCap, Building2, Award } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const campusImages = [
  'https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=1920',
];

const stats = [
  { icon: GraduationCap, value: 15000, suffix: '+', label: 'Students Enrolled' },
  { icon: Building2, value: 40, suffix: '+', label: 'Departments' },
  { icon: Users, value: 150, suffix: '+', label: 'Faculty Members' },
  { icon: Award, value: 25, suffix: 'yrs', label: 'Excellence' },
];

const AnimatedCounter = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime = null;
          const duration = 2000;
          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % campusImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const values = [
    { icon: Target, title: 'Excellence', desc: 'Striving for the highest academic standards in every discipline.' },
    { icon: Users, title: 'Community', desc: 'Fostering an inclusive, collaborative environment for all.' },
    { icon: Globe, title: 'Innovation', desc: 'Embracing new ideas, technologies, and global perspectives.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 pb-24">
      <Helmet>
        <title>About | Arsi Aseko University</title>
        <meta name="description" content="Learn about Arsi Aseko University's mission, vision, and core values." />
      </Helmet>

      {/* ── Hero Section ── */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative rounded-4xl mb-6 overflow-hidden border border-white/6 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
        style={{ minHeight: '480px' }}
      >
        {/* Carousel + Parallax Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="sync">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="absolute inset-0"
              style={{ y: bgY }}
            >
              <motion.img
                src={campusImages[currentSlide]}
                className="w-full h-full object-cover"
                style={{ scale: bgScale }}
                alt={`Campus view ${currentSlide + 1}`}
              />
            </motion.div>
          </AnimatePresence>

          {/* Layered gradient overlays */}
          <div className="absolute inset-0 bg-[#060a14]/60" />
          <div className="absolute inset-0 bg-linear-to-t from-[#060a14] via-[#060a14]/50 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-[#060a14]/70 via-transparent to-[#060a14]/70" />

          {/* Subtle animated glow */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Carousel dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {campusImages.map((_, i) => (
            <button
              key={i}
              id={`about-hero-slide-${i}`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to campus view ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentSlide
                  ? 'w-8 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]'
                  : 'w-2 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Hero Content with parallax */}
        <motion.div
          style={{ y: contentY }}
          className="relative z-10 text-center max-w-3xl mx-auto px-8 py-20 lg:py-28"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-8 backdrop-blur-md"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            Institution Profile
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: 'easeOut' }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.05]"
          >
            About{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400">
              Arsi Aseko
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Empowering the next generation of Ethiopian leaders through innovative education, rigorous research, and a commitment to community development.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* ── Animated Stats Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + idx * 0.1, duration: 0.6 }}
            className="relative p-6 rounded-3xl bg-[#0a0f1e]/80 backdrop-blur-xl border border-white/5 text-center group hover:border-blue-500/25 transition-all duration-400 overflow-hidden cursor-default"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-600/8 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl" />

            <div className="relative z-10">
              <div className="w-11 h-11 mx-auto rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                <stat.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-white mb-1 tabular-nums tracking-tighter">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em]">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Mission & Vision ── */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-4xl bg-linear-to-br from-blue-900/20 to-transparent border border-blue-500/10 group hover:border-blue-500/25 transition-colors duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-slate-400 leading-relaxed">
            To provide accessible, high-quality education that fosters critical thinking, technological proficiency, and ethical leadership, preparing students to solve complex challenges in Ethiopia and beyond.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-4xl bg-linear-to-br from-indigo-900/20 to-transparent border border-indigo-500/10 group hover:border-indigo-500/25 transition-colors duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Eye className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
          <p className="text-slate-400 leading-relaxed">
            To be a premier African institution recognized globally for academic excellence, cutting-edge research, and transformative societal impact.
          </p>
        </motion.div>
      </div>

      {/* ── Core Values ── */}
      <div className="mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-black text-center text-white mb-10 tracking-tighter"
        >
          Core Values
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((val, idx) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + idx * 0.1 }}
              className="bg-[#0a0f1e]/80 backdrop-blur-xl p-8 rounded-4xl border border-white/4 text-center group hover:border-white/12 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)] transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/3 border border-white/6 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300">
                <val.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
