import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { authService } from '../api/services';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Only initialize socket if backend is available
    const initSocket = async () => {
      try {
        // Initialize socket connection with reduced reconnection attempts
        const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
          autoConnect: true,
          reconnection: true,
          reconnectionDelay: 2000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 3, // Reduced from 5 to 3
          timeout: 5000, // 5 second timeout
        });

        socketInstance.on('connect', () => {
          setConnected(true);

          // If user is admin, join admin room
          const user = authService.getCurrentUser();
          
          if (user && user.role === 'admin') {
            socketInstance.emit('join-admin', user.id);
          }
        });

        socketInstance.on('disconnect', () => {
          setConnected(false);
        });

        socketInstance.on('connect_error', () => {
          setConnected(false);
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
          socketInstance.disconnect();
        };
      } catch (error) {
        // Socket initialization failed silently
      }
    };

    initSocket();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
