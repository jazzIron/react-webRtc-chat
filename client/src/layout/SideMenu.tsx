import { CaretRightOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { User, Users } from '@src/@types/User_types';
import { AVATAR_LIST } from '@src/components/image/avatarList';
import { loginUserState, usersState, userState } from '@src/store/userState';
import { Badge, Avatar, Collapse } from 'antd';
import { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import './SideMenu.scss';

const { Panel } = Collapse;

const usersFilter = (users: User[], loginUser: User) => {
  console.log(users);
  console.log(loginUser);
  return users.filter((user) => user.socketId !== loginUser.socketId);
};

export function SideMenu() {
  const users = useRecoilValue(usersState);
  const loginUser = useRecoilValue(loginUserState);
  const [selectUser, setSelectUser] = useRecoilState(userState);
  const onSelectUser = (user: User) => {
    setSelectUser(user);
  };
  const onlineUsers = usersFilter(users, loginUser);

  console.log('loginUser========================');
  console.log(loginUser);
  console.log(users);
  console.log(onlineUsers);

  //TODO: LOGIN USER 분기 처리
  return (
    <SideMenuStyled>
      <LoginUserWrapper>
        <AvatarWrapper>
          <AvatarInCircle>
            <Avatar
              shape="square"
              size={50}
              src={AVATAR_LIST[loginUser.userAvatar]}
              alt="User Avatar Icon"
            />
          </AvatarInCircle>
        </AvatarWrapper>

        <p>{loginUser.nickName}</p>
      </LoginUserWrapper>

      <Collapse
        bordered={false}
        ghost={true}
        defaultActiveKey={['1']}
        expandIconPosition={'right'}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      >
        <Panel header="Online User" key="1" style={{ padding: '0px' }}>
          {onlineUsers.map((user) => {
            const activeUser = user.socketId === selectUser.socketId ? true : false;
            return (
              <UserWrapper
                key={user.socketId}
                active={activeUser}
                onClick={() => onSelectUser(user)}
              >
                <Badge dot color="green">
                  <Avatar
                    shape="square"
                    src={AVATAR_LIST[user.userAvatar]}
                    alt="User Avatar Icon"
                  />
                </Badge>
                <p>{user.nickName}</p>
              </UserWrapper>
            );
          })}
        </Panel>
      </Collapse>
    </SideMenuStyled>
  );
}

const SideMenuStyled = styled.div`
  height: 100vh;
  background: #fff;
`;

const UserWrapper = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  ${(props) => {
    return props.active
      ? css`
          background: #0051b8;
          color: #fff;
        `
      : css`
          background: #fff;
          color: #000;
        `;
  }}
  & span {
    width: 20px;
    height: 20px;
  }
  & p {
    font-size: 12px;
  }
`;

const LoginUserWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 24px;
  gap: 8px;
  background: #15184600;
`;

const AvatarWrapper = styled.div`
  display: flex;
  background-color: red;
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const AvatarInCircle = styled.div`
  margin: auto;
  background-color: blue;
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;
