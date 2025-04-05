import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';

const ChatWindow = ({ chat, setChats, setSelectedChat, userRole }) => {
    const [messages, setMessages] = useState(chat.mensajes || []);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const messageContainerRef = useRef(null);

    // Determinar el ID del usuario actual basado en el rol
    const currentUserId = userRole === 'manager' ? chat.idEncargado : chat.idCliente;

    // Obtener mensajes al cargar el componente
    useEffect(() => {
        // Actualizar mensajes con los del chat actual
        setMessages(chat.mensajes || []);
        
        // Marcar todos los mensajes no leídos como leídos
        if (chat.mensajes && chat.mensajes.length > 0) {
            chat.mensajes.forEach(message => {
                if (message.leido === 0 && message.idUsuario !== currentUserId) {
                    markMessageAsRead(message.idMensaje);
                }
            });
        }
    }, [chat.idChat]);

    // Scrollear hacia abajo cuando llegan nuevos mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Configurar Pusher para escuchar nuevos mensajes
    useEffect(() => {
        // Configurar Pusher con los valores directamente
        const pusher = new Pusher('153aef1a510da30a26ad', {
            cluster: 'sa1',
            forceTLS: true
        });

        // Suscribirse al canal del chat actual
        const channel = pusher.subscribe(`chat.${chat.idChat}`);
        
        // Escuchar por nuevos mensajes
        channel.bind('App\\Events\\NewMessageEvent', data => {
            console.log('Nuevo mensaje recibido via Pusher:', data);
            
            // Añadir el nuevo mensaje al estado
            setMessages(prev => {
                // Verificar si el mensaje ya existe para evitar duplicados
                const messageExists = prev.some(msg => msg.idMensaje === data.idMensaje);
                if (messageExists) return prev;
                return [...prev, data];
            });
            
            // Si el mensaje no es del usuario actual, marcarlo como leído
            if (data.idUsuario !== currentUserId && document.hasFocus()) {
                markMessageAsRead(data.idMensaje);
            }
            
            // Actualizar la lista de chats
            setChats(prevChats => 
                prevChats.map(c => {
                    if (c.idChat === chat.idChat) {
                        // Si el mensaje no es del usuario actual, incrementar mensajes no leídos
                        if (data.idUsuario !== currentUserId) {
                            return { 
                                ...c, 
                                mensajes_no_leidos: (c.mensajes_no_leidos || 0) + 1,
                                ultimo_mensaje: data.contenido,
                                fecha_ultimo_mensaje: data.created_at
                            };
                        }
                        // Si es del usuario actual, solo actualizar último mensaje
                        return { 
                            ...c, 
                            ultimo_mensaje: data.contenido,
                            fecha_ultimo_mensaje: data.created_at
                        };
                    }
                    return c;
                })
            );
        });

        // Limpiar la suscripción cuando se desmonta el componente
        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`chat.${chat.idChat}`);
        };
    }, [chat.idChat, currentUserId, setChats]);

    // Añadir un efecto para marcar mensajes como leídos cuando la pestaña recibe foco
    useEffect(() => {
        const handleFocus = () => {
            messages.forEach(message => {
                if (message.leido === 0 && message.idUsuario !== currentUserId) {
                    markMessageAsRead(message.idMensaje);
                }
            });
        };

        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [messages, currentUserId]);

    // Enviar mensaje
    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim() || sending) return;
        
        try {
            setSending(true);
            
            const response = await fetchWithAuth(`${API_BASE_URL}/api/chats/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idChat: chat.idChat,
                    contenido: newMessage
                })
            });
            
            if (!response.ok) throw new Error('Error al enviar el mensaje');
            
            const data = await response.json();
            
            // No necesitamos añadir el mensaje aquí ya que Pusher lo hará
            // pero lo mantenemos como respaldo en caso de que Pusher falle
            setMessages(prev => {
                // Verificar si el mensaje ya existe para evitar duplicados
                const messageExists = prev.some(msg => msg.idMensaje === data.idMensaje);
                if (messageExists) return prev;
                return [...prev, data];
            });
            
            setNewMessage('');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar el mensaje');
        } finally {
            setSending(false);
        }
    };

    // Marcar mensaje como leído
    const markMessageAsRead = async (idMensaje) => {
        try {
            await fetchWithAuth(`${API_BASE_URL}/api/chats/message/read/${idMensaje}`, {
                method: 'PUT'
            });
            
            // Actualizar el estado local para reflejar que el mensaje fue leído
            setMessages(prev => 
                prev.map(msg => 
                    msg.idMensaje === idMensaje ? { ...msg, leido: 1 } : msg
                )
            );
            
            // Actualizar la lista de chats para reflejar los mensajes leídos
            setChats(prevChats => 
                prevChats.map(c => {
                    if (c.idChat === chat.idChat) {
                        return { 
                            ...c, 
                            mensajes_no_leidos: Math.max(0, (c.mensajes_no_leidos || 0) - 1)
                        };
                    }
                    return c;
                })
            );
        } catch (error) {
            console.error('Error marcando mensaje como leído:', error);
        }
    };

    // Determinar la información del encabezado basado en el rol
    const headerInfo = userRole === 'manager' 
        ? { title: 'Chat con Cliente', person: chat.cliente, project: chat.proyecto }
        : { title: 'Chat con Encargado', person: chat.encargado, project: chat.proyecto };

    return (
        <div className="flex flex-col h-full">
            {/* Encabezado del chat */}
            <div className="p-4 border-b bg-gray-50">
                <h2 className="font-bold">{headerInfo.title}</h2>
                <div className="text-sm">
                    <p>
                        {userRole === 'manager' ? 'Cliente: ' : 'Encargado: '}
                        {headerInfo.person.nombre} {headerInfo.person.apellido}
                    </p>
                    <p>Proyecto: {headerInfo.project.nombre}</p>
                </div>
            </div>
            
            {/* Contenedor de mensajes */}
            <div 
                ref={messageContainerRef}
                className="flex-1 p-4 overflow-y-auto"
                style={{ maxHeight: 'calc(100vh - 350px)' }}
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
                                        {!isOwnMessage && (
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
                <div ref={messagesEndRef} />
            </div>
            
            {/* Formulario para enviar mensajes */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={sending}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;