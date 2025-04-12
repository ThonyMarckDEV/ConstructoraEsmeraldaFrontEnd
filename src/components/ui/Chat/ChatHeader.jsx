// ChatHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ChatHeader = ({ contactName, contactInitials, contactRole, backUrl }) => {
  return (
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
  );
};

export default ChatHeader;