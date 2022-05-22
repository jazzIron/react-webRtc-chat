import styled from '@emotion/styled';
import { User } from '@src/@types/User_types';
import { Login } from '@src/features/login/Login';
import { MutableRefObject } from 'react';
import { Socket } from 'socket.io-client';

interface propTypes {
  socket?: MutableRefObject<Socket | undefined>;
  setUser?: (user: User) => void;
}

export function LoginPage({ socket, setUser }: propTypes) {
  return (
    <LoginPageStyled>
      <Login socket={socket} setUser={setUser} />
    </LoginPageStyled>
  );
}

const LoginPageStyled = styled.div`
  background-color: #0051b8;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
