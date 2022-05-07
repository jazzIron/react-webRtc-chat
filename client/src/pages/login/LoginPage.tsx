import styled from '@emotion/styled';
import useSocketIo from '@src/hooks/socketIo/useSocketIo';
import { useEffect, useState } from 'react';

export function LoginPage() {
  const { socket, createNewSocket } = useSocketIo();
  const [nickName, setNickName] = useState('');

  const initSocket = () => {
    createNewSocket();
    if (!socket) return false;
    socket.on('connect', () => console.log('Connected'));
  };

  useEffect(() => {
    initSocket();
  }, []);

  interface isUserCallback {
    user: {
      nickName: string;
      socketId: string;
    };
    isUser: boolean;
  }

  const isUserCallback = ({ user, isUser }: isUserCallback) => {
    if (isUser) {
      return console.error('Already nickname');
    } else {
      console.log('===========isUserCallback===========');
      console.log(user);
      console.log(isUser);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    setNickName(value);
  };

  const handleClickLoginSubmit = async () => {
    if (!socket) return;
    console.log('handleClickLoginSubmit');
    socket.emit('IS_USER', nickName, isUserCallback);
  };

  return (
    <LoginPageStyled>
      <input type="text" onChange={handleChange} />
      <button onClick={handleClickLoginSubmit}>버튼</button>
    </LoginPageStyled>
  );
}

const LoginPageStyled = styled.div``;
