import styled from '@emotion/styled';
import { Chat } from '@src/features/chat/Chat';

export function ChatPage({ socket, user, logout }: any) {
  return (
    <ChatPageStyled>
      <Chat socket={socket} user={user} logout={logout} />
    </ChatPageStyled>
  );
}

const ChatPageStyled = styled.div``;
