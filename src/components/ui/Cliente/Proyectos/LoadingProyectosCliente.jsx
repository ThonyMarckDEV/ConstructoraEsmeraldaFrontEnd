import React from 'react';

const LoadingProyectosClientes = () => {
  // Create an array of 6 empty items to represent loading projects
  const skeletonItems = Array(6).fill(null);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded-md w-48 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded-md w-32 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonItems.map((_, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
            {/* Skeleton image */}
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            
            <div className="p-5 space-y-4">
              {/* Skeleton title */}
              <div className="h-6 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
              
              {/* Skeleton date */}
              <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
              
              {/* Skeleton progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 animate-pulse"></div>
              
              {/* Skeleton progress text */}
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
              </div>
              
              {/* Skeleton footer */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-4 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingProyectosClientes;