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
          console.log('✅ Socket connected:', socketInstance.id);
          setConnected(true);

          // If user is admin, join admin room
          const user = authService.getCurrentUser();
          
          if (user && user.role === 'admin') {
            socketInstance.emit('join-admin', user.id);
            console.log('✅ Admin joined admin room');
          }
        });

        socketInstance.on('disconnect', () => {
          console.log('⚠️ Socket disconnected');
          setConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
          console.warn('⚠️ Socket connection failed (backend may be offline)');
          setConnected(false);
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
          socketInstance.disconnect();
        };
      } catch (error) {
        console.warn('⚠️ Socket initialization failed:', error.message);
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
