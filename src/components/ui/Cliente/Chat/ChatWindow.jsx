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

    // Scrollear hacia abajo cuando llegan nuevos mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Configurar Pusher para escuchar nuevos mensajes
    useEffect(() => {
        // Configurar Pusher con los valores directamente
        // Nota: En producción, es mejor usar variables de entorno correctamente configuradas
        const pusher = new Pusher('153aef1a510da30a26ad', {
            cluster: 'sa1',
            forceTLS: true
        });

        // Suscribirse al canal del chat actual
        const channel = pusher.subscribe(`chat.${chat.idChat}`);
        
        // Escuchar por nuevos mensajes
        channel.bind('App\\Events\\NewMessageEvent', data => {
            setMessages(prev => [...prev, data]);
            
            // Actualizar el contador de mensajes no leídos en la lista de chats
            setChats(prevChats => 
                prevChats.map(c => {
                    if (c.idChat === chat.idChat) {
                        return { ...c, mensajes_no_leidos: c.mensajes_no_leidos + 1 };
                    }
                    return c;
                })
            );
            
            // Marcar como leído el mensaje si la ventana está activa
            if (document.hasFocus()) {
                markMessageAsRead(data.idMensaje);
            }
        });

        // Limpiar la suscripción cuando se desmonta el componente
        return () => {
            pusher.unsubscribe(`chat.${chat.idChat}`);
        };
    }, [chat.idChat, setChats]);

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
            setMessages(prev => [...prev, data]);
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