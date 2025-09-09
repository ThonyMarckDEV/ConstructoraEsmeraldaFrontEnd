import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../../js/authToken';
import jwtUtils from '../../utilities/jwtUtils';
import io from 'socket.io-client';
import SOCKET_URL from '../../js/socketUrl';
import Sidebar from '../../components/ui/Sidebar';
import ChatHeader from '../../components/ui/Chat/ChatHeader';
import ChatMessages from '../../components/ui/Chat/ChatMessages';
import ChatInput from '../../components/ui/Chat/ChatInput';
import LoadingSpinner from '../../components/ui/Chat/LoadingSpinner';
import ErrorDisplay from '../../components/ui/Chat/ErrorDisplay';

const ChatWindow = () => {
  const { id } = useParams();
  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);
  
  const token = jwtUtils.getRefreshTokenFromCookie();
  const currentUserRole = jwtUtils.getUserRole(token);
  const currentUserId = jwtUtils.getUserID(token);

  // Get normalized user role
  const getUserRoleNormalized = () => {
    const role = jwtUtils.getUserRole(token);
    
    if (role === 'manager') return 'encargado';
    if (role === 'admin') return 'admin';
    
    return role || 'cliente';
  };

  const role = getUserRoleNormalized();

  // Auto-scroll to bottom when needed
  useEffect(() => {
    if (shouldScrollToBottom || messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
      // Reset flag after scrolling
      if (shouldScrollToBottom) {
        setShouldScrollToBottom(false);
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, shouldScrollToBottom]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Detect when the user is manually scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      // If near the bottom (less than 20px difference), set scrollToBottom to true
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 20;
      setShouldScrollToBottom(isNearBottom);
    };

    chatContainerRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      chatContainerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Get initial chat data
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await fetchWithAuth(`${SOCKET_URL}/api/chats/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setChatData(data);
          setMessages(data.messages);
          
          // Only mark messages as read if the user is active
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
    // Only mark as read if the user is actively viewing the chat
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
        
        // Notify the sender that their messages have been read
        if (socket) {
          socket.emit('messages_read', id);
        }
      }
    } catch (err) {
      console.error('Error al marcar mensajes como leídos:', err);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      setIsActive(isVisible);
      
      if (isVisible && chatData) {
        markMessagesAsRead();
      }
    };
    
    // Define events to track if the user is active
    const handleActivity = () => {
      setIsActive(true);
      if (document.visibilityState === 'visible' && chatData) {
        markMessagesAsRead();
      }
    };
    
    // Register events to detect user activity
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

  // Set up socket
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
      
      // Only mark as read if the user is active in the chat
      if (message.idUsuario !== currentUserId && 
          isActive && document.visibilityState === 'visible') {
        markMessagesAsRead();
      }
    });
    
    // Handle notification of read messages
    newSocket.on('messages_read_status', (data) => {
      if (data.chatId === id) {
        setMessages(prev => 
          prev.map(msg => 
            msg.idUsuario === currentUserId ? { ...msg, leido: true } : msg
          )
        );
      }
    });
    
    // Inform the server when the user is active
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

  const handleSendMessage = async (message) => {
    if (!message.trim() || isSending) return;
    
    try {
      setIsSending(true);
      
      const response = await fetchWithAuth(`${SOCKET_URL}/api/chats/${id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contenido: message }),
      });
      
      if (response.ok) {
        // Force scroll to bottom when sending a message
        setShouldScrollToBottom(true);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) return <ErrorDisplay error={error} />;

  if (!chatData) return null;

  // Get information about the interlocutor
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
      <div className="flex flex-col h-screen bg-[#f5f7f9]">
        
        {/* Add global style to hide scrollbar */}
        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        
        <ChatHeader 
          contactName={contactName} 
          contactInitials={contactInitials} 
          contactRole={contactRole}
          projectName={chatData.proyecto.nombre}
          createdAt={chatData.chat.created_at}
          formatDate={formatDate}
        />
    
        <ChatMessages 
          messages={messages}
          currentUserId={currentUserId}
          contactInitials={contactInitials}
          formatDate={formatDate}
          chatContainerRef={chatContainerRef}
          messagesEndRef={messagesEndRef}
        />
    
        <ChatInput 
          socket={socket}
          isSending={isSending}
          onSendMessage={handleSendMessage}
        />
      </div>
    </>
  );
};

export default ChatWindow;