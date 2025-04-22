import React from 'react';

const ChatMessages = ({ 
  messages, 
  currentUserId, 
  contactInitials, 
  formatDate, 
  chatContainerRef, 
  messagesEndRef 
}) => {
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-4 bg-[#f5f7f9] scrollbar-hide"
      style={{
        scrollbarWidth: 'none', /* For Firefox */
        msOverflowStyle: 'none', /* For Internet Explorer and Edge */
      }}
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
                  <div className="flex justify-center my-4">
                    <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {formatDate(message.created_at)}
                    </div>
                  </div>
                )}
                
                <MessageBubble 
                  message={message} 
                  isCurrentUserMessage={isCurrentUserMessage}
                  contactInitials={contactInitials}
                  formatTime={formatTime}
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

// Message bubble component
const MessageBubble = ({ message, isCurrentUserMessage, contactInitials, formatTime }) => {
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

export default ChatMessages;