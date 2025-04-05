import React from 'react';
import PropTypes from 'prop-types';

const ChatList = ({ chats, onSelectChat, selectedChatId, loading, userRole }) => {
    if (loading && chats.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-500">Cargando chats...</p>
            </div>
        );
    }

    if (chats.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No tienes chats disponibles
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto">
            {chats.map(chat => (
                <div 
                    key={chat.idChat}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer flex justify-between items-center ${
                        selectedChatId === chat.idChat ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => onSelectChat(chat.idChat)}
                >
                    <div>
                        <h3 className="font-medium">
                            {chat.proyecto.nombre}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {/* Texto dinámico según rol */}
                            {userRole === 'manager' ? 'Cliente: ' : 'Encargado: '}
                            
                            {/* Mostrar información correspondiente al rol */}
                            {userRole === 'manager' ? (
                                `${chat.cliente?.nombre || ''} ${chat.cliente?.apellido || ''}`
                            ) : (
                                `${chat.encargado?.nombre || ''} ${chat.encargado?.apellido || ''}`
                            )}
                        </p>
                    </div>
                    
                    {chat.mensajes_no_leidos > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {chat.mensajes_no_leidos}
                        </span>
                    )}
                </div>
            ))}
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