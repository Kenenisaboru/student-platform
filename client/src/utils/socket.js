import { io } from 'socket.io-client';
import { getSocketURL } from '../lib/apiUrl';

const socket = io(getSocketURL(), {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'],
});

export const connectSocket = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    socket.disconnect();
    return socket;
  }

  socket.auth = { token };
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
