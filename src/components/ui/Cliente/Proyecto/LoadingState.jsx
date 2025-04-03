import React from "react";

const LoadingState = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row animate-pulse">
      {/* Sidebar skeleton */}
      <div className="w-full lg:w-1/4 pr-0 lg:pr-4 bg-white">
        <div className="lg:sticky lg:top-4 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {[1, 2, 3, 4].map((item) => (
              <div 
                key={`skeleton-phase-${item}`}
                className="border rounded p-3 flex-shrink-0 lg:flex-shrink w-40 lg:w-full h-12 bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                  <div className="bg-gray-200 h-4 w-4 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="w-full lg:w-3/4 mt-6 lg:mt-0">
        <div className="border rounded-md mb-4">
          <div className="flex flex-col sm:flex-row items-start p-4 gap-4">
            <div className="bg-gray-200 p-2 rounded-md min-w-[120px] w-[120px] h-[120px]"></div>
            <div className="flex-1 space-y-2 w-full">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>

        {/* File card skeletons */}
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div 
              key={`skeleton-file-${item}`}
              className="border rounded-lg p-4 flex flex-col sm:flex-row items-start gap-3"
            >
              <div className="bg-gray-200 rounded min-w-[60px] w-[60px] h-[60px]"></div>
              <div className="flex-1 space-y-2 w-full">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <div className="bg-gray-200 rounded-full h-8 w-8"></div>
                <div className="bg-gray-200 rounded-full h-8 w-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;