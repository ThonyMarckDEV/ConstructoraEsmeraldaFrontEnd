import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const ChatWindow = ({ chat, setChats, setSelectedChat, userRole, token }) => {
    const [messages, setMessages] = useState(chat.mensajes || []);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [typing, setTyping] = useState(false);
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const [connected, setConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    
    // Determine the current user id based on role
    const currentUserId = userRole === 'manager' ? chat.idEncargado : chat.idCliente;
    
    // Get socket.io server URL from environment or use default
    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';
    
    // Connect to socket.io server
    useEffect(() => {
        // Clean up any existing socket connection
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        
        // Create a new socket connection with authentication
        socketRef.current = io(SOCKET_URL, {
            auth: {
                token: token
            }
        });
        
        // Socket connection event handlers
        socketRef.current.on('connect', () => {
            console.log('Connected to socket server');
            setConnected(true);
            
            // Join specific chat room
            socketRef.current.emit('join-chat', chat.idChat);
        });
        
        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from socket server');
            setConnected(false);
        });
        
        socketRef.current.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
            setConnected(false);
        });
        
        // Listen for new messages
        socketRef.current.on('new-message', (messageData) => {
            console.log('New message received:', messageData);
            
            // Update messages state
            setMessages(prevMessages => {
                // Check if message already exists
                const exists = prevMessages.some(msg => msg.idMensaje === messageData.idMensaje);
                if (exists) return prevMessages;
                
                return [...prevMessages, messageData];
            });
            
            // Mark as read if the message is from another user and window is in focus
            if (messageData.idUsuario !== currentUserId && document.hasFocus()) {
                markMessageAsRead(messageData.idMensaje);
            }
            
            // Update chat list
            updateChatList(messageData);
        });
        
        // Listen for typing indicators
        socketRef.current.on('user-typing', (data) => {
            if (data.idUsuario !== currentUserId) {
                setOtherUserTyping(true);
            }
        });
        
        socketRef.current.on('user-stop-typing', (data) => {
            if (data.idUsuario !== currentUserId) {
                setOtherUserTyping(false);
            }
        });
        
        // Listen for read receipts
        socketRef.current.on('message-read', (data) => {
            if (data.idChat === chat.idChat) {
                setMessages(prevMessages => 
                    prevMessages.map(msg => 
                        msg.idMensaje === data.idMensaje ? { ...msg, leido: 1 } : msg
                    )
                );
            }
        });
        
        // Clean up function
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [chat.idChat, currentUserId, token, SOCKET_URL]);
    
    // Mark messages as read when component mounts or gets focus
    useEffect(() => {
        const markUnreadMessages = () => {
            if (messages.length > 0) {
                messages.forEach(message => {
                    if (message.idUsuario !== currentUserId && message.leido === 0) {
                        markMessageAsRead(message.idMensaje);
                    }
                });
            }
        };
        
        markUnreadMessages();
        
        // Set up window focus listener
        window.addEventListener('focus', markUnreadMessages);
        return () => {
            window.removeEventListener('focus', markUnreadMessages);
        };
    }, [messages, currentUserId]);
    
    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    // Handle typing indicators with debounce
    useEffect(() => {
        if (typing && socketRef.current) {
            socketRef.current.emit('typing', chat.idChat);
            
            const timeout = setTimeout(() => {
                setTyping(false);
                socketRef.current.emit('stop-typing', chat.idChat);
            }, 2000);
            
            return () => clearTimeout(timeout);
        }
    }, [typing, chat.idChat]);
    
    // Update chat list with new message info
    const updateChatList = (messageData) => {
        setChats(prevChats => 
            prevChats.map(c => {
                if (c.idChat === chat.idChat) {
                    const updatedChat = { 
                        ...c,
                        ultimo_mensaje: messageData.contenido,
                        fecha_ultimo_mensaje: messageData.created_at
                    };
                    
                    // Increment unread count if message is from other user and window not focused
                    if (messageData.idUsuario !== currentUserId && !document.hasFocus()) {
                        updatedChat.mensajes_no_leidos = (c.mensajes_no_leidos || 0) + 1;
                    }
                    
                    return updatedChat;
                }
                return c;
            })
        );
    };
    
    // Handle message input change
    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
        
        // Indicate typing if not already typing
        if (!typing && e.target.value.trim() !== '') {
            setTyping(true);
        }
    };
    
    // Send message function
    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim() || sending || !socketRef.current || !connected) return;
        
        try {
            setSending(true);
            
            // Emit the message through Socket.IO
            socketRef.current.emit('send-message', {
                idChat: chat.idChat,
                contenido: newMessage
            }, (error, response) => {
                if (error) {
                    console.error('Error sending message:', error);
                    alert('Error al enviar el mensaje');
                } else {
                    // Clear input field
                    setNewMessage('');
                }
                setSending(false);
            });
            
            // Send HTTP request as fallback
            sendMessageHttp();
        } catch (error) {
            console.error('Error sending message:', error);
            setSending(false);
        }
    };
    
    // Fallback HTTP method to send messages
    const sendMessageHttp = async () => {
        try {
            const response = await fetch(`${SOCKET_URL}/api/chats/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    idChat: chat.idChat,
                    contenido: newMessage
                })
            });
            
            if (!response.ok) {
                throw new Error('HTTP send error');
            }
            
            // Clear input regardless of websocket success
            setNewMessage('');
        } catch (error) {
            console.error('HTTP fallback error:', error);
            // Already handled in the main send function
        }
    };
    
    // Mark message as read
    const markMessageAsRead = async (messageId) => {
        try {
            const response = await fetch(`${SOCKET_URL}/api/chats/message/read/${messageId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                // Update local state to show message as read
                setMessages(prevMessages => 
                    prevMessages.map(msg => 
                        msg.idMensaje === messageId ? { ...msg, leido: 1 } : msg
                    )
                );
                
                // Update chats list
                setChats(prevChats => 
                    prevChats.map(c => {
                        if (c.idChat === chat.idChat && c.mensajes_no_leidos > 0) {
                            return {
                                ...c,
                                mensajes_no_leidos: c.mensajes_no_leidos - 1
                            };
                        }
                        return c;
                    })
                );
            }
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };
    
    // Manually reconnect socket
    const handleReconnect = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current.connect();
        }
    };
    
    // Set header title based on user role
    const headerTitle = userRole === 'manager' ? 'Chat con Cliente' : 'Chat con Encargado';
    const contactPerson = userRole === 'manager' ? chat.cliente : chat.encargado;

    return (
        <div className="flex flex-col h-full">
            {/* Chat header */}
            <div className="p-4 border-b bg-gray-50">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold">{headerTitle}</h2>
                        <p className="text-sm">
                            {userRole === 'manager' ? 'Cliente: ' : 'Encargado: '}
                            {contactPerson?.nombre} {contactPerson?.apellido}
                        </p>
                        <p className="text-sm">Proyecto: {chat.proyecto?.nombre}</p>
                    </div>
                    <div className="text-xs">
                        Estado: 
                        <span className={`ml-1 ${connected ? 'text-green-600' : 'text-red-600'}`}>
                            {connected ? 'Conectado' : 'Desconectado'}
                        </span>
                        {!connected && (
                            <button 
                                onClick={handleReconnect}
                                className="ml-2 text-blue-500 hover:underline"
                            >
                                Reconectar
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Messages container */}
            <div 
                className="flex-1 p-4 overflow-y-auto"
                style={{ maxHeight: 'calc(100vh - 250px)' }}
            >
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                        No hay mensajes. ¡Inicia la conversación!
                    </div>
                ) : (
                    messages.map(message => {
                        const isOwnMessage = message.idUsuario === currentUserId;
                        
                        return (
                            <div 
                                key={message.idMensaje} 
                                className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div 
                                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                                        isOwnMessage 
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    <div className="text-xs mb-1">
                                        {message.usuario?.nombre} {message.usuario?.apellido}
                                    </div>
                                    <div>{message.contenido}</div>
                                    <div className="text-xs mt-1 text-right opacity-70">
                                        {new Date(message.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        {isOwnMessage && (
                                            <span className="ml-2">
                                                {message.leido ? '✓✓' : '✓'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                
                {otherUserTyping && (
                    <div className="text-gray-500 text-sm ml-4">
                        Escribiendo...
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>
            
            {/* Message input form */}
            <div className="p-4 border-t mt-auto">
                <form onSubmit={handleSendMessage} className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleMessageChange}
                        placeholder="Escribe tu mensaje..."
                        className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={sending || !connected}
                    />
                    <button
                        type="submit"
                        disabled={sending || !connected}
                        className={`text-white px-4 py-2 rounded-r-lg ${
                            sending || !connected 
                                ? 'bg-gray-400' 
                                : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {sending ? (
                            <span className="flex items-center">
                                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                    <circle 
                                        className="opacity-25" 
                                        cx="12" 
                                        cy="12" 
                                        r="10" 
                                        stroke="currentColor" 
                                        strokeWidth="4"
                                        fill="none"
                                    ></circle>
                                    <path 
                                        className="opacity-75" 
                                        fill="currentColor" 
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Enviando
                            </span>
                        ) : 'Enviar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;