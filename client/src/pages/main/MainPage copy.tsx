import styled from '@emotion/styled';
import useSocketIo from '@src/hooks/socketIo/useSocketIo';
import { chatsState } from '@src/store/chatState';
import { SocketMsgType } from '@src/utils/Constant';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { PChat } from '../chat';
import { ChatPage2 } from '../chat/ChatPage2';
import { LoginPage } from '../login/LoginPage';
import { User, Users } from '../User_types';

export function MainPage() {
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<Users>();
  const [pChats, setPChats] = useState<PChat[]>([]);
  const [loading, setLoading] = useState(true);
  const { socketRef, socket } = useSocketIo();

  const [chatss, setChats] = useRecoilState(chatsState);

  const usersData =
    (isNewUsers: boolean) =>
    ({ newUsers, outUser }: any) => {
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
      } else {
        const newPChats = pChats.filter((pChat) => pChat.name !== outUser);
        setUsers(newUsers);
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
    console.log('==================MAIN_PAGE_ useEffect=================');
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

  console.log('==================MAIN_PAGE=================');

  if (user)
    return (
      <>
        <ChatPage2 socket={socket} user={user} chatss={chatss} pChats={pChats} logout={logout} />
        {/* <ChatPage socket={socket} user={user} pChats={pChats} logout={logout} /> */}
      </>
    );
  return (
    <MainPageStyled>
      {/* <LoginPage socket={socketRef} setUser={handleSetUser} /> */}
    </MainPageStyled>
  );
}

const MainPageStyled = styled.div``;
