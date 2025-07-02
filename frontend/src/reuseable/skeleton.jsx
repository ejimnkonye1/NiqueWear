const SkeletonLoader = ({ count = 8 }) => {
  return (
         <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        {/* Title Skeleton */}
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse md:mb-2"></div>
        
        {/* Item Count Skeleton */}
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
      </div>
      
      {/* Optional: Skeleton for additional controls if they exist in your actual component */}
      <div className="hidden md:block">
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
         <div className="flex flex-col md:flex-row gap-8">
               <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-medium text-lg mb-4 flex items-center">
        <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse mr-2"></div>
        <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
      </h3>
      {/* Price Filter Skeleton */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">
          <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
        </h4>
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded animate-pulse"></div>
      </div>
      {/* Clear Filters Button Skeleton */}
      <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse"></div>
    </div>
            <div className="flex-1">  
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="aspect-square bg-gray-200 animate-pulse"></div>
          <div className="p-4">
            <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      ))}
    </div>
    </div>
    </div>
    </main>
  );
};

export default SkeletonLoader;
