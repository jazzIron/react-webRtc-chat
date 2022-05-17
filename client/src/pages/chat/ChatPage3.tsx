import styled from '@emotion/styled';
import { useEffect } from 'react';
import { MessageInput } from './MessageInput';

export function ChatPage3({ socket, user, users, logout }: any) {
  useEffect(() => {
    console.log(
      '==========================ChatPage2 useEffect====================================',
    );
    socket.current.emit('INIT_ROOM', () => {
      console.log('INIT_ROOM');
    });
  }, []);

  const sendMsg = (msg: string) => {
    console.log('========================== [INFO] sendMsg ==========');
  };

  const sendTyping = (isTyping: boolean) => {
    console.log('================== [INFO] sendTyping==================');
  };
  return (
    <ChatPageStyled>
      <MessageInput sendMsg={sendMsg} sendTyping={sendTyping} />
    </ChatPageStyled>
  );
}

const ChatPageStyled = styled.div``;
