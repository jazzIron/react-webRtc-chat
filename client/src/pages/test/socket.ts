import form from 'antd/lib/form';
import { io, Socket } from 'socket.io-client';

export let socket: Socket;
export const SOCKET_DOMAIN = `ws://${window.location.hostname}:8081`;

interface isUserCallback {
  user: {
    nickName: string;
    userAvatar: string;
    socketId: string;
  };
  isUser: boolean;
}

export const initSocket = () => {
  socket = io(SOCKET_DOMAIN, {
    transportOptions: {
      websocket: {
        extraHeaders: {
          Authorization: 'Bearer abc',
        },
      },
    },
  });
  //if (socket && room) socket.emit('JOIN_ROOM', room);
};

export const disconnectSocket = () => {
  console.log('[INFO_LOG] disconnectSocket');
  if (socket) socket.disconnect();
};

export const subScribeToChat = () => {
  if (!socket) return true;
  socket.on('CHAT', (msg) => {
    console.log('socket event received');
  });
};

export const sendMessage = (room: string, message: string) => {
  if (!socket) return true;
  socket.emit('CHAT', { message, room });
};

export const loginSubmit = async (
  formValues: any,
  isUserCallback: ({ user, isUser }: isUserCallback) => void,
) => {
  try {
    const loginUser = { nickName: formValues.nickName, userAvatar: formValues.userAvatar };
    socket.emit('login', loginUser, isUserCallback);
  } catch (error) {
    console.error('[ERROR] loginSubmit : ', error);
  }
};
