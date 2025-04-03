import React from "react";

const LoadingState = () => {
  return (
    <div className="max-w-4xl mx-auto font-sans flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default LoadingState;