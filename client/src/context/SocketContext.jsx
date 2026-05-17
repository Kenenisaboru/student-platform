import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.isVerified && user?.role !== 'admin') {
      disconnectSocket();
      return;
    }

    if (user) {
      connectSocket();

      const onOnlineList = (users) => setOnlineUsers(users);
      socket.on('user_online_list', onOnlineList);

      return () => {
        socket.off('user_online_list', onOnlineList);
        disconnectSocket();
      };
    }

    disconnectSocket();
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
