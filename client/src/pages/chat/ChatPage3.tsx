import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { MessageInput } from './MessageInput';

interface Message {
  id: string;
  time: Date;
  message: string;
  sender: string;
}

export function ChatPage3({ socket, user, users, logout }: any) {
  const [typingUser, setTypingUser] = useState(false);
  const [messageList, setMessageList] = useState<Message[]>([]);

  console.log(user);

  useEffect(() => {
    console.log(
      '==========================ChatPage2 useEffect====================================',
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
    socket.current.emit('MESSAGE_SEND', { roomId: 'ROOM_COMMUNITY', msg });
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
    <ChatPageStyled>
      <MessageInput sendMsg={sendMsg} sendTyping={sendTyping} />
      {typingUser && <div>유저 타이핑중.....</div>}
      {messageList &&
        messageList.map((v: any) => {
          return (
            <>
              <div>{v.message}</div>
              <div>{v.sender}</div>
              <div>{v.time}</div>
            </>
          );
        })}
    </ChatPageStyled>
  );
}

const ChatPageStyled = styled.div``;
