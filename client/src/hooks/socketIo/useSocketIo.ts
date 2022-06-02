import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const SOCKET_DOMAIN = `ws://${window.location.hostname}:8081`;

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
    socketRef.current.on('connect', () => {
      console.log('connect to server');
      console.log(socketRef.current?.connected); // true
    });

    socketRef.current.on('disconnect', (reason) => {
      console.info(`Successfully disconnected`);
      console.log(socketRef.current?.connected); // true

      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
      }
      // else the socket will automatically try to reconnect
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket Error:', error.message);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('connect_error:', error.message);
    });

    socketRef.current.on('all_users', () => {
      console.log('all_users');
    });
  };

  return {
    socketRef,
    socket: socketRef.current,
    createNewSocket,
  };
}
