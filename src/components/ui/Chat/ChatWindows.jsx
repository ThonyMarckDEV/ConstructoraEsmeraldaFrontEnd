import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../../../js/authToken';
import jwtUtils from '../../../utilities/jwtUtils';
import io from 'socket.io-client';
import SOCKET_URL from '../../../js/socketUrl';

const ChatWindow = () => {
  const { id } = useParams();
  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  
  const token = jwtUtils.getAccessTokenFromCookie();
  const currentUserRole = jwtUtils.getUserRole(token);
  const currentUserId = jwtUtils.getUserID(token);

  // Obtener datos iniciales del chat
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await fetchWithAuth(`${SOCKET_URL}/api/chats/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setChatData(data);
          setMessages(data.messages);
          markMessagesAsRead();
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

  // Marcar mensajes como leídos
  const markMessagesAsRead = async () => {
    try {
      await fetchWithAuth(`${SOCKET_URL}/api/chats/${id}/mark-as-read`, {
        method: 'POST'
      });
    } catch (err) {
      console.error('Error al marcar mensajes como leídos:', err);
    }
  };

  // Configurar WebSocket
  useEffect(() => {
    if (!chatData) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket']
    });
    
    setSocket(newSocket);
    
    newSocket.emit('join_chat', id);
    
    // Escuchar nuevos mensajes
    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      
      // Si el mensaje es para el usuario actual, marcarlo como leído
      if (message.idUsuario !== currentUserId) {
        markMessagesAsRead();
      }
    });
    
    return () => {
      newSocket.off('new_message');
      newSocket.disconnect();
    };
  }, [chatData, id, currentUserId]);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
        {error}
      </div>
    </div>
  );

  if (!chatData) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header con toda la información */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-600">
              {currentUserRole === 'cliente' 
                ? chatData.encargado.nombre.charAt(0) + chatData.encargado.apellido.charAt(0)
                : chatData.cliente.nombre.charAt(0) + chatData.cliente.apellido.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold">
                {currentUserRole === 'cliente' 
                  ? `${chatData.encargado.nombre} ${chatData.encargado.apellido} (Encargado)`
                  : `${chatData.cliente.nombre} ${chatData.cliente.apellido} (Cliente)`}
              </h2>
              <p className="text-xs">Proyecto: {chatData.proyecto.nombre}</p>
            </div>
          </div>
          <div className="text-xs text-green-200">
            <p>Creado: {new Date(chatData.chat.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 bg-opacity-50">
        {messages.map((message) => (
          <div 
            key={message.idMensaje} 
            className={`flex mb-4 ${
              message.rolUsuario === 'cliente' 
                ? 'justify-end'  // Cliente a la derecha
                : 'justify-start' // Manager a la izquierda
            }`}
          >
            <div 
              className={`flex max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg ${
                message.rolUsuario === 'cliente' 
                  ? 'bg-green-100 rounded-tr-none' 
                  : 'bg-white rounded-tl-none'
              }`}
            >
              <div>
                <p className="break-words">{message.contenido}</p>
                <div className={`flex items-center mt-1 text-xs ${
                  message.rolUsuario === 'cliente' ? 'justify-end' : 'justify-start'
                }`}>
                  <span className="text-gray-500">{formatTime(message.created_at)}</span>
                  {message.rolUsuario === 'cliente' && (
                    <span className="ml-1">
                      {message.leido ? (
                        <span className="text-blue-500">✓✓</span>
                      ) : (
                        <span className="text-gray-500">✓</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input para enviar mensajes */}
      <form 
        className="bg-white p-3 border-t border-gray-200 flex items-center"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-2 mx-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-green-500"
          disabled={!socket}
        />
        <button 
          type="submit" 
          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          disabled={!socket || !newMessage.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;