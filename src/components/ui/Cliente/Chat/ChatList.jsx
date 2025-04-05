// ChatList.js
import React from 'react';
import PropTypes from 'prop-types';

const ChatList = ({ chats, onSelectChat, selectedChatId, loading, userRole }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-600">Cargando chats...</p>
        </div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 border rounded-lg">
        <div className="text-center p-6">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="mt-2 text-gray-600">No tienes chats disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto divide-y divide-gray-200 divide-opacity-20 h-full bg-gradient-to-b from-white to-blue-50">
        {chats.map(chat => {
            const isSelected = selectedChatId === chat.idChat;
            const contactName = userRole === 'manager'
                ? `${chat.cliente?.nombre || ''} ${chat.cliente?.apellido || ''}`
                : `${chat.encargado?.nombre || ''} ${chat.encargado?.apellido || ''}`;
                
            return (
                <div
                    key={chat.idChat}
                    onClick={() => onSelectChat(chat.idChat)}
                    className={`cursor-pointer p-4 transition-all duration-300 hover:bg-white group ${
                        isSelected 
                            ? 'bg-white border-l-4 border-blue-500 md:border-l-0 md:bg-gradient-to-r md:from-blue-50 md:to-indigo-50' 
                            : ''
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-sm font-medium text-gray-900 truncate flex items-center">
                                <span className="text-blue-600 mr-2">•</span>
                                {chat.proyecto.nombre}
                            </p>
                            <p className="text-sm text-gray-600 truncate font-light">
                                {userRole === 'manager' ? 'Cliente: ' : 'Encargado: '}
                                <span className="font-medium">{contactName}</span>
                            </p>
                            {chat.ultimo_mensaje && (
                                <p className="text-sm text-gray-500 truncate italic">
                                    "{chat.ultimo_mensaje}"
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                            {chat.fecha_ultimo_mensaje && (
                                <span className="text-xs text-gray-400">
                                    {formatDate(chat.fecha_ultimo_mensaje)}
                                </span>
                            )}
                            {chat.mensajes_no_leidos > 0 && (
                                <span className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-full shadow-md transform transition-all group-hover:scale-110">
                                    {chat.mensajes_no_leidos}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
);
};

ChatList.propTypes = {
  chats: PropTypes.array.isRequired,
  onSelectChat: PropTypes.func.isRequired,
  selectedChatId: PropTypes.number,
  loading: PropTypes.bool,
  userRole: PropTypes.oneOf(['cliente', 'manager']).isRequired
};

export default ChatList;