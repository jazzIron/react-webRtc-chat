import styled from '@emotion/styled';
import useSocketIo from '@src/hooks/socketIo/useSocketIo';
import { Socket } from 'dgram';
import { useEffect, useRef, useState } from 'react';
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
  const [user, setUser] = useState<{ nickName: string; soketId: string }>();
  const [users, setUsers] = useState();
  const [pChats, setPchats] = useState<PChat[]>([]);
  const [loading, setLoading] = useState(true);
  const { socketRef, createNewSocket } = useSocketIo();

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
    createNewSocket();
    if (!socketRef.current) return false;
    socketRef.current.on('connect', () => console.log('Connected'));
    socketRef.current.on('LOGOUT', usersData(false));
    socketRef.current.on('NEW_USER', usersData(true));
  };

  useEffect(() => {
    initSocket();
    console.log(socketRef.current);
  }, []);

  useEffect(() => {
    if (socketRef.current) setLoading(false);
  }, [socketRef.current]);

  if (loading) return <div>loading ...........</div>;
  if (user) return <ChatPage />;
  return (
    <MainPageStyled>
      <LoginPage socket={socketRef} />
    </MainPageStyled>
  );
}

const MainPageStyled = styled.div``;
