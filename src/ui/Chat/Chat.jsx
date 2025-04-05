import React, { useState, useEffect } from 'react';
import ChatList from '../../components/ui/Cliente/Chat/ChatList';
import ChatWindow from '../../components/ui/Cliente/Chat/ChatWindow';
import jwtUtils from '../../utilities/jwtUtils'; // Assuming you have a utility to decode JWT
import { fetchWithAuth } from '../../js/authToken';
import  Sidebar  from '../../components/ui/Cliente/Sidebar';

const ChatApp = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Get user role and token from your authentication system
    const token = jwtUtils.getAccessTokenFromCookie();  // Replace with actual token
    const userRole = jwtUtils.getUserRole(token); // Assuming you have a utility to decode JWT

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';
    
    // Fetch chats on component mount
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetchWithAuth(`${SOCKET_URL}/api/chats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error('Failed to fetch chats');
                
                const data = await response.json();
                setChats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchChats();
    }, [token]);
    
    // Handle chat selection
    const handleSelectChat = async (chatId) => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(`${SOCKET_URL}/api/chats/${chatId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch chat details');
            
            const data = await response.json();
            setSelectedChat(data);
            
            // Reset unread count for selected chat
            setChats(prevChats => 
                prevChats.map(chat => 
                    chat.idChat === chatId 
                        ? { ...chat, mensajes_no_leidos: 0 } 
                        : chat
                )
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-9 md:ml-84">
                <ChatList 
                    chats={chats}
                    onSelectChat={handleSelectChat}
                    selectedChatId={selectedChat?.idChat}
                    loading={loading}
                    userRole={userRole}
                />
            </div>
            <div className="flex-1 p-9 md:ml-84">
                {selectedChat ? (
                    <ChatWindow 
                        chat={selectedChat}
                        setChats={setChats}
                        setSelectedChat={setSelectedChat}
                        userRole={userRole}
                        token={token}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Selecciona un chat para comenzar
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatApp;