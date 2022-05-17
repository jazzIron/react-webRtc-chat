import styled from '@emotion/styled';
import { isEmpty } from 'lodash';
import { MutableRefObject, useState } from 'react';
import { Socket } from 'socket.io-client';
import { User, UserData } from '../User_types';

interface propTypes {
  socket?: MutableRefObject<Socket | undefined>;
  setUser?: (user: User) => void;
}

interface isUserCallback {
  user: {
    nickName: string;
    socketId: string;
  };
  isUser: boolean;
}

export function LoginPage({ socket, setUser }: propTypes) {
  const [userData, setUserData] = useState<UserData>({
    nickName: `USER_${Math.floor(Math.random() * 1000) + 1}`,
    error: '',
  });

  const loginSuccess = (user: User) => {
    setUserData((prev) => {
      return {
        ...prev,
        error: '',
      };
    });
    setUser && setUser(user);
  };

  const loginFail = () => {
    setUserData((prev) => {
      return {
        ...prev,
        error: 'Already nickname',
      };
    });
    return console.error('Already nickname');
  };

  const isUserCallback = ({ user, isUser }: isUserCallback) => {
    return isUser ? loginFail() : loginSuccess(user);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUserData((prev) => {
      return {
        ...prev,
        nickName: e.target.value,
      };
    });
  };

  const handleClickLoginSubmit = async () => {
    if (!socket) return false;
    if (!socket.current) return false;
    if (isEmpty(userData.nickName)) return false;
    socket.current.emit('LOGIN', userData.nickName, isUserCallback);
  };

  return (
    <LoginPageStyled>
      <input type="text" onChange={handleChange} placeholder={'닉네임을 입력해 주세요.'} />
      <SubmitBtnWrapper onClick={handleClickLoginSubmit}>접속</SubmitBtnWrapper>
      {userData.error && <ErrorMsgWrapper>{userData.error}</ErrorMsgWrapper>}
    </LoginPageStyled>
  );
}

const LoginPageStyled = styled.div`
  display: flex;
  text-align: center;
`;

const SubmitBtnWrapper = styled.div`
  padding: 1rem;
  background-color: #000;
  color: #fff;
  size: 16px;
`;

const ErrorMsgWrapper = styled.div`
  margin-top: 8px;
  color: red;
  font-weight: 700;
`;
