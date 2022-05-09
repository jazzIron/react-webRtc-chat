import styled from '@emotion/styled';
import useSocketIo from '@src/hooks/socketIo/useSocketIo';
import events from 'events';
import { useEffect, useState } from 'react';
import { ChatPage } from '../chat/ChatPage';
import { LoginPage } from '../login/LoginPage';

interface PChat {
  name: string;
  description: string;
  messages: [];
  isTyping: boolean;
  msgCount: number;
  type: string;
}

interface UsersData {
  newUsers: any;
  outUser: any;
}

export function MainPage() {
  const [user, setUser] = useState<{ nickName: string; socket: string }>();
  const [users, setUsers] = useState();
  const [pChats, setPchats] = useState<PChat[]>([]);
  const [loading, setLoading] = useState(true);
  const { socketRef, socket } = useSocketIo();

  const usersData =
    (isNewUsers: boolean) =>
    ({ newUsers, outUser }: UsersData) => {
      if (isNewUsers) {
        let newPChats = [...pChats];
        let oldPChats = pChats.map((pChat) => pChat.name);
        user &&
          Object.keys(newUsers).map((newUser) => {
            if (newUser !== user.nickName && !oldPChats.includes(newUser)) {
              newPChats.push({
                name: newUser,
                description: 'direct message',
                messages: [],
                isTyping: false,
                msgCount: 0,
                type: 'Private',
              });
            }
            return null;
          });

        setUsers(newUsers);
        setPchats(newPChats);
      } else {
        const newPChats = pChats.filter((pChat) => pChat.name !== outUser);
        setUsers(newUsers);
        setPchats(newPChats);
      }
    };

  const initSocket = () => {
    if (!socketRef.current) return false;
    socketRef.current.on('connect', () => console.log('Connected'));
    socketRef.current.on('LOGOUT', usersData(false));
    socketRef.current.on('NEW_USER', usersData(true));
  };

  useEffect(() => {
    initSocket();
  }, []);

  useEffect(() => {
    if (socketRef.current) setLoading(false);
  }, [socketRef.current]);

  const handleSetUser = (user: any) => {
    if (!socketRef.current) return false;
    setUser(user);
    socketRef.current.emit('NEW_USER', user);
  };

  const logout = () => {
    if (!socketRef.current) return false;
    socketRef.current.emit('LOGOUT');
    setUser(undefined);
  };

  if (loading) return <div>loading ...........</div>;
  if (user)
    return (
      <>
        <div onClick={logout}>로그아웃</div>
        <ChatPage socket={socket} />
      </>
    );
  return (
    <MainPageStyled>
      <LoginPage socket={socketRef} setUser={handleSetUser} />
    </MainPageStyled>
  );
}

const MainPageStyled = styled.div``;
