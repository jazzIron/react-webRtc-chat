import styled from '@emotion/styled';
import useSocketIo from '@src/hooks/socketIo/useSocketIo';
import { useEffect, useState } from 'react';

export function MainPage() {
  const [user, setUser] = useState<boolean>(false);
  const [users, setUsers] = useState();
  const [pChats, setPchats] = useState();

  const { socket, createNewSocket } = useSocketIo();

  const initSocket = () => {
    createNewSocket();
    if (!socket) return false;
    socket.on('connect', () => console.log('Connected'));
    socket?.on('NEW_USER', () => {
      console.group('NEW_USER');
      setUser(true);
    });
  };

  useEffect(() => {
    initSocket();
  }, []);

  console.log(process.env.REACT_APP_MODE);
  return <MainPageStyled>메인페이지</MainPageStyled>;
}

const MainPageStyled = styled.div``;
