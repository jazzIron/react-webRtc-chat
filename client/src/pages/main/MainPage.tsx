import styled from '@emotion/styled';
import useSocketIo from '@src/hooks/socketIo/useSocketIo';
import { loginUserState } from '@src/store/userState';
import { SocketMsgType } from '@src/utils/Constant';
import { isEmpty } from 'lodash';
import { useState, useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { ChatPage } from '../chat/ChatPage';
import { LoginPage } from '../login/LoginPage';

export function MainPage() {
  const [loading, setLoading] = useState(true);
  const { socketRef, socket } = useSocketIo();
  const [loginUser, setLoginUser] = useRecoilState(loginUserState);
  const resetLoginUser = useResetRecoilState(loginUserState);

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

  const logout = () => {
    if (!socketRef.current) return false;
    socketRef.current.emit(SocketMsgType.LOGOUT);
    resetLoginUser();
  };

  if (loading) return <div>loading ...........</div>;

  console.log('==================MAIN_PAGE=================');

  if (!isEmpty(loginUser.socketId))
    return <ChatPage socket={socketRef} user={loginUser} logout={logout} />;
  return (
    <MainPageStyled>
      <LoginPage />
    </MainPageStyled>
  );
}

const MainPageStyled = styled.div``;
