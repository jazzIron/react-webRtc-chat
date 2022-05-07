import styled from '@emotion/styled';
import useSocketIo from '@src/hooks/socketIo/useSocketIo';
import { useEffect, useState } from 'react';

export function LoginPage({ socket }: any) {
  const [nickName, setNickName] = useState('');
  const [error, setError] = useState<boolean>(false);

  interface isUserCallback {
    user: {
      nickName: string;
      socketId: string;
    };
    isUser: boolean;
  }

  const isUserCallback = ({ user, isUser }: isUserCallback) => {
    console.log('test????????');
    if (isUser) {
      setError(true);
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
    if (!socket.current) return false;
    console.log('handleClickLoginSubmit');
    socket.current.emit('IS_USER', nickName, isUserCallback);
  };

  console.log(socket);

  return (
    <LoginPageStyled>
      <input type="text" onChange={handleChange} />
      <button onClick={handleClickLoginSubmit}>버튼</button>
    </LoginPageStyled>
  );
}

const LoginPageStyled = styled.div``;
