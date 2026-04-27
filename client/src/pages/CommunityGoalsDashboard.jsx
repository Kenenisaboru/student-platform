import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Users, Award, BookOpen, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CommunityGoalsDashboard = () => {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoalsAndStats();
  }, []);

  const fetchGoalsAndStats = async () => {
    try {
      setLoading(true);
      const [goalsRes, statsRes] = await Promise.all([
        API.get('/community-goals'),
        API.get('/community-goals/stats'),
      ]);

      setGoals(goalsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load community goals');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    Members: Users,
    Placements: TrendingUp,
    Scholarships: Award,
    Projects: BookOpen,
    Events: Zap,
    Resources: Target,
  };

  const categoryColors = {
    Members: 'from-blue-500/20 to-blue-600/10',
    Placements: 'from-emerald-500/20 to-emerald-600/10',
    Scholarships: 'from-purple-500/20 to-purple-600/10',
    Projects: 'from-orange-500/20 to-orange-600/10',
    Events: 'from-pink-500/20 to-pink-600/10',
    Resources: 'from-cyan-500/20 to-cyan-600/10',
  };

  const borderColors = {
    Members: 'border-blue-500/30',
    Placements: 'border-emerald-500/30',
    Scholarships: 'border-purple-500/30',
    Projects: 'border-orange-500/30',
    Events: 'border-pink-500/30',
    Resources: 'border-cyan-500/30',
  };

  const textColors = {
    Members: 'text-blue-400',
    Placements: 'text-emerald-400',
    Scholarships: 'text-purple-400',
    Projects: 'text-orange-400',
    Events: 'text-pink-400',
    Resources: 'text-cyan-400',
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
        <title>Community Goals Dashboard | Arsi Aseko</title>
        <meta name="description" content="Track the progress of our Arsi Aseko community goals and achievements." />
      </Helmet>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
          <h1 className="text-4xl font-black text-white">Community Goals</h1>
        </div>
        <p className="text-slate-400 text-lg max-w-2xl">
          Together, we're building a stronger Arsi Aseko community. Track our collective progress toward meaningful milestones.
        </p>
      </motion.div>

      {/* Statistics Overview */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {[
            { label: 'Total Members', value: stats.totalMembers || 0, icon: Users },
            { label: 'Placements', value: stats.successfulPlacements || 0, icon: TrendingUp },
            { label: 'Scholarships', value: stats.scholarshipsAwarded || 0, icon: Award },
            { label: 'Resources', value: stats.resourcesShared || 0, icon: BookOpen },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="bg-gradient-to-br from-[#0d1428]/80 to-[#060a14]/80 border border-white/[0.05] rounded-2xl p-6 backdrop-blur-xl hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
                <p className="text-3xl font-black text-white">{stat.value.toLocaleString()}</p>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Goals List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-black text-white mb-6">Active Goals</h2>

        {goals.length === 0 ? (
          <div className="text-center py-12 bg-[#0a0f1e]/50 rounded-2xl border border-white/[0.05]">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No active goals yet</p>
          </div>
        ) : (
          goals.map((goal, idx) => {
            const Icon = categoryIcons[goal.category] || Target;
            const progress = (goal.currentValue / goal.targetValue) * 100;
            const isCompleted = goal.status === 'completed';

            return (
              <motion.div
                key={goal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className={`bg-gradient-to-br ${categoryColors[goal.category]} border ${borderColors[goal.category]} rounded-2xl p-6 backdrop-blur-xl hover:border-opacity-60 transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryColors[goal.category]} border ${borderColors[goal.category]} flex items-center justify-center`}>
                      <Icon className={`w-7 h-7 ${textColors[goal.category]}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-white mb-1">{goal.title}</h3>
                      <p className="text-slate-400 text-sm">{goal.description}</p>
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 uppercase">Completed</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-300">
                      {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()} {goal.unit}
                    </span>
                    <span className="text-sm font-bold text-slate-400">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.05]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${categoryColors[goal.category]}`}
                    ></motion.div>
                  </div>
                </div>

                {/* Milestones */}
                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="pt-4 border-t border-white/[0.05]">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Milestones</p>
                    <div className="flex flex-wrap gap-2">
                      {goal.milestones.map((milestone, midx) => (
                        <div
                          key={midx}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            milestone.achieved
                              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                              : 'bg-white/[0.05] border border-white/[0.05] text-slate-400'
                          }`}
                        >
                          {milestone.achieved && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                          {milestone.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
};

export default CommunityGoalsDashboard;
