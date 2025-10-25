const AppSkeleton = () => (
  <div className="min-h-screen bg-gray-950 text-white font-['Inter']">
    {/* Header Skeleton */}
    <header className="pt-8 pb-12 md:pt-10 md:pb-16 mb-10 bg-gray-900 shadow-2xl rounded-b-[3rem] border-b-4 border-teal-500/50 relative">
      <div className="absolute top-5 right-6 md:right-10 z-10">
        <div className="px-5 py-2 text-sm font-semibold bg-gray-700 rounded-full animate-pulse">
          &nbsp;
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="h-12 bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-700 rounded w-48 mx-auto animate-pulse"></div>
      </div>
    </header>

    {/* Content Skeleton */}
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800 p-6 rounded-3xl shadow-xl h-48 border border-gray-700 animate-pulse"
        >
          <div className="h-6 bg-gray-700 rounded w-4/5 mb-4"></div>
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-700 rounded w-2/3 mb-6"></div>
          <div className="flex justify-between items-end">
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
            <div className="h-3 bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AppSkeleton;
