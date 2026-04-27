import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Calendar, Search, Filter, ExternalLink, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const JobOpportunityBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [appliedJobs, setAppliedJobs] = useState([]);

  const jobTypes = ['all', 'Job', 'Internship', 'Scholarship', 'Contract', 'Fellowship'];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchQuery, selectedType]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/jobs');
      setJobs(res.data);
    } catch (error) {
      toast.error('Failed to load job opportunities');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (selectedType !== 'all') {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const handleApply = async (jobId) => {
    try {
      await API.post(`/jobs/${jobId}/apply`);
      setAppliedJobs([...appliedJobs, jobId]);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply');
    }
  };

  const typeColors = {
    Job: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    Internship: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    Scholarship: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    Contract: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
    Fellowship: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
  };

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
        <title>Job Opportunities | Arsi Aseko</title>
        <meta name="description" content="Discover jobs, internships, and opportunities for Arsi Aseko students." />
      </Helmet>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
          <h1 className="text-4xl font-black text-white">Job Opportunities</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Explore jobs, internships, scholarships, and career opportunities tailored for Arsi Aseko students.
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#0d1428]/80 to-[#060a14]/80 border border-white/[0.05] rounded-2xl p-6 mb-10 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search jobs, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/[0.02] border-white/[0.05] text-white placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {jobTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-all ${
                selectedType === type
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                  : 'bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:border-white/10'
              }`}
            >
              {type === 'all' ? '📌 All' : type}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-[#0a0f1e]/50 rounded-2xl border border-white/[0.05]"
          >
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No opportunities found</p>
          </motion.div>
        ) : (
          filteredJobs.map((job, idx) => {
            const isApplied = appliedJobs.includes(job._id);
            const daysLeft = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));

            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gradient-to-br from-[#0d1428]/80 to-[#060a14]/80 border border-white/[0.05] rounded-2xl p-6 backdrop-blur-xl hover:border-white/[0.1] transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">{job.title}</h3>
                        <p className="text-sm font-bold text-slate-400">{job.company}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${typeColors[job.type]}`}>
                    {job.type}
                  </div>
                </div>

                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{job.description}</p>

                {/* Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-white/[0.05]">
                  {job.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="text-xs text-slate-400">{job.location}</span>
                    </div>
                  )}
                  {job.salary && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-slate-500" />
                      <span className="text-xs text-slate-400">{job.salary.min}-{job.salary.max}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-400">{daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-400">{job.applicants?.length || 0} applied</span>
                  </div>
                </div>

                {/* Tags */}
                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag, tidx) => (
                      <span key={tidx} className="px-3 py-1 text-xs font-bold bg-white/[0.05] border border-white/[0.05] text-slate-400 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                <Button
                  onClick={() => handleApply(job._id)}
                  disabled={isApplied}
                  className={`w-full font-bold transition-all ${
                    isApplied
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Applied
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Apply Now
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobOpportunityBoard;
