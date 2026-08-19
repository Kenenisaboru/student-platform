import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Shield, Share2, Heart, Bell, BookOpen, Quote, Code, GraduationCap, Globe } from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'Share & Discuss',
    desc: 'Write posts about your academic journey, ask questions, and spark meaningful conversations with fellow students.',
  },
  {
    icon: Heart,
    title: 'React & Engage',
    desc: 'Like, comment, and repost content that resonates with you. Build a feed that reflects your interests.',
  },
  {
    icon: Share2,
    title: 'Repost & Quote',
    desc: 'Share someone else\'s post with your own perspective. Spread knowledge across the community.',
  },
  {
    icon: MessageCircle,
    title: 'Direct Messages',
    desc: 'Chat one-on-one or create group conversations with classmates. Stay connected beyond the feed.',
  },
  {
    icon: Bell,
    title: 'Stay Updated',
    desc: 'Get notified when someone likes your post, comments, follows you, or sends you a message.',
  },
  {
    icon: Shield,
    title: 'Your Digital ID',
    desc: 'Carry a verified student identity card right on your phone. Access it anytime, anywhere.',
  },
];

const team = [
  {
    name: 'Kenenisa Boru',
    role: 'Platform Architect',
    university: 'Haramaya University',
    department: 'CIS, 4th Year',
    color: 'bg-blue-500',
    bio: 'Full-stack software developer and the architect behind this very platform — turning code into a digital home for Arsi Aseko students.',
  },
  {
    name: 'Ibrahim Jemal',
    role: 'Community Architect',
    university: 'Haramaya University',
    department: 'C1 Medical Student',
    color: 'bg-emerald-500',
    bio: 'Founding architect of the community\'s summer tutorial program — turning a small circle of friends into a lasting engine of academic support for Aseko\'s youth.',
  },
];

const stories = [
  {
    name: 'Ibrahim Jemal',
    department: 'C1 Medical Student',
    university: 'Haramaya University',
    color: 'bg-emerald-500',
    quote: 'If I can help one more student stay in school and believe in themselves, then everything I do is worth it.',
    story: 'Ibrahim Jemal always believed that success means little if it isn\'t shared. While pursuing his dream of becoming a doctor as a C1 medical student at Haramaya University, he never forgot the students walking the same path he once walked back home in Aseko.\n\nA few years ago, together with a handful of close friends, Ibrahim started something simple but powerful: a free summer tutorial class for junior students in the community. What began as a small gathering of a few motivated friends has grown into one of the most trusted academic support programs for Arsi Aseko\'s younger generation.\n\nEvery summer, while most university students rest, Ibrahim returns home to teach, mentor, and encourage students who need it most — helping them build confidence, close learning gaps, and believe in bigger futures for themselves. He doesn\'t just teach subjects; he teaches students how to dream beyond their circumstances.\n\nFor Ibrahim, medicine and mentorship come from the same place: a deep commitment to healing and building his community, one student at a time.',
  },
  {
    name: 'Gutema Aman',
    department: 'C2 Medical Student',
    university: 'Haramaya University',
    color: 'bg-purple-500',
    quote: 'Every child with potential deserves someone who sees it and helps them chase it.',
    story: 'Gutema Aman\'s journey as a medical student at Haramaya University is matched only by his dedication to lifting up the students coming up behind him. As one of the founders of the summer tutorial class, Gutema has spent years helping junior students across Aseko strengthen their academics and stay on track.\n\nBut Gutema\'s impact goes even further. He has become a trusted guide for Grade 8 students with strong academic potential, personally supporting and preparing top scorers to compete for placement in Oromia\'s special boarding schools — opportunities that can change the entire trajectory of a young student\'s life.\n\nBalancing the demands of medical school with this responsibility isn\'t easy, but Gutema sees it as part of the same calling: identifying talent, nurturing it, and opening doors that might otherwise stay closed. For many students in Aseko, Gutema isn\'t just a tutor — he\'s the reason they believed they could reach further.',
  },
  {
    name: 'Abdela Omer',
    department: '5th Year Law Student',
    university: 'Wachemo University',
    color: 'bg-amber-500',
    quote: 'A community grows stronger when its students choose to come back and build, not just leave and forget.',
    story: 'Abdela Omer wears two hats with equal dedication: that of a future lawyer and that of a devoted community organizer. As a 5th-year Law student at Wachemo University, he has spent his years away from home building the skills to advocate and lead — skills he brings straight back to Aseko every summer.\n\nAs the organizing force behind the community\'s summer tutorial class, Abdela does far more than teach Geography to junior students. He coordinates schedules, brings teachers together, and makes sure the program runs smoothly year after year — turning a simple idea into a dependable tradition the community can count on.\n\nFor Abdela, leadership isn\'t about titles; it\'s about showing up consistently for the students who need guidance the most, and making sure no junior student in Aseko is left without support during the summer break.',
  },
  {
    name: 'Nurelay Mohammed',
    department: '4th Year Law Student',
    university: 'Wachemo University',
    color: 'bg-rose-500',
    quote: 'Knowledge means more when it\'s shared — that\'s why I come back every summer.',
    story: 'Nurelay Mohammed is proof that giving back doesn\'t require waiting until graduation. As a 4th-year Law student at Wachemo University, he already spends his summers as the History teacher for junior students in Aseko\'s tutorial class, helping them connect with their subject and build strong study habits.\n\nNurelay believes that understanding history helps young students understand themselves — where their community comes from, and what they\'re capable of building next. Through patient teaching and genuine care, he has become a familiar and trusted face for the students who look forward to his classes each summer.\n\nBalancing his law studies with this commitment, Nurelay shows what it means to lead by example: study hard, then come home and teach harder.',
  },
  {
    name: 'Hamid Orbose',
    department: '4th Year Nursing Student',
    university: 'Haramaya University',
    color: 'bg-cyan-500',
    quote: 'Supporting others isn\'t a side activity for me — it\'s part of who I am.',
    story: 'Hamid Orbose brings the same care he\'s learning to give patients into his work with junior students back home in Aseko. As a 4th-year Nursing student at Haramaya University, Hamid understands the value of patience, attentiveness, and consistent support — qualities that make him a standout teacher during the community\'s summer tutorial classes.\n\nEvery summer, Hamid shows up to teach and support students at different levels, helping them push through academic struggles and stay motivated. Whether it\'s explaining a difficult concept one more time or simply encouraging a student who feels behind, Hamid meets each student where they are.\n\nFor Hamid, teaching and nursing come from the same root: showing up for people, especially when it matters most.',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const PlatformAbout = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-24">
      <Helmet>
        <title>About This Platform | Arsi Aseko</title>
        <meta name="description" content="Learn about the Arsi Aseko student communication platform — built by students, for students. Meet the team and read real student stories." />
      </Helmet>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6">
          <BookOpen className="w-3.5 h-3.5" />
          About This Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-5">
          Built by Students,{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
            for Students
          </span>
        </h1>
        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
          Arsi Aseko's student communication platform — a place to share stories, ask questions, collaborate on ideas, and stay connected with your community.
        </p>
      </motion.div>

      {/* What This Platform Does */}
      <motion.section {...fadeInUp} transition={{ delay: 0.2 }} className="mb-16">
        <h2 className="text-2xl font-black text-white tracking-tight mb-8">What You Can Do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.07 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] group hover:border-blue-500/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feat.icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16 p-8 rounded-3xl bg-linear-to-br from-blue-900/20 to-transparent border border-blue-500/10"
      >
        <h2 className="text-2xl font-black text-white tracking-tight mb-6">How It Works</h2>
        <div className="space-y-5">
          {[
            { step: '1', text: 'Sign up with your university email and create your student profile.' },
            { step: '2', text: 'Browse the feed, follow classmates, and explore departments and topics.' },
            { step: '3', text: 'Create posts, share resources, start conversations, and build your network.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-[11px] font-black text-blue-400">
                {item.step}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed pt-1">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Meet the Team */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-8">
          <Code className="w-5 h-5 text-blue-400" />
          <h2 className="text-2xl font-black text-white tracking-tight">Meet the Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${member.color} rounded-full flex items-center justify-center text-white text-lg font-black`}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{member.name}</p>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{member.role}</p>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                <GraduationCap className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                {member.department} &middot; {member.university}
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Student Stories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-8">
          <Quote className="w-5 h-5 text-blue-400" />
          <h2 className="text-2xl font-black text-white tracking-tight">Student Stories</h2>
        </div>
        <div className="space-y-6">
          {stories.map((story, idx) => (
            <motion.article
              key={story.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.08 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${story.color} rounded-full flex items-center justify-center text-white text-sm font-black`}>
                  {story.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{story.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {story.department} &middot; {story.university}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                {story.story.split('\n\n').map((para, pIdx) => (
                  <p key={pIdx} className="text-slate-400 text-sm leading-relaxed mb-3 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
              <div className="pt-4 border-t border-white/[0.04]">
                <p className="text-blue-400 text-sm font-bold italic flex items-start gap-2">
                  <span className="text-blue-500/40 text-lg leading-none mt-0.5">&ldquo;</span>
                  {story.quote}
                  <span className="text-blue-500/40 text-lg leading-none mt-0.5">&rdquo;</span>
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center py-10 px-8 rounded-3xl bg-white/[0.02] border border-white/[0.06]"
      >
        <h3 className="text-xl font-black text-white mb-3">Ready to Join?</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
          Create your account and start connecting with students across the Arsi Aseko community today.
        </p>
        <a
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#060a14] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95"
        >
          Get Started
        </a>
      </motion.div>
    </div>
  );
};

export default PlatformAbout;
