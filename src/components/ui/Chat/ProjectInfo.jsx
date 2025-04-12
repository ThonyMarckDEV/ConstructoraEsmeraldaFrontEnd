// ProjectInfo.jsx
import React from 'react';

const ProjectInfo = ({ projectName, createdAt }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white px-4 py-2 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-xs sm:text-sm font-medium truncate max-w-[150px] sm:max-w-xs">
            {projectName}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Creado: {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;