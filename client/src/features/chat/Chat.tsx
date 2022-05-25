import styled from '@emotion/styled';
import { User, Users } from '@src/@types/User_types';
import { useState, useEffect } from 'react';
import { ChatContents } from './ChatContents';
import { ChatMessageInput } from './ChatMessageInput';
import { ChatRoomHeader } from './ChatRoomHeader';
import { useRecoilState } from 'recoil';
import { usersState } from '@src/store/userState';
import { activeChannelState, chatsState, Messages, PrivateRoomsState } from '@src/store/chatState';

type MessageType = 'NEW_USER' | 'DEFAULT';

interface Message {
  type: MessageType;
  id: string;
  time: Date;
  message: string;
  sender: User;
}

interface PrivateRoom {
  roomName: string;
  description: string;
  isTyping: boolean;
  messages: Message[];
  msgCount: number;
  user: User;
  type: string;
}

interface PrivateRooms {
  rooms: PrivateRoom[];
}

export function Chat({ socket, user, logout, updateUsers }: any) {
  const [typingUser, setTypingUser] = useState(false);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [users, setUsers] = useRecoilState(usersState);
  const [chats, setChats] = useRecoilState(activeChannelState);
  const [privateRooms, setPrivateRooms] = useRecoilState(PrivateRoomsState);

  console.log(users);
  console.log(privateRooms);

  useEffect(() => {
    console.log(
      '==========================ChatPage2 useEffect====================================',
    );
    socket.current.on(
      'NEW_USER',
      ({
        newUser,
        users,
        message,
        privateRooms,
      }: {
        newUser: User;
        users: Users;
        message: Message;
        privateRooms: PrivateRooms;
      }) => {
        console.log('==================[INFO] NEW_USER================');
        console.log(newUser);
        console.log(users);
        console.log(message);
        console.log(privateRooms);
        updateUsers(users);
        setPrivateRooms(privateRooms);
        setUsers(users.users);
        setMessageList((prev) => {
          return [...prev, message];
        });
      },
    );
    socket.current.emit('INIT_ROOM', user);
    socket.current.on('TYPING', addTyping);
    socket.current.on('MESSAGE_SEND', addMessage);
    socket.current.emit('ROOM_LIST', (rooms: any) => {
      console.log(rooms);
    });
  }, []);

  const addTyping = ({ isTyping, sender }: { isTyping: boolean; sender: string }) => {
    console.warn('=====================addTyping======================');
    if (sender === user.nickName) return;
    setTypingUser(isTyping);
  };

  const sendMsg = (msg: string) => {
    console.log('========================== [INFO] sendMsg ==========');
    socket.current.emit('MESSAGE_SEND', { roomId: 'ROOM_COMMUNITY', type: 'BASIC', msg });
  };

  const sendTyping = (isTyping: boolean) => {
    console.log('================== [INFO] sendTyping==================');
    console.log(chats);
    socket.current.emit('TYPING', { roomId: 'ROOM_COMMUNITY', isTyping });
  };

  const addMessage = ({ roomId, message }: { roomId: string; message: Message }) => {
    console.log('=====================addMessage======================');
    setMessageList((prev) => {
      return [...prev, message];
    });
  };
  return (
    <>
      <ChatRoomHeader user={user} />
      <ChatStyled>
        <ChatContents messages={messageList} typingUser={typingUser} />
        <ChatMessageInput sendMsg={sendMsg} sendTyping={sendTyping} />
      </ChatStyled>
    </>
  );
}

const ChatStyled = styled.div``;
