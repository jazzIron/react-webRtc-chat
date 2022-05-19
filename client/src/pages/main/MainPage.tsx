import styled from '@emotion/styled';
import useSocketIo from '@src/hooks/socketIo/useSocketIo';
import { chatsState } from '@src/store/chatState';
import { SocketMsgType } from '@src/utils/Constant';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { PChat } from '../chat';
import { ChatPage2 } from '../chat/ChatPage2';
import { ChatPage3 } from '../chat/ChatPage3';
import { LoginPage } from '../login/LoginPage';
import { User, Users } from '../User_types';

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

  if (user)
    return (
      <>
        <ChatPage3 socket={socketRef} user={user} logout={logout} />
      </>
    );
  return (
    <MainPageStyled>
      <LoginPage socket={socketRef} setUser={handleSetUser} />
    </MainPageStyled>
  );
}

const MainPageStyled = styled.div``;
