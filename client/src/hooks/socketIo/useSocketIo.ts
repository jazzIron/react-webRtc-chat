import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const SOCKET_DOMAIN = `ws://${window.location.hostname}:8081`;

export default function useSocketIo() {
  const socketRef = useRef<Socket>();

  useEffect(() => {
    createNewSocket();
    return () => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
        socketRef.current = undefined;
      }
    };
  }, []);

  const createNewSocket = async () => {
    socketRef.current = io(SOCKET_DOMAIN!, { transports: ['websocket'] });
    socketRef.current.on('connnection', () => {
      console.log('connected to server');
    });

    socketRef.current.on('disconnect', () => {
      console.info(`Successfully disconnected`);
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket Error:', error.message);
    });
  };

  return {
    socketRef,
    socket: socketRef,
    createNewSocket,
  };
}
