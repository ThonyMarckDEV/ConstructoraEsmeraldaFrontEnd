import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchWithAuth } from '../../../js/authToken';
import jwtUtils from '../../../utilities/jwtUtils';
import io from 'socket.io-client';
import SOCKET_URL from '../../../js/socketUrl';
import Sidebar from '../Sidebar';
import EmojiPicker from 'emoji-picker-react';

const ChatWindow = () => {
  const { id } = useParams();
  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);
  
  const token = jwtUtils.getRefreshTokenFromCookie();
  const currentUserRole = jwtUtils.getUserRole(token);
  const currentUserId = jwtUtils.getUserID(token);


  // Auto-scroll al final de los mensajes solo cuando sea necesario
  useEffect(() => {
    if (shouldScrollToBottom || messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
      // Reset el flag después de scrollear
      if (shouldScrollToBottom) {
        setShouldScrollToBottom(false);
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, shouldScrollToBottom]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Detectar cuando el usuario está scrolleando manualmente
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      // Si está cerca del fondo (menos de 20px de diferencia), establecer scrollToBottom en true
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 20;
      setShouldScrollToBottom(isNearBottom);
    };

    chatContainerRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      chatContainerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
          
          // Sólo marcar mensajes como leídos si el usuario está activo
          if (isActive && document.visibilityState === 'visible') {
            markMessagesAsRead();
          }
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
  }, [id, isActive]);



  const markMessagesAsRead = async () => {
    // Solo marcar como leídos si el usuario está visualizando el chat activamente
    if (!isActive || document.visibilityState !== 'visible') {
      return;
    }
    
    try {
      const response = await fetchWithAuth(`${SOCKET_URL}/api/chats/${id}/mark-as-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: true,
          inView: document.visibilityState === 'visible'
        }),
      });
      
      if (response.ok) {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.idUsuario !== currentUserId ? { ...msg, leido: true } : msg
          )
        );
        
        // Notificar al remitente que sus mensajes han sido leídos
        if (socket) {
          socket.emit('messages_read', id);
        }
      }
    } catch (err) {
      console.error('Error al marcar mensajes como leídos:', err);
    }
  };

  // Cerrar el emoji picker cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      setIsActive(isVisible);
      
      if (isVisible && chatData) {
        markMessagesAsRead();
      }
    };
    
    // Definir eventos para rastrear si el usuario está activo
    const handleActivity = () => {
      setIsActive(true);
      if (document.visibilityState === 'visible' && chatData) {
        markMessagesAsRead();
      }
    };
    
    // Registrar eventos para detectar actividad del usuario
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleActivity);
    chatContainerRef.current?.addEventListener('scroll', handleActivity);
    document.addEventListener('click', handleActivity);
    document.addEventListener('keydown', handleActivity);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleActivity);
      chatContainerRef.current?.removeEventListener('scroll', handleActivity);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('keydown', handleActivity);
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
      
      // Solo marcar como leído si el usuario está activo en el chat
      if (message.idUsuario !== currentUserId && 
          isActive && document.visibilityState === 'visible') {
        markMessagesAsRead();
      }
    });
    
    // Manejar notificación de mensajes leídos
    newSocket.on('messages_read_status', (data) => {
      if (data.chatId === id) {
        setMessages(prev => 
          prev.map(msg => 
            msg.idUsuario === currentUserId ? { ...msg, leido: true } : msg
          )
        );
      }
    });
    
    // Informar al servidor cuando el usuario está activo
    if (isActive && document.visibilityState === 'visible') {
      newSocket.emit('user_active', { chatId: id });
    }
    
    return () => {
      newSocket.emit('leave_chat', id);
      newSocket.off('new_message');
      newSocket.off('messages_read_status');
      newSocket.disconnect();
    };
  }, [chatData, id, currentUserId, isActive]);


  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;
    
    try {
      setIsSending(true);
      
      const response = await fetchWithAuth(`${SOCKET_URL}/api/chats/${id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contenido: newMessage }),
      });
      
      if (response.ok) {
        setNewMessage('');
        setShowEmojiPicker(false);
      } else {
        const data = await response.json();
        setError(data.message || 'Error al enviar mensaje');
      }
    } catch (err) {
      setError('Error de conexión al enviar mensaje');
    } finally {
      setIsSending(false);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
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
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
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
    <>
     <Sidebar />
      <div className="flex flex-col h-screen bg-[#f5f7f9] ">
        
        {/* Add global style to hide scrollbar */}
        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        
        {/* Header fijo */}
        <div className="sticky top-0 z-10 bg-white shadow-md">
          {/* Encabezado principal */}
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
    
        {/* Área de mensajes (scrollable con scrollbar oculta) */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-[#f5f7f9] scrollbar-hide"
          style={{
            scrollbarWidth: 'none', /* Para Firefox */
            msOverflowStyle: 'none', /* Para Internet Explorer y Edge */
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
                          {/* {isCurrentUserMessage && (
                            <span className="ml-1">
                              {message.leido ? (
                                <span className="text-green-100">✓✓</span>
                              ) : (
                                <span className="text-green-200 opacity-70">✓</span>
                              )}
                            </span>
                          )} */}
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
            <button 
              type="button"
              onClick={toggleEmojiPicker}
              className="p-2 text-gray-500 hover:text-green-600 transition-colors flex-shrink-0"
              aria-label="Seleccionar emoji"
              disabled={isSending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
              </svg>
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enviar mensaje..."
              className="flex-1 bg-transparent p-2 text-sm focus:outline-none"
              disabled={!socket || isSending}
            />
            
            <button 
              type="submit" 
              className={`p-2 ${isSending ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white rounded-full disabled:bg-gray-300 transition-colors flex-shrink-0`}
              disabled={!socket || !newMessage.trim() || isSending}
              aria-label="Enviar mensaje"
            >
              {isSending ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              )}
            </button>
          </form>
          
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-16 left-2 sm:left-3 z-50">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatWindow;

