// export default ChatWindows;
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../../../js/authToken';
import jwtUtils from '../../../utilities/jwtUtils';
import io from 'socket.io-client';
import SOCKET_URL from '../../../js/socketUrl';

const ChatWindows = () => {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  
  const token = jwtUtils.getAccessTokenFromCookie();
  const currentUserRol = jwtUtils.getUserRole(token);
  const currentUserID = jwtUtils.getUserID(token);

  // Obtener datos iniciales del chat
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await fetchWithAuth(`${SOCKET_URL}/api/chats/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setChat(data);
          setMessages(data.messages);
        } else {
          setError(data.message || 'Error al cargar el chat');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChatData();
  }, [id]);

  // Configurar WebSocket
  useEffect(() => {
    const token = jwtUtils.getAccessTokenFromCookie();
    const newSocket = io('http://localhost:3001', {
      auth: { token }
    });
    
    setSocket(newSocket);
    
    newSocket.emit('join_chat', id);
    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    return () => {
      newSocket.off('new_message');
      newSocket.disconnect();
    };
  }, [id]);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      const response = await fetchWithAuth(`${SOCKET_URL}/api/chats/${id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contenido: newMessage }),
      });
      
      if (response.ok) {
        setNewMessage('');
      } else {
        const data = await response.json();
        setError(data.message || 'Error al enviar mensaje');
      }
    } catch (err) {
      setError('Error de conexión al enviar mensaje');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Encabezado del chat con nombre del proyecto y participante */}
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex items-center">
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{chat?.proyecto?.nombre || 'Proyecto'}</h2>
            <p className="text-sm opacity-90">
              {currentUserRol === 'cliente' 
                ? `Chat con encargado: ${chat?.encargado?.nombre + ' ' + chat?.encargado?.apellido || 'Encargado'}`
                : `Chat con cliente: ${chat?.cliente?.nombre  + ' ' + chat?.cliente?.apellido || 'Cliente'}`}
            </p>
          </div>
        </div>
      </div>
      
      {/* Área de mensajes (sin cambios) */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        <div className="max-w-3xl mx-auto space-y-3">
          {messages.map((message, index) => {
            const isCurrentUser = message.idUsuario === currentUserID;
            const showAvatar = index === 0 || messages[index - 1].idUsuario !== message.idUsuario;
            
            return (
              <div 
                key={message.idMensaje} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} items-end`}
              >
                {!isCurrentUser && showAvatar && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                    <span className="text-xs font-semibold">
                      {message.nombreUsuario?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                
                <div 
                  className={`max-w-xs md:max-w-md rounded-lg p-3 relative ${isCurrentUser
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}
                >
                  {!isCurrentUser && showAvatar && (
                    <div className="text-xs font-semibold mb-1">
                      {message.nombreUsuario}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.contenido}</p>
                  <div className={`text-xs mt-1 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <span className={`opacity-80 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                
                {isCurrentUser && (
                  <div className="w-2 h-2 ml-1 rounded-full bg-blue-500"></div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Formulario para enviar mensajes (sin cambios) */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindows;