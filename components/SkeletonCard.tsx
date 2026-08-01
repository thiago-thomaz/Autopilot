export function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-800 rounded w-28"></div>
        <div className="w-8 h-8 bg-gray-800 rounded-lg"></div>
      </div>
      <div className="h-8 bg-gray-800 rounded w-20 mb-2"></div>
      <div className="h-3 bg-gray-800/60 rounded w-36"></div>
    </div>
  );
}
