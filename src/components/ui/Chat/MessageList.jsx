// MessageList.jsx
import React, { useRef, useEffect, useState } from 'react';
import MessageItem from './MessageItem';
import DateSeparator from './DateSeparator';

const MessageList = ({ messages, currentUserId, contactInitials, onScroll }) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const prevMessagesLengthRef = useRef(messages.length);
  
  // Auto-scroll to bottom only when new messages arrive and user isn't manually scrolling
  useEffect(() => {
    const currentLength = messages.length;
    const previousLength = prevMessagesLengthRef.current;
    
    // Only auto-scroll if:
    // 1. New messages have been added
    // 2. User isn't actively scrolling up to view history
    if (currentLength > previousLength && !isUserScrolling) {
      scrollToBottom();
    }
    
    prevMessagesLengthRef.current = currentLength;
  }, [messages, isUserScrolling]);

  // Initial scroll to bottom on first load
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom('auto');
    }
  }, []); // Empty dependency array ensures this runs only once

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };
  
  // Handle scroll event to detect user scrolling
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    // If user scrolls up, mark as user is scrolling
    if (!isAtBottom) {
      setIsUserScrolling(true);
    } else {
      // If user returns to bottom, they're not actively viewing history
      setIsUserScrolling(false);
    }
    
    if (onScroll) onScroll();
  };
  
  // Reset the user scrolling state when clicking on the list
  const handleClick = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    if (isAtBottom) {
      setIsUserScrolling(false);
    }
  };
  
  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-4 bg-[#f5f7f9] scrollbar-hide relative"
      onScroll={handleScroll}
      onClick={handleClick}
    >
      {/* Botón para volver al final cuando el usuario está desplazándose */}
      {isUserScrolling && messages.length > 0 && (
        <button 
          onClick={() => {
            scrollToBottom();
            setIsUserScrolling(false);
          }}
          className="fixed bottom-20 right-4 bg-green-600 text-white rounded-full p-2 shadow-md z-20"
          aria-label="Ir al final"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      
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
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;