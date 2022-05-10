import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const SOCKET_DOMAIN = `ws://${window.location.hostname}:8081`;

export default function useSocketIo() {
  const socketRef = useRef<Socket>();

  useEffect(() => {
    createNewSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = undefined;
      }
    };
  }, []);

  const createNewSocket = async () => {
    socketRef.current = io(SOCKET_DOMAIN!, { transports: ['websocket'] });
    const socket = socketRef.current;
  };

  return {
    socketRef,
    socket: socketRef.current,
    createNewSocket,
  };
}
