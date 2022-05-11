import styled from '@emotion/styled';
import { SocketMsgType } from '@src/utils/Constant';
import { isEmpty } from 'lodash';
import { useState } from 'react';

export function LoginPage({ socket, setUser }: any) {
  const [userData, setUserData] = useState<{ nickName: string; error: string }>({
    nickName: '',
    error: '',
  });

  interface isUserCallback {
    user: {
      nickName: string;
      socketId: string;
    };
    isUser: boolean;
  }

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
      setUser(user);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    setUserData((prev) => {
      return {
        ...prev,
        nickName: value,
      };
    });
  };

  const handleClickLoginSubmit = async () => {
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
