import styled from '@emotion/styled';
import useSocketIo from '@src/hooks/socketIo/useSocketIo';
import { SocketMsgType } from '@src/utils/Constant';
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
  const [pChats, setPChats] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const { socketRef, socket } = useSocketIo();

  const setPChatItems = (value: any) => {
    setPChats(value);
  };

  const usersData =
    (isNewUsers: boolean) =>
    ({ newUsers, outUser }: UsersData) => {
      if (isNewUsers) {
        let newPChats = [...pChats];
        let oldPChats = pChats.map((pChat: any) => pChat.name);
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
        setPChats(newPChats);
      } else {
        const newPChats = pChats.filter((pChat: any) => pChat.name !== outUser);
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

  const handleSetUser = (user: any) => {
    if (!socketRef.current) return false;
    setUser(user);
    socketRef.current.emit(SocketMsgType.NEW_USER, user);
  };

  const logout = () => {
    if (!socketRef.current) return false;
    socketRef.current.emit(SocketMsgType.LOGOUT);
    setUser(undefined);
  };

  console.log('*********************MainPage********************');

  if (loading) return <div>loading ...........</div>;
  if (user)
    return (
      <>
        <div onClick={logout}>로그아웃</div>
        <ChatPage
          socket={socket}
          user={user}
          users={users}
          pChats={pChats}
          setPChatItems={setPChatItems}
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
