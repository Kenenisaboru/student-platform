
const Skeleton = ({ className }) => {
  return (
    <div className={`animate-shimmer rounded-lg ${className}`} />
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
      <div className="px-6 sm:px-10 pb-8 -mt-16">
        <div className="flex items-end gap-6">
          <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-[#060a14]" />
          <div className="flex-1 pb-2 space-y-2">
            <Skeleton className="w-48 h-7" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
