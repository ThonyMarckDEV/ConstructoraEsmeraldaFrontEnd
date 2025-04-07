import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchWithAuth } from '../../../js/authToken';
import jwtUtils from '../../../utilities/jwtUtils';
import io from 'socket.io-client';
import SOCKET_URL from '../../../js/socketUrl';
import Sidebar from '../Sidebar';

const ChatWindow = () => {
  const { id } = useParams();
  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  const token = jwtUtils.getAccessTokenFromCookie();
  const currentUserRole = jwtUtils.getUserRole(token);
  const currentUserId = jwtUtils.getUserID(token);

  // Obtener y normalizar el rol del usuario
  const getUserRoleNormalized = () => {
    const role = jwtUtils.getUserRole(token);
    
    if (role === 'manager') return 'encargado';
    if (role === 'admin') return 'admin';
    
    return role || 'cliente';
  };

  const role = getUserRoleNormalized();
  const backUrl = id ? `/${role}/proyecto/${id}` : `/${role}/proyectos`;

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

  const markMessagesAsRead = async () => {
    try {
      const response = await fetchWithAuth(`${SOCKET_URL}/api/chats/${id}/mark-as-read`, {
        method: 'POST'
      });
      
      if (response.ok) {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.idUsuario !== currentUserId ? { ...msg, leido: true } : msg
          )
        );
      }
    } catch (err) {
      console.error('Error al marcar mensajes como leídos:', err);
    }
  };

  // Rastrear visibilidad de la página
  useEffect(() => {
    let isVisible = true;
    
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
      
      if (isVisible && chatData) {
        markMessagesAsRead();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [chatData, id]);

  // Configurar socket
  useEffect(() => {
    if (!chatData) return;
  
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket']
    });
    
    setSocket(newSocket);
    
    newSocket.emit('join_chat', id);
    
    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      
      if (message.idUsuario !== currentUserId && document.visibilityState === 'visible') {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-sm max-w-md">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </div>
    </div>
  );

  if (!chatData) return null;

  // Obtener información del interlocutor
  const isClient = currentUserRole === 'cliente';
  const contactName = isClient 
    ? `${chatData.encargado.nombre} ${chatData.encargado.apellido}`
    : `${chatData.cliente.nombre} ${chatData.cliente.apellido}`;
  const contactInitials = isClient
    ? chatData.encargado.nombre.charAt(0) + chatData.encargado.apellido.charAt(0)
    : chatData.cliente.nombre.charAt(0) + chatData.cliente.apellido.charAt(0);
  const contactRole = isClient ? "Encargado" : "Cliente";

  return (
    <div className="flex flex-col h-screen bg-[#f5f7f9] md:p-9">
      <Sidebar />
      
      {/* Header fijo */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        {/* Encabezado principal */}
        <div className="bg-blue-600 text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-medium">
                {contactInitials}
              </div>
              <div className="ml-3">
                <h2 className="font-semibold text-sm sm:text-base">{contactName}</h2>
                <p className="text-xs text-blue-100">{contactRole}</p>
              </div>
            </div>
            
            <Link 
              to={backUrl}
              className="flex items-center bg-white text-blue-600 hover:bg-blue-50 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Volver</span>
            </Link>
          </div>
        </div>
        
        {/* Información del proyecto */}
        <div className="bg-white px-4 py-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-medium truncate max-w-[150px] sm:max-w-xs">
                {chatData.proyecto.nombre}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Creado: {formatDate(chatData.chat.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Área de mensajes (scrollable) */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-[#f5f7f9]"
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
                  
                  <div 
                    className={`flex mb-3 ${
                      isCurrentUserMessage ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isCurrentUserMessage && (
                      <div className="h-8 w-8 rounded-full bg-blue-200 flex-shrink-0 flex items-center justify-center text-blue-800 text-xs mr-2">
                        {contactInitials}
                      </div>
                    )}
                    
                    <div 
                      className={`flex flex-col max-w-[75%] md:max-w-[60%] p-3 rounded-lg ${
                        isCurrentUserMessage 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white border border-gray-100 shadow-sm rounded-bl-none'
                      }`}
                    >
                      <p className="break-words text-sm">{message.contenido}</p>
                      <div className={`flex items-center mt-1 text-xs ${
                        isCurrentUserMessage ? 'justify-end text-blue-100' : 'justify-start text-gray-400'
                      }`}>
                        <span>{formatTime(message.created_at)}</span>
                        {isCurrentUserMessage && (
                          <span className="ml-1">
                            {message.leido ? (
                              <span className="text-blue-100">✓✓</span>
                            ) : (
                              <span className="text-blue-200 opacity-70">✓</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input para enviar mensajes (fijo en la parte inferior) */}
      <div className="bg-white border-t border-gray-200 p-2 sm:p-3">
        <form 
          className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-200"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enviar mensaje..."
            className="flex-1 bg-transparent p-2 text-sm focus:outline-none"
            disabled={!socket}
          />
          <button 
            type="submit" 
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex-shrink-0"
            disabled={!socket || !newMessage.trim()}
            aria-label="Enviar mensaje"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;