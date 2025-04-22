import React from 'react';
import { Link } from 'react-router-dom';

const ChatHeader = ({ 
  contactName, 
  contactInitials, 
  contactRole, 
  backUrl, 
  projectName, 
  createdAt, 
  formatDate 
}) => {
  return (
    <div className="sticky top-0 z-10 bg-white shadow-md">
      {/* Main header */}
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-medium">
              {contactInitials}
            </div>
            <div className="ml-3">
              <h2 className="font-semibold text-sm sm:text-base">{contactName}</h2>
              <p className="text-xs text-blue-100">{contactRole}</p>
            </div>
          </div>
          
          <Link 
            to={backUrl}
            className="flex items-center bg-white text-green-600 hover:bg-blue-50 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Volver</span>
          </Link>
        </div>
      </div>
      
      {/* Project information */}
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
    </div>
  );
};

export default ChatHeader;