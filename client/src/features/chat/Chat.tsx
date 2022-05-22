import styled from '@emotion/styled';
import { User, Users } from '@src/@types/User_types';
import { useState, useEffect } from 'react';
import { ChatContents } from './ChatContents';
import { ChatMessageInput, ChatTypingMessage } from './ChatMessageInput';
import { ChatRoomHeader } from './ChatRoomHeader';

type MessageType = 'NEW_USER' | 'DEFAULT';

interface Message {
  type: MessageType;
  id: string;
  time: Date;
  message: string;
  sender: User;
}

export function Chat({ socket, user, logout }: any) {
  const [typingUser, setTypingUser] = useState(false);
  const [messageList, setMessageList] = useState<Message[]>([]);

  console.log(user);

  useEffect(() => {
    console.log(
      '==========================ChatPage2 useEffect====================================',
    );
    socket.current.on(
      'NEW_USER',
      ({ newUser, users, message }: { newUser: User; users: Users; message: Message }) => {
        console.log('==================[INFO] NEW_USER================');
        console.log(newUser);
        console.log(users);
        console.log(message);
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
