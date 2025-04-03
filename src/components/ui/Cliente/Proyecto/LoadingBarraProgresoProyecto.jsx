import React from 'react';

const LoadingBarraProgresoProyecto = () => {
  return (
    <div className="w-full bg-white shadow-lg animate-pulse">
      {/* Header skeleton */}
      <div className="relative h-40 md:h-48 bg-gray-300 w-full">
        <div className="absolute inset-0 p-4 md:p-6">
          <div className="flex justify-between items-start">
            <div className="w-3/4">
              {/* Title skeleton */}
              <div className="h-8 bg-gray-200 rounded-md mb-4"></div>
            </div>
            
            {/* AR Button skeleton - only visible on desktop */}
            <div className="h-10 w-24 bg-gray-200 rounded-lg hidden md:block"></div>
          </div>
          
          <div className="mt-4 flex items-center">
            {/* Progress circle skeleton */}
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-200"></div>
            <div className="ml-3 md:ml-4">
              {/* Status skeleton */}
              <div className="h-5 w-32 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* Progress bar skeleton */}
        <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 mb-6"></div>
        
        {/* Current phase box skeleton */}
        <div className="bg-gray-100 border-l-4 border-gray-200 p-4 mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
            <div className="flex-1">
              <div className="h-5 w-24 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
        
        {/* Phase indicator skeleton - Desktop */}
        <div className="mt-6 mb-4 hidden md:block">
          <div className="h-1 bg-gray-200 w-full mb-4"></div>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div className="mt-2 h-3 w-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingBarraProgresoProyecto;