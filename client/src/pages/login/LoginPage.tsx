import styled from '@emotion/styled';
import { SocketMsgType } from '@src/utils/Constant';
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
    nickName: '',
    error: '',
  });

  const isUserCallback = ({ user, isUser }: isUserCallback) => {
    if (isUser) {
      setUserData((prev) => {
        return {
          ...prev,
          error: 'Already nickname',
        };
      });
      return console.error('Already nickname');
    } else {
      setUserData((prev) => {
        return {
          ...prev,
          error: '',
        };
      });
      setUser && setUser(user);
    }
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
    socket.current.emit(SocketMsgType.IS_USER, userData.nickName, isUserCallback);
  };

  return (
    <LoginPageStyled>
      <input type="text" onChange={handleChange} />
      <button onClick={handleClickLoginSubmit}>버튼</button>
      {userData.error && <div>{userData.error}</div>}
    </LoginPageStyled>
  );
}

const LoginPageStyled = styled.div``;
