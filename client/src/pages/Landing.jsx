import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, MessageCircle, Heart, Share2, Bell, Shield,
  Users, GraduationCap, BookOpen, Quote, Sparkles, Zap,
  Play, Star, Code
} from 'lucide-react';
import Footer from '../components/Footer';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&w=1920&q=80',
    tagline: 'Where Arsi Aseko students connect, share, and grow together.',
  },
  {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80',
    tagline: 'A community built by students, for students — no barriers, just connection.',
  },
  {
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80',
    tagline: 'From campus updates to study groups — everything in one place.',
  },
];

const stats = [
  { icon: Users, value: '15,000+', label: 'Students' },
  { icon: GraduationCap, value: '40+', label: 'Departments' },
  { icon: BookOpen, value: '12k+', label: 'Resources Shared' },
  { icon: Star, value: '4.9', label: 'Student Rating' },
];

const features = [
  {
    icon: MessageCircle,
    title: 'Share & Discuss',
    desc: 'Post about your academic journey, ask questions, and spark meaningful conversations.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Heart,
    title: 'React & Engage',
    desc: 'Like, comment, and repost content that resonates with you and your peers.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: Share2,
    title: 'Repost & Quote',
    desc: 'Share ideas with your own perspective and spread knowledge across the community.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Bell,
    title: 'Stay Updated',
    desc: 'Get real-time notifications for likes, comments, messages, and campus events.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Shield,
    title: 'Digital Student ID',
    desc: 'Carry your verified student ID on your phone — accessible anytime, anywhere.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: MessageCircle,
    title: 'Group Messaging',
    desc: 'Create group chats for study sessions, clubs, or any team you want to build.',
    gradient: 'from-cyan-500 to-sky-600',
  },
];

const steps = [
  { num: '01', title: 'Sign Up', desc: 'Create your account with your university email in seconds.' },
  { num: '02', title: 'Set Up Profile', desc: 'Add your photo, department, and bio so classmates can find you.' },
  { num: '03', title: 'Start Connecting', desc: 'Post, chat, follow, and build your campus network.' },
];

const team = [
  {
    name: 'Kenenisa Boru',
    role: 'Platform Architect',
    uni: 'Haramaya University',
    dept: 'CIS, 4th Year',
    initial: 'K',
    gradient: 'from-amber-500 to-orange-600',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    bg: 'bg-amber-500/5',
    text: 'text-amber-400',
    bio: 'Full-stack software developer and the architect behind this very platform — turning code into a digital home for Arsi Aseko students.',
  },
  {
    name: 'Ibrahim Jemal',
    role: 'Community Architect',
    uni: 'Haramaya University',
    dept: 'C1 Medical Student',
    initial: 'I',
    gradient: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    bg: 'bg-emerald-500/5',
    text: 'text-emerald-400',
    bio: 'Founding architect of the community\'s summer tutorial program — turning a small circle of friends into a lasting engine of academic support for Aseko\'s youth.',
  },
  {
    name: 'Gutema Aman',
    role: 'Academic Mentor',
    uni: 'Haramaya University',
    dept: 'C2 Medical Student',
    initial: 'G',
    gradient: 'from-violet-500 to-purple-600',
    border: 'border-violet-500/20 hover:border-violet-500/40',
    bg: 'bg-violet-500/5',
    text: 'text-violet-400',
    bio: 'Co-founder of the summer tutorial class and trusted guide for Grade 8 students — personally preparing top scorers for Oromia\'s special boarding schools.',
  },
  {
    name: 'Abdela Omer',
    role: 'Program Organizer',
    uni: 'Wachemo University',
    dept: '5th Year Law Student',
    initial: 'A',
    gradient: 'from-amber-500 to-yellow-600',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    bg: 'bg-amber-500/5',
    text: 'text-amber-400',
    bio: 'The organizing force behind the summer tutorial class — coordinating schedules, bringing teachers together, and keeping the program running year after year.',
  },
  {
    name: 'Nurelay Mohammed',
    role: 'History Instructor',
    uni: 'Wachemo University',
    dept: '4th Year Law Student',
    initial: 'N',
    gradient: 'from-rose-500 to-pink-600',
    border: 'border-rose-500/20 hover:border-rose-500/40',
    bg: 'bg-rose-500/5',
    text: 'text-rose-400',
    bio: 'Teaches History to junior students every summer, helping them connect with their subject and build strong study habits through patient, genuine care.',
  },
  {
    name: 'Hamid Orbose',
    role: 'Student Mentor',
    uni: 'Haramaya University',
    dept: '4th Year Nursing Student',
    initial: 'H',
    gradient: 'from-cyan-500 to-sky-600',
    border: 'border-cyan-500/20 hover:border-cyan-500/40',
    bg: 'bg-cyan-500/5',
    text: 'text-cyan-400',
    bio: 'Brings a caregiver\'s patience into the classroom — teaching and supporting students at every level, meeting each one where they are.',
  },
];

const stories = [
  {
    name: 'Ibrahim Jemal',
    dept: 'C1 Medical Student',
    uni: 'Haramaya University',
    initial: 'I',
    gradient: 'from-emerald-400 to-teal-500',
    ring: 'ring-emerald-500/30',
    tag: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    quote: 'If I can help one more student stay in school and believe in themselves, then everything I do is worth it.',
    story: 'Ibrahim Jemal always believed that success means little if it isn\'t shared. While pursuing his dream of becoming a doctor as a C1 medical student at Haramaya University, he never forgot the students walking the same path he once walked back home in Aseko.\n\nA few years ago, together with a handful of close friends, Ibrahim started something simple but powerful: a free summer tutorial class for junior students in the community. What began as a small gathering of a few motivated friends has grown into one of the most trusted academic support programs for Arsi Aseko\'s younger generation.\n\nEvery summer, while most university students rest, Ibrahim returns home to teach, mentor, and encourage students who need it most — helping them build confidence, close learning gaps, and believe in bigger futures for themselves. He doesn\'t just teach subjects; he teaches students how to dream beyond their circumstances.\n\nFor Ibrahim, medicine and mentorship come from the same place: a deep commitment to healing and building his community, one student at a time.',
  },
  {
    name: 'Gutema Aman',
    dept: 'C2 Medical Student',
    uni: 'Haramaya University',
    initial: 'G',
    gradient: 'from-violet-400 to-purple-500',
    ring: 'ring-violet-500/30',
    tag: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    quote: 'Every child with potential deserves someone who sees it and helps them chase it.',
    story: 'Gutema Aman\'s journey as a medical student at Haramaya University is matched only by his dedication to lifting up the students coming up behind him. As one of the founders of the summer tutorial class, Gutema has spent years helping junior students across Aseko strengthen their academics and stay on track.\n\nBut Gutema\'s impact goes even further. He has become a trusted guide for Grade 8 students with strong academic potential, personally supporting and preparing top scorers to compete for placement in Oromia\'s special boarding schools — opportunities that can change the entire trajectory of a young student\'s life.\n\nBalancing the demands of medical school with this responsibility isn\'t easy, but Gutema sees it as part of the same calling: identifying talent, nurturing it, and opening doors that might otherwise stay closed. For many students in Aseko, Gutema isn\'t just a tutor — he\'s the reason they believed they could reach further.',
  },
  {
    name: 'Abdela Omer',
    dept: '5th Year Law Student',
    uni: 'Wachemo University',
    initial: 'A',
    gradient: 'from-amber-400 to-yellow-500',
    ring: 'ring-amber-500/30',
    tag: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    quote: 'A community grows stronger when its students choose to come back and build, not just leave and forget.',
    story: 'Abdela Omer wears two hats with equal dedication: that of a future lawyer and that of a devoted community organizer. As a 5th-year Law student at Wachemo University, he has spent his years away from home building the skills to advocate and lead — skills he brings straight back to Aseko every summer.\n\nAs the organizing force behind the community\'s summer tutorial class, Abdela does far more than teach Geography to junior students. He coordinates schedules, brings teachers together, and makes sure the program runs smoothly year after year — turning a simple idea into a dependable tradition the community can count on.\n\nFor Abdela, leadership isn\'t about titles; it\'s about showing up consistently for the students who need guidance the most, and making sure no junior student in Aseko is left without support during the summer break.',
  },
  {
    name: 'Nurelay Mohammed',
    dept: '4th Year Law Student',
    uni: 'Wachemo University',
    initial: 'N',
    gradient: 'from-rose-400 to-pink-500',
    ring: 'ring-rose-500/30',
    tag: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    quote: 'Knowledge means more when it\'s shared — that\'s why I come back every summer.',
    story: 'Nurelay Mohammed is proof that giving back doesn\'t require waiting until graduation. As a 4th-year Law student at Wachemo University, he already spends his summers as the History teacher for junior students in Aseko\'s tutorial class, helping them connect with their subject and build strong study habits.\n\nNurelay believes that understanding history helps young students understand themselves — where their community comes from, and what they\'re capable of building next. Through patient teaching and genuine care, he has become a familiar and trusted face for the students who look forward to his classes each summer.\n\nBalancing his law studies with this commitment, Nurelay shows what it means to lead by example: study hard, then come home and teach harder.',
  },
  {
    name: 'Hamid Orbose',
    dept: '4th Year Nursing Student',
    uni: 'Haramaya University',
    initial: 'H',
    gradient: 'from-cyan-400 to-sky-500',
    ring: 'ring-cyan-500/30',
    tag: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    quote: 'Supporting others isn\'t a side activity for me — it\'s part of who I am.',
    story: 'Hamid Orbose brings the same care he\'s learning to give patients into his work with junior students back home in Aseko. As a 4th-year Nursing student at Haramaya University, Hamid understands the value of patience, attentiveness, and consistent support — qualities that make him a standout teacher during the community\'s summer tutorial classes.\n\nEvery summer, Hamid shows up to teach and support students at different levels, helping them push through academic struggles and stay motivated. Whether it\'s explaining a difficult concept one more time or simply encouraging a student who feels behind, Hamid meets each student where they are.\n\nFor Hamid, teaching and nursing come from the same root: showing up for people, especially when it matters most.',
  },
];

const Landing = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#060a14]">
      <Helmet>
        <title>Arsi Aseko — Student Communication Platform</title>
        <meta name="description" content="The student communication platform for Arsi Aseko University. Share stories, connect with classmates, and build your campus community." />
      </Helmet>

      {/* ═══════ NAV ═══════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#060a14]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <span className="font-black text-[10px]">AAU</span>
            </div>
            <span className="text-sm font-black text-white tracking-tight">Arsi Aseko</span>
          </Link>
          <div className="flex items-center gap-3">
            <a href="#team" className="text-[11px] font-bold text-amber-400/70 hover:text-amber-400 uppercase tracking-widest transition-all hidden sm:block">
              About
            </a>
            <Link to="/login" className="px-5 py-2 text-[11px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-white text-[#060a14] rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-0"
          >
            <img src={heroSlides[currentSlide].image} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-[#060a14]/50" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#060a14] via-[#060a14]/95 to-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#060a14] via-transparent to-[#060a14]/30" />

        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-amber-600/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] font-black text-amber-400 uppercase tracking-[0.25em] mb-8"
            >
              <Sparkles className="w-3.5 h-3.5" /> Free for all students
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-6"
              >
                Your Campus.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                  Your Community.
                </span>
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg mb-10"
              >
                {heroSlides[currentSlide].tagline}
              </motion.p>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/register" className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:from-amber-400 hover:to-orange-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center gap-2">
                Get Started Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#team" className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
                Meet the Team
              </a>
            </motion.div>

            <div className="mt-16 grid grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div className="text-xl md:text-2xl font-black text-white">{s.value}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -5 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="hidden lg:block relative"
          >
            <div className="relative bg-[#0a0f1e]/80 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/8 shadow-2xl">
              <div className="absolute -inset-px bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 rounded-[2.5rem] blur opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-lg">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Arsi Aseko Feed</p>
                    <p className="text-[10px] text-slate-500">Live community activity</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Hana T.', text: 'Just shared my algorithms notes from today\'s lecture. Hope it helps someone!', likes: 24 },
                    { name: 'Dawit M.', text: 'Who\'s joining the study group for the midterm? Room 204, 4pm.', likes: 18 },
                    { name: 'Selam A.', text: 'The campus library just got 200 new engineering textbooks. Let\'s go!', likes: 42 },
                  ].map((post, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-black">
                          {post.name.charAt(0)}
                        </div>
                        <p className="text-xs font-bold text-white">{post.name}</p>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{post.text}</p>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-400" />
                        <span className="text-[10px] text-slate-500">{post.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-6"
          >
            <Zap className="w-3.5 h-3.5" /> Simple Setup
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4"
          >
            Up and running in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">3 steps</span>
          </motion.h2>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-black text-amber-500/20 mb-4">{step.num}</div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4"
            >
              Everything you need,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">nothing you don't</span>
            </motion.h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Built specifically for how university students actually communicate and collaborate.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] group hover:border-amber-500/20 hover:bg-amber-500/[0.03] transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feat.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ MEET THE TEAM ═══════ */}
      <section id="team" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4"
            >
              Meet the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Team</span>
            </motion.h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Students building something that matters.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center text-white text-sm font-black`}>
                    {m.initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{m.name}</p>
                    <p className={`text-[10px] font-bold ${m.text}`}>{m.role}</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mb-2">
                  {m.dept} · {m.uni}
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">{m.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STUDENT STORIES ═══════ */}
      <section id="stories" className="py-24 px-4 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4"
            >
              Student{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Stories</span>
            </motion.h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Real impact from students who give back every summer.
            </p>
          </div>
          <div className="space-y-4">
            {stories.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white text-sm font-black`}>
                    {s.initial}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{s.name}</p>
                    <p className="text-[10px] text-slate-500">{s.dept} · {s.uni}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  {s.story.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx} className="text-slate-400 text-xs leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/[0.04]">
                  <p className="text-amber-400/80 text-xs font-medium italic">
                    &ldquo;{s.quote}&rdquo;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-[2.5rem] bg-gradient-to-br from-amber-500/[0.06] to-orange-500/[0.04] border border-amber-500/15 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">
                Ready to join{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                  your community?
                </span>
              </h2>
              <p className="text-slate-400 text-base mb-8 max-w-md mx-auto">
                Create your free account and start connecting with thousands of Arsi Aseko students today.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:from-amber-400 hover:to-orange-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center gap-2">
                  Sign Up Free <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#stories" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/10 transition-all">
                  Read Stories
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
