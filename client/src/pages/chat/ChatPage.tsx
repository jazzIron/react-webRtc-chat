import styled from '@emotion/styled';
import { Chat } from '@src/features/chat/Chat';
import { MessageOutlined, PhoneOutlined, PieChartOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Layout, List, Menu, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import { User, Users } from '@src/@types/User_types';
import { AVATAR_LIST } from '@src/components/image/avatarList';
const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const OnlineUser = (user: User) => {
  console.log('==================OnlineUser=============================');

  const UserWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 24px;
    color: #fff;
    & span {
      width: 20px;
      height: 20px;
    }
    & p {
      size: 12px;
    }
  `;

  return (
    <>
      <UserWrapper>
        <Badge dot color="green">
          <Avatar shape="square" src={AVATAR_LIST[user.userAvatar]} alt="User Avatar Icon" />
        </Badge>
        <p>{user.nickName}</p>
      </UserWrapper>
    </>
  );
};

function getItem(label: string, key: string, icon?: any, children?: any) {
  return {
    key,
    icon,
    children,
    label,
  };
}

export function ChatPage({ socket, user, logout }: any) {
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState<Users | undefined>();

  const onUpdateUsers = (users: Users) => {
    console.log('[INFO] onUpdateUsers ==================');
    console.log(users);
    setUsers(users);
  };

  useEffect(() => {}, [users]);

  return (
    <ChatPageStyled>
      <Layout hasSider>
        <Sider
          style={{
            overflowY: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Menu theme="dark" mode="inline" defaultOpenKeys={['sub1']} subMenuOpenDelay={0}>
            <SubMenu key="sub1" icon={<UserOutlined />} title={'OnlineList'}>
              <List
                size="small"
                dataSource={users?.users}
                renderItem={(user) => OnlineUser(user)}
              />
            </SubMenu>
          </Menu>
        </Sider>
        <Layout
          className="site-layout"
          style={{
            marginLeft: 200,
          }}
        >
          <Content>
            <Chat socket={socket} user={user} logout={logout} updateUsers={onUpdateUsers} />
          </Content>
        </Layout>
      </Layout>
    </ChatPageStyled>
  );
}

const ChatPageStyled = styled.div``;
