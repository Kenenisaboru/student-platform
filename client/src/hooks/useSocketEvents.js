import { useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

const useSocketEvents = (events) => {
  const { socket } = useSocket();
  const eventsRef = useRef(events);
  
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  useEffect(() => {
    if (!socket) return;

    const handlers = {};
    
    Object.entries(eventsRef.current).forEach(([event, handler]) => {
      const wrappedHandler = (...args) => handler(...args);
      handlers[event] = wrappedHandler;
      socket.on(event, wrappedHandler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket]);
};

export default useSocketEvents;
