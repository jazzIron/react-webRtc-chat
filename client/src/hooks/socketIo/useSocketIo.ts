import { useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const SOCKET_DOMIAN = `ws://${window.location.hostname}:8081`;

export default function useSocketIo() {
  const socketRef = useRef<Socket>();

  const createNewSocket = async () => {
    socketRef.current = io(SOCKET_DOMIAN!, { transports: ['websocket'] });
    const socket = socketRef.current;
  };

  return {
    socketRef,
    createNewSocket,
  };
}
