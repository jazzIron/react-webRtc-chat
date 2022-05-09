import styled from '@emotion/styled';
import { useState } from 'react';

export function LoginPage({ socket, setUser }: any) {
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
    if (isUser) {
      setError(true);
      return console.error('Already nickname');
    } else {
      setUser(user);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    setNickName(value);
  };

  const handleClickLoginSubmit = async () => {
    if (!socket.current) return false;
    socket.current.emit('IS_USER', nickName, isUserCallback);
  };

  return (
    <LoginPageStyled>
      <input type="text" onChange={handleChange} />
      <button onClick={handleClickLoginSubmit}>버튼</button>
      {error && <div>닉네임이 중복입니다.</div>}
    </LoginPageStyled>
  );
}

const LoginPageStyled = styled.div``;
