import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Manager/Sidebar';
import ChatList from './ChatList';
import ChatWindow from '../../components/ui/Cliente/Chat/ChatWindow';
import { fetchWithAuth } from '../../js/authToken';
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';

const ChatEncargado = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = jwtUtils.getRefreshTokenFromCookie();
    const role = jwtUtils.getUserRole(token);

    // Cargar lista de chats
    useEffect(() => {
        const loadChats = async () => {
            try {
                const response = await fetchWithAuth(`${API_BASE_URL}/api/chats`);
                if (!response.ok) throw new Error('Error al cargar los chats');
                
                const data = await response.json();
                setChats(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        loadChats();
    }, []);

    // Seleccionar un chat
    const handleSelectChat = async (chatId) => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(`${API_BASE_URL}/api/chats/${chatId}`);
            if (!response.ok) throw new Error('Error al cargar el chat');
            
            const data = await response.json();
            setSelectedChat(data);
            
            // Actualizar el contador de mensajes no leídos en la lista de chats
            setChats(prevChats => 
                prevChats.map(chat => 
                    chat.idChat === chatId 
                        ? { ...chat, mensajes_no_leidos: 0 } 
                        : chat
                )
            );
            
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <Sidebar username="Encargado" />
            
            <div className="flex-1 p-4 md:ml-64">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <h1 className="text-2xl font-bold p-4 border-b">Chat con Clientes</h1>
                    
                    {error && (
                        <div className="p-4 bg-red-100 text-red-700">
                            {error}
                        </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row h-[calc(100vh-200px)]">
                        {/* Lista de chats */}
                        <div className="w-full md:w-1/3 border-r">
                            <ChatList 
                                chats={chats} 
                                onSelectChat={handleSelectChat}
                                selectedChatId={selectedChat?.idChat}
                                loading={loading}
                            />
                        </div>
                        
                        {/* Ventana de chat */}
                        <div className="w-full md:w-2/3">
                            {selectedChat ? (
                                <ChatWindow 
                                    chat={selectedChat}
                                    setChats={setChats}
                                    setSelectedChat={setSelectedChat}
                                    userRole={role}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Selecciona un chat para comenzar
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatEncargado;