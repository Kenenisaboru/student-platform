import { motion } from 'framer-motion';

const Skeleton = ({ className }) => {
  return (
    <div className={`relative overflow-hidden bg-white/[0.03] rounded-lg ${className}`}>
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.5, 
          ease: 'linear'
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
      />
    </div>
  );
};

export const PostSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden p-5">
      <div className="flex items-center space-x-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="w-24 h-3.5" />
          <Skeleton className="w-32 h-2.5" />
        </div>
      </div>
      <div className="space-y-2.5 mb-4">
        <Skeleton className="w-3/4 h-5 rounded-lg" />
        <Skeleton className="w-full h-3.5" />
        <Skeleton className="w-full h-3.5" />
        <Skeleton className="w-1/2 h-3.5" />
      </div>
      <div className="flex gap-2 pt-3 border-t border-white/[0.04]">
        <Skeleton className="w-16 h-8 rounded-xl" />
        <Skeleton className="w-16 h-8 rounded-xl" />
        <Skeleton className="w-16 h-8 rounded-xl" />
      </div>
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <Skeleton className="h-40 sm:h-52 w-full" />
      <div className="px-6 sm:px-10 pb-8 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <Skeleton className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-[#060a14]" />
          <div className="flex-1 pb-2 space-y-3">
            <Skeleton className="w-48 h-8 rounded-lg" />
            <Skeleton className="w-32 h-4 rounded-md" />
            <div className="flex gap-4 pt-2">
              <Skeleton className="w-16 h-4 rounded-md" />
              <Skeleton className="w-16 h-4 rounded-md" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-24 h-10 rounded-xl" />
            <Skeleton className="w-10 h-10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MessageSkeleton = () => {
  return (
    <div className="flex gap-3 p-3 items-center">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="flex justify-between">
          <Skeleton className="w-1/2 h-3.5 rounded-md" />
          <Skeleton className="w-8 h-2.5 rounded-md" />
        </div>
        <Skeleton className="w-3/4 h-3 rounded-md" />
      </div>
    </div>
  );
};

export default Skeleton;
