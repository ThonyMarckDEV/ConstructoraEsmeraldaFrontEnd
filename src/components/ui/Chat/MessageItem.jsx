// MessageItem.jsx
import React from 'react';

const MessageItem = ({ message, isCurrentUserMessage, contactInitials }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className={`flex mb-3 ${
        isCurrentUserMessage ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isCurrentUserMessage && (
        <div className="h-8 w-8 rounded-full bg-green-200 flex-shrink-0 flex items-center justify-center text-green-800 text-xs mr-2">
          {contactInitials}
        </div>
      )}
      
      <div 
        className={`flex flex-col max-w-[75%] md:max-w-[60%] p-3 rounded-lg ${
          isCurrentUserMessage 
            ? 'bg-green-600 text-white rounded-br-none' 
            : 'bg-white border border-gray-100 shadow-sm rounded-bl-none'
        }`}
      >
        <p className="break-words text-sm">{message.contenido}</p>
        <div className={`flex items-center mt-1 text-xs ${
          isCurrentUserMessage ? 'justify-end text-green-100' : 'justify-start text-gray-400'
        }`}>
          <span>{formatTime(message.created_at)}</span>
          {isCurrentUserMessage && (
            <span className="ml-1">
              {message.leido ? (
                <span className="text-green-100">✓✓</span>
              ) : (
                <span className="text-green-200 opacity-70">✓</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;