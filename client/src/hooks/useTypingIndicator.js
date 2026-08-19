import { useState, useRef, useCallback, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

const useTypingIndicator = (recipientId) => {
  const { socket } = useSocket();
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const startTyping = useCallback(() => {
    if (!socket || !recipientId) return;

    socket.emit('typing', { receiverId: recipientId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { receiverId: recipientId });
    }, 2000);
  }, [socket, recipientId]);

  const stopTyping = useCallback(() => {
    if (!socket || !recipientId) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit('stop_typing', { receiverId: recipientId });
  }, [socket, recipientId]);

  useEffect(() => {
    if (!socket) return;

    const handleTypingStatus = ({ senderId, isTyping: remoteTyping }) => {
      if (senderId === recipientId) {
        setIsTyping(remoteTyping);
      }
    };

    socket.on('typing_status', handleTypingStatus);

    return () => {
      socket.off('typing_status', handleTypingStatus);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, recipientId]);

  return { isTyping, startTyping, stopTyping };
};

export default useTypingIndicator;
