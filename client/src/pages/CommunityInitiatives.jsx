import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, Users, Award, Zap, BookOpen, Heart, MapPin, ArrowRight } from 'lucide-react';

const CommunityInitiatives = () => {
  const initiatives = [
    {
      id: 1,
      title: 'Annual Arsi Aseko Convention',
      icon: Users,
      date: 'July 15-18, 2024',
      location: 'Addis Ababa',
      description: 'Bring together Arsi Aseko students from across Ethiopian universities for networking, knowledge sharing, and cultural celebration.',
      highlights: [
        'Panel discussions with successful alumni',
        'Networking sessions and mentorship programs',
        'Cultural celebration and community bonding',
        'Career fair with major employers'
      ],
      status: 'upcoming',
      attendees: '400+'
    },
    {
      id: 2,
      title: 'Scholarship & Excellence Fund',
      icon: Award,
      date: 'Ongoing',
      location: 'Nationwide',
      description: 'Support academically excellent but financially challenged Arsi Aseko students in pursuing their dreams without financial burden.',
      highlights: [
        '50 scholarships awarded annually',
        'Mentorship from scholarship holders',
        'Career guidance and placement support',
        'Alumni contribution program'
      ],
      status: 'active',
      impact: '150+ students supported'
    },
    {
      id: 3,
      title: 'Mentorship Circle Program',
      icon: Heart,
      date: 'Monthly',
      location: 'Virtual & Physical',
      description: 'Connect experienced professionals and alumni with current students for guidance, career development, and personal growth.',
      highlights: [
        '1-on-1 mentoring sessions',
        'Monthly group discussions',
        'Industry exposure programs',
        'Resume and interview coaching'
      ],
      status: 'active',
      mentors: '80+ mentors'
    },
    {
      id: 4,
      title: 'Innovation & Entrepreneurship Hub',
      icon: Zap,
      date: 'Rolling Program',
      location: 'Addis Ababa & Regional Hubs',
      description: 'Incubate and support startup ideas from Arsi Aseko students with mentorship, funding, and resources.',
      highlights: [
        'Startup ideation workshops',
        'Seed funding opportunities',
        'Business mentorship and coaching',
        'Technology and infrastructure support'
      ],
      status: 'active',
      startups: '25+ startups'
    },
    {
      id: 5,
      title: 'Knowledge Sharing Sessions',
      icon: BookOpen,
      date: 'Weekly',
      location: 'Virtual',
      description: 'Regular webinars and discussions where students share knowledge, skills, and experiences across different fields of study.',
      highlights: [
        'Expert speakers from various fields',
        'Student-led presentations',
        'Study group collaborations',
        'Research discussion forums'
      ],
      status: 'active',
      participants: '1000+ monthly'
    },
    {
      id: 6,
      title: 'Community Service Initiatives',
      icon: Heart,
      date: 'Quarterly',
      location: 'Arsi Region & Communities',
      description: 'Give back to communities through educational support, healthcare initiatives, and infrastructure development projects.',
      highlights: [
        'Educational outreach programs',
        'Healthcare awareness campaigns',
        'Environmental conservation',
        'Skills training for youth'
      ],
      status: 'active',
      beneficiaries: '5000+ annually'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-24">
      <Helmet>
        <title>Community Initiatives | Arsi Aseko University</title>
        <meta name="description" content="Arsi Aseko student community initiatives, events, and programs" />
      </Helmet>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] p-8 lg:p-16 mb-16 overflow-hidden bg-gradient-to-br from-[#0d1428] via-[#1a1f3a] to-[#0d1428] border border-white/[0.05] shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6 mb-8">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Community Initiatives
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
            Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-400">Tomorrow Together</span>
          </h1>
          <p className="text-slate-300 text-lg font-medium leading-relaxed mb-4">
            Arsi Aseko students are creating real impact through community-driven initiatives that support education, entrepreneurship, and social development.
          </p>
          <p className="text-slate-400 text-sm">
            From mentorship programs to innovation hubs, our community is investing in each other's success and creating opportunities that last a lifetime.
          </p>
        </div>
      </motion.div>

      {/* Impact Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
      >
        {[
          { label: 'Active Programs', value: '6' },
          { label: 'Participants', value: '2000+' },
          { label: 'Mentors', value: '80+' },
          { label: 'Lives Impacted', value: '5000+' }
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-[1.5rem] bg-gradient-to-br from-[#0d1428] to-[#0a0f1e] border border-white/[0.05] text-center"
          >
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-2">
              {stat.value}
            </p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Initiatives List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-6"
      >
        {initiatives.map((initiative) => {
          const IconComponent = initiative.icon;
          const statusColor = initiative.status === 'upcoming' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';

          return (
            <motion.div
              key={initiative.id}
              variants={itemVariants}
              className="relative rounded-[2rem] p-8 bg-gradient-to-br from-[#0d1428] via-[#0a0f1e] to-[#060a14] border border-white/[0.05] hover:border-emerald-500/30 transition-all group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                      <IconComponent className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2">{initiative.title}</h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1 text-[12px] text-slate-400 font-medium">
                          <Calendar className="w-3.5 h-3.5" /> {initiative.date}
                        </div>
                        <div className="flex items-center gap-1 text-[12px] text-slate-400 font-medium">
                          <MapPin className="w-3.5 h-3.5" /> {initiative.location}
                        </div>
                        <span className={`px-3 py-1 rounded-lg ${statusColor} text-[10px] font-bold uppercase tracking-widest`}>
                          {initiative.status === 'upcoming' ? 'Coming Soon' : 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 font-medium mb-6 leading-relaxed">
                  {initiative.description}
                </p>

                {/* Highlights */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Key Highlights</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {initiative.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm text-slate-300">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact Metric */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-sm text-slate-400 font-medium">
                    {Object.entries(initiative)
                      .filter(([key]) => !['id', 'title', 'icon', 'date', 'location', 'description', 'highlights', 'status'].includes(key))
                      .map(([key, value]) => `${value} ${key.replace(/([A-Z])/g, ' $1').trim()}`)[0]
                    }
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-500/60 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 p-10 rounded-[2rem] bg-gradient-to-r from-emerald-500/10 via-purple-500/5 to-blue-500/10 border border-emerald-500/20 text-center"
      >
        <h3 className="text-2xl font-black text-white mb-4">Want to Get Involved?</h3>
        <p className="text-slate-300 font-medium mb-6 max-w-2xl mx-auto leading-relaxed">
          Whether you want to participate, mentor, or lead an initiative, there's a place for you in our community. Join thousands of Arsi Aseko students making a difference.
        </p>
        <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm uppercase tracking-widest transition-all active:scale-95">
          Get Involved
        </button>
      </motion.div>
    </div>
  );
};

export default CommunityInitiatives;
