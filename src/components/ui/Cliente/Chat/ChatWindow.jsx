import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';

const ChatWindow = ({ chat, setChats, setSelectedChat, userRole, token }) => {
    const [messages, setMessages] = useState(chat.mensajes || []);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [typing, setTyping] = useState(false);
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const [connected, setConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiContainerRef = useRef(null);
    
    // Determine the current user id based on role
    const currentUserId = userRole === 'manager' ? chat.idEncargado : chat.idCliente;
    
    // Get socket.io server URL from environment or use default
    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

    // Manejar selección de emoji
    const handleEmojiSelect = (emojiData) => {
         setNewMessage(prev => prev + emojiData.emoji);
         setShowEmojiPicker(false);
    };
        

     // Cerrar el picker al hacer clic fuera
     useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiContainerRef.current && !emojiContainerRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


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
        
        if (!newMessage.trim() || sending || !connected) return;
        
        try {
            setSending(true);
            
            // Usar solo el método HTTP
            await sendMessageHttp();
            
            // Limpiar el mensaje después del envío exitoso
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error al enviar el mensaje');
        } finally {
            setSending(false); // Asegurar que siempre se desactive el estado
        }
    };
    
    // Fallback HTTP method to send messages
    const sendMessageHttp = async () => {
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
            throw new Error('Error en el envío HTTP');
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
        <div className="flex flex-col h-full fixed inset-0 z-50 bg-white md:relative md:inset-auto md:z-auto">
            <div className="p-4 border-b border-opacity-20 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h2 className="font-bold text-2xl text-gray-800 font-serif">{headerTitle}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-xs bg-white px-3 py-2 rounded-full shadow-sm">
                            <span className={`flex items-center ${connected ? 'text-emerald-600' : 'text-rose-600'}`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                {connected ? 'Conectado' : 'Desconectado'}
                            </span>
                        </div>
                        
                        {/* Botón de cerrar premium */}
                        <button
                            onClick={() => setSelectedChat(null)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                            aria-label="Cerrar chat"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-500 hover:text-gray-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Messages container */}
            <div 
                className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-white to-blue-50"
                style={{ maxHeight: 'calc(100vh - 280px)' }}
            >
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-20 space-y-2">
                        <div className="text-4xl">💬</div>
                        <div className="text-lg font-light">Inicia una nueva conversación</div>
                    </div>
                ) : (
                    messages.map(message => {
                        const isOwnMessage = message.idUsuario === currentUserId;
                        
                        return (
                            <div 
                                key={message.idMensaje} 
                                className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
                            >
                                <div 
                                    className={`rounded-2xl px-4 py-2 max-w-[85%] relative transition-all duration-200 ${
                                        isOwnMessage 
                                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg'
                                            : 'bg-white text-gray-800 shadow-md'
                                    }`}
                                >
                                    <div className="text-xs mb-1 opacity-80">
                                        {message.usuario?.nombre} {message.usuario?.apellido}
                                    </div>
                                    <div className="text-[15px] leading-snug">{message.contenido}</div>
                                    <div className="flex items-center justify-end space-x-2 mt-2">
                                        <span className="text-xs opacity-70">
                                            {new Date(message.created_at).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                        {isOwnMessage && (
                                            <span className={`text-xs ${message.leido ? 'text-blue-200' : 'text-gray-300'}`}>
                                                ✓✓
                                            </span>
                                        )}
                                    </div>
                                    {/* Detalle decorativo */}
                                    {isOwnMessage && (
                                        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-4 bg-blue-600 clip-triangle"></div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                
                {otherUserTyping && (
                    <div className="text-sm text-gray-500 ml-4 flex items-center">
                        <div className="typing-dots">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                        Escribiendo...
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>
            
              {/* Message input form */}
              <div className="p-4 border-t border-opacity-20 bg-white relative" ref={emojiContainerRef}>
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleMessageChange}
                            placeholder="Escribe tu mensaje..."
                            className="w-full p-3 border border-opacity-30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                            disabled={sending || !connected}
                        />
                        
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-6 w-6" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                        </button>
                        
                        {showEmojiPicker && (
                            <div className="absolute bottom-16 right-0 z-50">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiSelect}
                                    searchDisabled
                                    skinTonesDisabled
                                    previewConfig={{ showPreview: false }}
                                    width={300}
                                    height={350}
                                />
                            </div>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        disabled={sending || !connected}
                        className={`px-5 py-3 rounded-xl transition-all duration-300 ${
                            sending || !connected 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105 shadow-md'
                        }`}
                        onClick={() => setShowEmojiPicker(false)}
                    >
                        {sending ? (
                            <span className="flex items-center text-white">
                                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                    <circle 
                                        className="opacity-25" 
                                        cx="12" 
                                        cy="12" 
                                        r="10" 
                                        stroke="white" 
                                        strokeWidth="4"
                                        fill="none"
                                    ></circle>
                                    <path 
                                        className="opacity-75" 
                                        fill="white" 
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Enviando
                            </span>
                        ) : (
                            <span className="text-white font-medium flex items-center">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5 mr-1" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                >
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                                Enviar
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;