import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const SOCKET_DOMAIN = `ws://${window.location.hostname}:8081/chat`;

export default function useSocketIo() {
  const socketRef = useRef<Socket>();

  useEffect(() => {
    createNewSocket();
    console.log(socketRef);
    return () => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
        socketRef.current = undefined;
      }
    };
  }, []);

  const createNewSocket = async () => {
    socketRef.current = io(SOCKET_DOMAIN!, { transports: ['websocket'] });
    socketRef.current.on('connection', () => {
      console.log('connected to server');
    });

    socketRef.current.on('all_users', () => {
      console.log('all_users');
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
    socket: socketRef.current,
    createNewSocket,
  };
}
