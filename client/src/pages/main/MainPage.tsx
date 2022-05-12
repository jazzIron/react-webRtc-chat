import styled from '@emotion/styled';
import useSocketIo from '@src/hooks/socketIo/useSocketIo';
import { SocketMsgType } from '@src/utils/Constant';
import { useEffect, useState } from 'react';
import { PChat } from '../chat';
import { ChatPage } from '../chat/ChatPage';
import { LoginPage } from '../login/LoginPage';
import { User, UsersData } from '../User_types';
import { SideMenu } from '../layout/SideMenu';

export function MainPage() {
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>();
  const [pChats, setPChats] = useState<PChat[]>([]);
  const [loading, setLoading] = useState(true);
  const { socketRef, socket } = useSocketIo();

  const setPChatItems = (value: PChat[]) => {
    setPChats(value);
  };

  const usersData =
    (isNewUsers: boolean) =>
    ({ newUsers, outUser }: UsersData) => {
      if (isNewUsers) {
        const newPChats = [...pChats];
        const oldPChats = pChats.map((pChat) => pChat.name);
        user &&
          Object.keys(newUsers).map((newUser) => {
            if (newUser !== user.nickName && !oldPChats.includes(newUser)) {
              newPChats.push({
                name: newUser,
                description: 'directMsg',
                messages: [],
                isTyping: false,
                msgCount: 0,
                type: 'Private',
              });
            }
            return null;
          });
        setUsers(newUsers);
        setPChats(newPChats);
      } else {
        const newPChats = pChats.filter((pChat) => pChat.name !== outUser);
        setUsers(newUsers);
        setPChats(newPChats);
      }
    };

  const initSocket = () => {
    if (!socketRef.current) return false;
    socketRef.current.on('connect', () => console.log('Connected'));
    socketRef.current.on(SocketMsgType.LOGOUT, usersData(false));
    socketRef.current.on(SocketMsgType.NEW_USER, usersData(true));
  };

  useEffect(() => {
    initSocket();
  }, []);

  useEffect(() => {
    if (socketRef.current) setLoading(false);
  }, [socketRef.current]);

  const handleSetUser = (user: User) => {
    if (!socketRef.current) return false;
    setUser(user);
    socketRef.current.emit(SocketMsgType.NEW_USER, user);
  };

  const logout = () => {
    if (!socketRef.current) return false;
    socketRef.current.emit(SocketMsgType.LOGOUT);
    setUser(undefined);
  };

  if (loading) return <div>loading ...........</div>;

  if (user)
    return (
      <>
        <ChatPage
          socket={socket}
          user={user}
          users={users}
          pChats={pChats}
          setPChatItems={setPChatItems}
          logout={logout}
        />
      </>
    );
  return (
    <MainPageStyled>
      <LoginPage socket={socketRef} setUser={handleSetUser} />
    </MainPageStyled>
  );
}

const MainPageStyled = styled.div``;
