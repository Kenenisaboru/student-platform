import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, Search, MessageSquare, CheckCircle2, Clock, Star, Loader2, User, Mail, Building } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../context/AuthContext';

const MentorshipProgram = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    goals: '',
    interests: '',
  });
  const [activeTab, setActiveTab] = useState('mentors');

  useEffect(() => {
    fetchMentorsAndMatches();
  }, []);

  const fetchMentorsAndMatches = async () => {
    try {
      setLoading(true);
      const [mentorsRes, matchesRes] = await Promise.all([
        API.get('/mentorship/mentors'),
        API.get('/mentorship/user/matches'),
      ]);
      setMentors(mentorsRes.data || []);
      setMatches(matchesRes.data || []);
    } catch (error) {
      toast.error('Failed to load mentorship data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async (mentorId) => {
    if (!requestData.goals.trim() || !requestData.interests.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await API.post('/mentorship/request', {
        mentorId,
        goals: requestData.goals.split(',').map(g => g.trim()),
        interests: requestData.interests.split(',').map(i => i.trim()),
      });

      toast.success('Mentorship request sent!');
      setRequestData({ goals: '', interests: '' });
      setShowRequestForm(false);
      setSelectedMentor(null);
      fetchMentorsAndMatches();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send request');
    }
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
      <Helmet>
        <title>Mentorship Program | Arsi Aseko</title>
        <meta name="description" content="Connect with mentors and grow in your academic and professional journey." />
      </Helmet>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
          <h1 className="text-4xl font-black text-white">Mentorship Program</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Find experienced mentors to guide your academic journey and professional growth.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 mb-10 border-b border-white/[0.05]"
      >
        {['mentors', 'matches'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-bold uppercase tracking-widest text-sm transition-all border-b-2 ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'mentors' ? 'Browse Mentors' : 'My Matches'}
          </button>
        ))}
      </motion.div>

      {/* Browse Mentors Tab */}
      {activeTab === 'mentors' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Search */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 bg-gradient-to-br from-[#0d1428]/80 to-[#060a14]/80 border border-white/[0.05] rounded-2xl px-6 py-4 backdrop-blur-xl">
              <Search className="w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search mentors by name or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
              />
            </div>
          </motion.div>

          {/* Mentor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMentors.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-[#0a0f1e]/50 rounded-2xl border border-white/[0.05]">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No mentors found</p>
              </div>
            ) : (
              filteredMentors.map((mentor, idx) => (
                <motion.div
                  key={mentor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedMentor(mentor)}
                  className="bg-gradient-to-br from-[#0d1428]/80 to-[#060a14]/80 border border-white/[0.05] rounded-2xl p-6 backdrop-blur-xl hover:border-emerald-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">{mentor.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-amber-400 font-bold">4.8 (24 reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-4">{mentor.bio || 'Experienced mentor'}</p>

                  {/* Expertise Tags */}
                  {mentor.expertise && mentor.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.expertise.slice(0, 3).map((exp, eidx) => (
                        <span key={eidx} className="px-2 py-1 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-4 border-b border-white/[0.05]">
                    <span>Response time: ~2 hours</span>
                    <span>25 mentees</span>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMentor(mentor);
                      setShowRequestForm(true);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                  >
                    Request Mentorship
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* My Matches Tab */}
      {activeTab === 'matches' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-6">
            {matches.length === 0 ? (
              <div className="text-center py-12 bg-[#0a0f1e]/50 rounded-2xl border border-white/[0.05]">
                <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-medium mb-4">No active mentorship matches yet</p>
                <Button
                  onClick={() => setActiveTab('mentors')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Find a Mentor
                </Button>
              </div>
            ) : (
              matches.map((match, idx) => {
                const isMentor = match.mentor.userId._id === user?._id;
                const otherUser = isMentor ? match.mentee.userId : match.mentor.userId;

                return (
                  <motion.div
                    key={match._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-gradient-to-br from-[#0d1428]/80 to-[#060a14]/80 border border-white/[0.05] rounded-2xl p-6 backdrop-blur-xl"
                  >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <User className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-white">{otherUser.name}</h3>
                          <p className="text-xs text-slate-400">{isMentor ? 'Mentee' : 'Mentor'}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-widest ${
                        match.status === 'active'
                          ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                          : match.status === 'pending'
                          ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                          : 'bg-slate-500/20 border-slate-500/30 text-slate-400'
                      }`}>
                        {match.status === 'active' && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                        {match.status}
                      </div>
                    </div>

                    {/* Details */}
                    {match.status === 'active' && (
                      <div className="space-y-4 pt-4 border-t border-white/[0.05]">
                        {!isMentor && match.mentee.goals && (
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Goals</p>
                            <div className="flex flex-wrap gap-2">
                              {match.mentee.goals.map((goal, gidx) => (
                                <span key={gidx} className="px-3 py-1.5 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                                  {goal}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {match.meetingNotes && match.meetingNotes.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Recent Progress</p>
                            <div className="text-sm text-slate-400 bg-white/[0.02] border border-white/[0.05] rounded-lg p-3">
                              {match.meetingNotes[match.meetingNotes.length - 1].progress}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    {match.status === 'pending' && isMentor && (
                      <div className="flex gap-3 mt-6 pt-6 border-t border-white/[0.05]">
                        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg">
                          Accept Request
                        </Button>
                        <Button variant="outline" className="flex-1 bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold rounded-lg">
                          Decline
                        </Button>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      )}

      {/* Request Form Modal */}
      {showRequestForm && selectedMentor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowRequestForm(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#0d1428] to-[#060a14] border border-white/[0.05] rounded-2xl p-8 max-w-md w-full backdrop-blur-xl"
          >
            <h3 className="text-2xl font-black text-white mb-2">Request Mentorship</h3>
            <p className="text-slate-400 text-sm mb-6">Connect with {selectedMentor.name}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Your Goals (comma separated)</label>
                <Input
                  placeholder="e.g., learn new skills, career guidance..."
                  value={requestData.goals}
                  onChange={(e) => setRequestData({ ...requestData, goals: e.target.value })}
                  className="bg-white/[0.02] border-white/[0.05] text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Your Interests (comma separated)</label>
                <Input
                  placeholder="e.g., technology, business, design..."
                  value={requestData.interests}
                  onChange={(e) => setRequestData({ ...requestData, interests: e.target.value })}
                  className="bg-white/[0.02] border-white/[0.05] text-white placeholder:text-slate-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleRequestMentorship(selectedMentor._id)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Send Request
                </Button>
                <Button
                  onClick={() => setShowRequestForm(false)}
                  variant="outline"
                  className="flex-1 bg-white/[0.05] border-white/10 hover:bg-white/[0.1] text-white font-bold rounded-lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MentorshipProgram;
