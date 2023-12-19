import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import Cookies from 'js-cookie';

export const SocketContext = createContext();

    export const SocketProvider = ({ children }) => {
    
        const [socket, setSocket] = useState(null);
        const [usersOnlineCount, setUsersOnlineCount] = useState(0);
        const [usersOnline, setUsersOnline] = useState([]);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        };
    
    
    
        
        
        useEffect(() => {
            const token = getCookie('token');
            const newSocket = io('http://localhost:8080', { query: { token: token } });
        
            newSocket.on('online users', ({ count, users }) => {
                setUsersOnlineCount(count);
                setUsersOnline(users);
            });
        
            setSocket(newSocket);
        
            return () => newSocket.close();
        }, []);

    return (
        <SocketContext.Provider value={{socket, usersOnlineCount, usersOnline}}>
        {children}
        </SocketContext.Provider>
    );
    };