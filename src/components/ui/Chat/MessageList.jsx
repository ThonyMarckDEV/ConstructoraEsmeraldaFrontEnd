// MessageList.jsx
import React, { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import DateSeparator from './DateSeparator';

const MessageList = ({ messages, currentUserId, contactInitials, onScroll }) => {
  const chatContainerRef = useRef(null);
  
  const handleScroll = () => {
    if (onScroll) onScroll();
  };
  
  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-4 bg-[#f5f7f9] scrollbar-hide relative"
      onScroll={handleScroll}
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm">Inicia la conversación</p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => {
            const isCurrentUserMessage = parseInt(message.idUsuario) === parseInt(currentUserId);
            
            // Check if we need to display a date separator
            const showDateSeparator = index === 0 || 
              new Date(message.created_at).toDateString() !== 
              new Date(messages[index - 1].created_at).toDateString();
            
            return (
              <React.Fragment key={message.idMensaje}>
                {showDateSeparator && (
                  <DateSeparator date={message.created_at} />
                )}
                
                <MessageItem 
                  message={message}
                  isCurrentUserMessage={isCurrentUserMessage}
                  contactInitials={contactInitials}
                />
              </React.Fragment>
            );
          })}
        </>
      )}
    </div>
  );
};

export default MessageList;