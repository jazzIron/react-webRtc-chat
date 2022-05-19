import styled from '@emotion/styled';
import { User } from '@src/@types/User_types';
import { PChat } from '@src/features/chat';
import useSocketIo from '@src/hooks/socketIo/useSocketIo';
import { SocketMsgType } from '@src/utils/Constant';
import { useState, useEffect } from 'react';
import { ChatPage } from '../chat/ChatPage';
import { LoginPage } from '../login/LoginPage';

export function MainPage() {
  const [user, setUser] = useState<User>();
  const [pChats, setPChats] = useState<PChat[]>([]);
  const [loading, setLoading] = useState(true);
  const { socketRef, socket } = useSocketIo();

  const initSocket = () => {
    if (!socketRef.current) return false;
    socketRef.current.on('connect', () => console.log('Connected'));
    socketRef.current.on('ROOM_LIST', (rooms) => {
      console.log(rooms);
    });
  };

  useEffect(() => {
    initSocket();
  }, []);

  useEffect(() => {
    console.log('==================MAIN_PAGE_ useEffect=================');
    if (socketRef.current) setLoading(false);
  }, [socketRef.current]);

  const handleSetUser = (user: User) => {
    if (!socketRef.current) return false;
    setUser(user);
    socketRef.current.emit(SocketMsgType.NEW_USER, user);
  };

  const logout = () => {
    if (!socketRef.current) return false;
    socketRef.current.emit(SocketMsgType.LOGOUT);
    setUser(undefined);
  };

  if (loading) return <div>loading ...........</div>;

  console.log('==================MAIN_PAGE=================');

  if (user) return <ChatPage socket={socketRef} user={user} logout={logout} />;
  return (
    <MainPageStyled>
      <LoginPage socket={socketRef} setUser={handleSetUser} />
    </MainPageStyled>
  );
}

const MainPageStyled = styled.div``;
