import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, BookOpen, CalendarDays, Camera, Megaphone, MessageCircle,
  Sparkles, Users, CreditCard, Compass, GraduationCap, Plus, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const destinations = [
  {
    title: 'Academic resources',
    description: 'Find learning materials and share useful resources with classmates.',
    icon: BookOpen,
    to: '/library',
    accent: 'from-blue-500/20 to-cyan-500/5',
    iconColor: 'text-blue-300',
    tag: 'LEARN',
  },
  {
    title: 'Campus events',
    description: 'Keep up with activities, meetups, and what is happening around campus.',
    icon: CalendarDays,
    to: '/events',
    accent: 'from-violet-500/20 to-fuchsia-500/5',
    iconColor: 'text-violet-300',
    tag: 'TAKE PART',
  },
  {
    title: 'Campus gallery',
    description: 'Explore moments, memories, and stories from the university community.',
    icon: Camera,
    to: '/gallery',
    accent: 'from-amber-500/20 to-orange-500/5',
    iconColor: 'text-amber-300',
    tag: 'DISCOVER',
  },
  {
    title: 'Announcements',
    description: 'Catch important updates and notices from the university community.',
    icon: Megaphone,
    to: '/announcements',
    accent: 'from-emerald-500/20 to-teal-500/5',
    iconColor: 'text-emerald-300',
    tag: 'STAY INFORMED',
  },
  {
    title: 'Student network',
    description: 'Search for classmates, connect with peers, and start conversations.',
    icon: Users,
    to: '/search',
    accent: 'from-pink-500/20 to-rose-500/5',
    iconColor: 'text-pink-300',
    tag: 'CONNECT',
  },
  {
    title: 'Digital student ID',
    description: 'Open your student identity card and keep it close when you need it.',
    icon: CreditCard,
    to: '/virtual-id',
    accent: 'from-sky-500/20 to-indigo-500/5',
    iconColor: 'text-sky-300',
    tag: 'YOUR CAMPUS ID',
  },
];

const CampusHub = () => (
  <div className="mx-auto max-w-5xl space-y-8 pb-24">
    <Helmet>
      <title>Campus Hub | Arsi Aseko University</title>
      <meta name="description" content="Discover campus resources, events, announcements, and ways to connect with the Arsi Aseko University community." />
    </Helmet>

    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-[#080f22] shadow-2xl shadow-blue-950/20"
    >
      <div className="absolute inset-0 -z-20">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1800&q=85"
          alt=""
          className="h-full w-full object-cover opacity-35"
          loading="eager"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070b18] via-[#070b18]/90 to-[#101b35]/45" />
      <div className="absolute -right-12 -top-20 -z-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:p-12">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
            <Sparkles className="h-3.5 w-3.5" />
            Your student experience, elevated
          </div>
          <h1 className="max-w-xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your campus.
            <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
              One connected community.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Find the tools, updates, and people that make university life easier.
            Learn something new, join the conversation, and make your campus experience count.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/create-post"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              <Plus className="h-4 w-4" /> Share with campus
            </Link>
            <Link
              to="/academic-calendar"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Academic calendar <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="ml-auto max-w-xs rounded-3xl border border-white/15 bg-slate-950/45 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-200">Made for students</span>
            </div>
            <h2 className="mt-5 text-lg font-bold text-white">Make campus yours</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              One place for academic life, campus updates, and meaningful connections.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-blue-200">
              Explore your hub <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.section>

    <section>
      <div className="mb-5 flex items-end justify-between gap-4 px-1">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-300">Explore the platform</p>
          <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">Everything you need, in one place</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Jump straight into the spaces that help you learn, participate, and stay connected.</p>
        </div>
        <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:block">
          <Compass className="h-5 w-5 text-blue-300" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {destinations.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
            >
              <Link
                to={item.to}
                className="group flex h-full min-h-52 flex-col rounded-2xl border border-white/[0.08] bg-[#0b1223] p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-400/25 hover:shadow-xl hover:shadow-blue-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-gradient-to-br ${item.accent}`}>
                    <Icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-300" />
                </div>
                <span className="mt-5 text-[9px] font-bold tracking-[0.18em] text-slate-500">{item.tag}</span>
                <h3 className="mt-1 text-base font-bold text-white transition group-hover:text-blue-200">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{item.description}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>

    <section className="relative overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-r from-blue-950/70 via-[#111b34] to-violet-950/40 p-6 sm:p-8">
      <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
            <MessageCircle className="h-4 w-4" /> Your voice matters
          </div>
          <h2 className="text-xl font-black text-white sm:text-2xl">Have an idea worth sharing?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Start a discussion, ask a question, or share a helpful discovery with your fellow students.</p>
        </div>
        <Link to="/" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
          Visit student feed <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  </div>
);

export default CampusHub;
