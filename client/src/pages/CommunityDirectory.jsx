import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, MapPin, BookOpen, Mail, Linkedin, MapPinIcon } from 'lucide-react';

const CommunityDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');

  // Sample community members data
  const members = [
    {
      id: 1,
      name: 'Abebe Wolde',
      university: 'Addis Ababa University',
      program: 'Computer Science',
      year: '4th Year',
      specialization: 'AI & Machine Learning',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      bio: 'Tech enthusiast building the future',
      email: 'abebe@example.com',
      expertise: ['Python', 'Machine Learning', 'Web Dev']
    },
    {
      id: 2,
      name: 'Fiona Getnet',
      university: 'Jimma University',
      program: 'Medical Sciences',
      year: '3rd Year',
      specialization: 'Surgery',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      bio: 'Passionate healthcare professional',
      email: 'fiona@example.com',
      expertise: ['Clinical Medicine', 'Research', 'Patient Care']
    },
    {
      id: 3,
      name: 'Kedir Assefa',
      university: 'Hawassa University',
      program: 'Engineering',
      year: '2nd Year',
      specialization: 'Civil Engineering',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      bio: 'Building infrastructure for tomorrow',
      email: 'kedir@example.com',
      expertise: ['Infrastructure', 'CAD', 'Project Management']
    },
    {
      id: 4,
      name: 'Meskerem Teklemariam',
      university: 'Bahir Dar University',
      program: 'Business Administration',
      year: '4th Year',
      specialization: 'Entrepreneurship',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
      bio: 'Startup founder & community builder',
      email: 'meskerem@example.com',
      expertise: ['Entrepreneurship', 'Marketing', 'Finance']
    },
    {
      id: 5,
      name: 'Desta Yemane',
      university: 'University of Gondar',
      program: 'Law',
      year: '3rd Year',
      specialization: 'Constitutional Law',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      bio: 'Future advocate for justice',
      email: 'desta@example.com',
      expertise: ['Constitutional Law', 'Human Rights', 'Legal Research']
    },
    {
      id: 6,
      name: 'Aisha Ibrahim',
      university: 'Addis Ababa University',
      program: 'Biology',
      year: '2nd Year',
      specialization: 'Biotechnology',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      bio: 'Exploring biological innovations',
      email: 'aisha@example.com',
      expertise: ['Biotechnology', 'Research', 'Lab Work']
    },
    {
      id: 7,
      name: 'Tadesse Kebede',
      university: 'Mekelle University',
      program: 'Education',
      year: '4th Year',
      specialization: 'Educational Management',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      bio: 'Building better educational futures',
      email: 'tadesse@example.com',
      expertise: ['Education', 'Leadership', 'Curriculum Design']
    },
    {
      id: 8,
      name: 'Hiwot Dibaba',
      university: 'Dire Dawa University',
      program: 'Economics',
      year: '3rd Year',
      specialization: 'Development Economics',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
      bio: 'Economist building sustainable growth',
      email: 'hiwot@example.com',
      expertise: ['Economics', 'Data Analysis', 'Policy Research']
    }
  ];

  // Get unique values for filters
  const universities = [...new Set(members.map(m => m.university))];
  const programs = [...new Set(members.map(m => m.program))];

  // Filter members based on search and selected filters
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesUniversity = !selectedUniversity || member.university === selectedUniversity;
      const matchesProgram = !selectedProgram || member.program === selectedProgram;

      return matchesSearch && matchesUniversity && matchesProgram;
    });
  }, [searchQuery, selectedUniversity, selectedProgram]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24">
      <Helmet>
        <title>Community Directory | Arsi Aseko University</title>
        <meta name="description" content="Connect with Arsi Aseko students across Ethiopian universities" />
      </Helmet>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] p-8 lg:p-12 mb-12 overflow-hidden bg-gradient-to-br from-[#0d1428] via-[#1a1f3a] to-[#0d1428] border border-white/[0.05]"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]"></div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Directory</span>
          </h1>
          <p className="text-slate-300 text-lg font-medium mb-2">
            Meet brilliant Arsi Aseko students across Ethiopian universities
          </p>
          <p className="text-slate-400 text-sm">
            Connect with peers, find mentors, and build meaningful professional relationships with your community.
          </p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="mb-10 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, specialization, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.1] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-slate-400 focus:text-white focus:bg-white/[0.05] focus:border-emerald-500/40 outline-none transition-all"
          >
            <option value="">All Universities</option>
            {universities.map(uni => (
              <option key={uni} value={uni}>{uni}</option>
            ))}
          </select>

          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 px-4 text-slate-400 focus:text-white focus:bg-white/[0.05] focus:border-emerald-500/40 outline-none transition-all"
          >
            <option value="">All Programs</option>
            {programs.map(prog => (
              <option key={prog} value={prog}>{prog}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-8 text-sm text-slate-500 font-medium">
        Showing <span className="text-emerald-400 font-bold">{filteredMembers.length}</span> of <span className="text-slate-400">{members.length}</span> members
      </div>

      {/* Members Grid */}
      {filteredMembers.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMembers.map(member => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              className="relative rounded-[1.5rem] p-6 bg-gradient-to-br from-[#0a0f1e] to-[#060a14] border border-white/[0.05] hover:border-emerald-500/30 transition-all group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>

              <div className="relative z-10">
                {/* Profile Image and Info */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 group-hover:border-emerald-500/30 transition-all"
                  />
                  <div className="flex-1">
                    <h3 className="font-black text-white text-sm">{member.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">{member.year}</p>
                  </div>
                </div>

                {/* University and Program */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500/60" />
                    {member.university}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500/60" />
                    {member.program}
                  </div>
                </div>

                {/* Specialization */}
                <p className="text-xs text-slate-300 font-medium mb-4 italic">
                  {member.specialization}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {member.expertise.slice(0, 2).map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.expertise.length > 2 && (
                    <span className="px-2 py-1 rounded-lg bg-slate-500/10 border border-slate-500/20 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      +{member.expertise.length - 2}
                    </span>
                  )}
                </div>

                {/* Bio */}
                <p className="text-[12px] text-slate-400 mb-4 line-clamp-2">
                  {member.bio}
                </p>

                {/* Contact Actions */}
                <div className="flex gap-2">
                  <button
                    className="flex-1 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-widest transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 mx-auto" />
                  </button>
                  <button
                    className="flex-1 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-widest transition-all"
                  >
                    <Linkedin className="w-3.5 h-3.5 mx-auto" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <p className="text-slate-400 font-medium mb-2">No members found matching your search</p>
          <p className="text-slate-600 text-sm">Try adjusting your filters or search query</p>
        </motion.div>
      )}
    </div>
  );
};

export default CommunityDirectory;
