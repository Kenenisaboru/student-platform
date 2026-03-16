
const Skeleton = ({ className }) => {
  return (
    <div className={`animate-shimmer rounded-md ${className}`} />
  );
};

export const PostSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden mb-6 p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-5">
        <Skeleton className="w-11 h-11 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-32 h-3" />
        </div>
      </div>
      <div className="space-y-3 mb-5">
        <Skeleton className="w-3/4 h-6 rounded-lg" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-16 h-8 rounded-lg" />
        <Skeleton className="w-16 h-8 rounded-lg" />
      </div>
    </div>
  );
};

export default Skeleton;
