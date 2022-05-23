import styled from '@emotion/styled';
import { Chat } from '@src/features/chat/Chat';
import { PhoneOutlined, PieChartOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Layout, Menu } from 'antd';
import { useState } from 'react';
import { User, Users } from '@src/@types/User_types';
import { AVATAR_LIST } from '@src/components/image/avatarList';
import { toArray } from 'lodash';
const { Content, Sider } = Layout;

function OnlineUser(users: Users) {
  const userList = toArray(users).map;
  const OnlineUserWrapper = styled.div`
    box-sizing: border-box;
    margin: 0;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 1.5715;
    list-style: none;
    position: relative;
    padding: 16px 24px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  `;

  const UserWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
  `;
  return (
    <OnlineUserWrapper>
      <UserWrapper>
        {/* <Badge dot color="green">
          <Avatar shape="square" src={AVATAR_LIST[user.userAvatar]} alt="User Avatar Icon" />
        </Badge>
        <p>{user.nickName}</p> */}
      </UserWrapper>
    </OnlineUserWrapper>
  );
}

function getItem(label: string, key: string, icon?: any, children?: any) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('CHANNEL LIST', '1', <PieChartOutlined />),
  getItem('USER LIST', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
];

export function ChatPage({ socket, user, logout }: any) {
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState<Users>();

  const onUpdateUsers = (users: Users) => {
    console.log('[INFO] onUpdateUsers ==================');
    console.log(users);
    console.log(toArray(users));
    console.log(user);
    OnlineUser(users);
    setUsers(users);
  };

  return (
    <ChatPageStyled>
      <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout>
          <Content>
            <Chat socket={socket} user={user} logout={logout} updateUsers={onUpdateUsers} />
          </Content>
        </Layout>
      </Layout>
    </ChatPageStyled>
  );
}

const ChatPageStyled = styled.div``;
