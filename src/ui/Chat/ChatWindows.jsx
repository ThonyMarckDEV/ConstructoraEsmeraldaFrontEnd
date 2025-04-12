// ChatWindow.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../../js/authToken';
import jwtUtils from '../../utilities/jwtUtils';
import io from 'socket.io-client';
import SOCKET_URL from '../../js/socketUrl';
import Sidebar from '../../components/ui/Sidebar';

// Import components
import ChatHeader from '../../components/ui/Chat/ChatHeader';
import ProjectInfo from '../../components/ui/Chat/ProjectInfo';
import MessageList from '../../components/ui/Chat/MessageList';
import ChatInput from '../../components/ui/Chat/ChatInput';

const ChatWindow = () => {
  const { id } = useParams();
  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const token = jwtUtils.getRefreshTokenFromCookie();
  const currentUserRole = jwtUtils.getUserRole(token);
  const currentUserId = jwtUtils.getUserID(token);

  // Get and normalize user role
  const getUserRoleNormalized = () => {
    const role = jwtUtils.getUserRole(token);
    
    if (role === 'manager') return 'encargado';
    if (role === 'admin') return 'admin';
    
    return role || 'cliente';
  };

  const role = getUserRoleNormalized();
  const backUrl = id ? `/${role}/proyecto/${id}` : `/${role}/proyectos`;

  // Fetch initial chat data
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await fetchWithAuth(`${SOCKET_URL}/api/chats/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setChatData(data);
          setMessages(data.messages);
          
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
        
        if (socket) {
          socket.emit('messages_read', id);
        }
      }
    } catch (err) {
      console.error('Error al marcar mensajes como leídos:', err);
    }
  };

  // Set up visibility change listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      setIsActive(isVisible);
      
      if (isVisible && chatData) {
        markMessagesAsRead();
      }
    };
    
    const handleActivity = () => {
      setIsActive(true);
      if (document.visibilityState === 'visible' && chatData) {
        markMessagesAsRead();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleActivity);
    document.addEventListener('click', handleActivity);
    document.addEventListener('keydown', handleActivity);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleActivity);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('keydown', handleActivity);
    };
  }, [chatData, id]);

  // Set up socket connection
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
      
      if (message.idUsuario !== currentUserId && 
          isActive && document.visibilityState === 'visible') {
        markMessagesAsRead();
      }
    });
    
    newSocket.on('messages_read_status', (data) => {
      if (data.chatId === id) {
        setMessages(prev => 
          prev.map(msg => 
            msg.idUsuario === currentUserId ? { ...msg, leido: true } : msg
          )
        );
      }
    });
    
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

  const handleSendMessage = async (newMessage) => {
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
      
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Error al enviar mensaje');
      }
    } catch (err) {
      setError('Error de conexión al enviar mensaje');
    } finally {
      setIsSending(false);
    }
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

  // Get interlocutor information
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
      <div className="flex flex-col h-screen bg-[#f5f7f9] fixed inset-0 overflow-hidden">
        {/* Global style for scrollbar */}
        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white shadow-md">
          <ChatHeader 
            contactName={contactName} 
            contactInitials={contactInitials}
            contactRole={contactRole}
            backUrl={backUrl}
          />
          
          <ProjectInfo 
            projectName={chatData.proyecto.nombre}
            createdAt={chatData.chat.created_at}
          />
        </div>
    
        {/* Messages */}
        <MessageList 
          messages={messages}
          currentUserId={currentUserId}
          contactInitials={contactInitials}
          onScroll={() => {
            if (isActive && document.visibilityState === 'visible') {
              markMessagesAsRead();
            }
          }}
        />
        
        {/* Input */}
        <ChatInput 
          onSendMessage={handleSendMessage}
          isSending={isSending}
          socketConnected={!!socket}
        />
      </div>
    </>
  );
};

export default ChatWindow;