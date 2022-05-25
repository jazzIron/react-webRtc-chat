import styled from '@emotion/styled';
import { Chat } from '@src/features/chat/Chat';
import { Layout } from 'antd';
import { useState, useEffect } from 'react';
import { User, Users } from '@src/@types/User_types';
import { SideMenu } from '@src/layout/SideMenu';
const { Content, Sider } = Layout;

export function ChatPage({ socket, user, logout }: any) {
  const [users, setUsers] = useState<Users | undefined>();

  const onUpdateUsers = (users: Users) => {
    console.log('[INFO] onUpdateUsers ==================');
    console.log(users);
    setUsers(users);
  };

  return (
    <ChatPageStyled>
      <SideMenuWrapper>
        <SideMenu />
      </SideMenuWrapper>

      <ChatWrapper>
        <Chat socket={socket} user={user} logout={logout} updateUsers={onUpdateUsers} />
      </ChatWrapper>
    </ChatPageStyled>
  );
}

const ChatPageStyled = styled.div`
  display: flex;
`;

const SideMenuWrapper = styled.div`
  width: 30%;
  max-width: 250px;
  min-width: 220px;
`;
const ChatWrapper = styled.div`
  width: 100%;
`;
