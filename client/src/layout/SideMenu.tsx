import { CaretRightOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { User } from '@src/@types/User_types';
import { AVATAR_LIST } from '@src/components/image/avatarList';
import { usersState, userState } from '@src/store/userState';
import { Badge, Avatar, Collapse } from 'antd';
import { useRecoilState, useRecoilValue } from 'recoil';
import './SideMenu.scss';

const { Panel } = Collapse;

export function SideMenu() {
  const users = useRecoilValue(usersState);
  const [selectUser, setSelectUser] = useRecoilState(userState);
  const onSelectUser = (user: User) => {
    setSelectUser(user);
  };

  //TODO: LOGIN USER 분기 처리
  return (
    <SideMenuStyled>
      <Collapse
        bordered={false}
        ghost={true}
        defaultActiveKey={['1']}
        expandIconPosition={'right'}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      >
        <Panel header="Online User" key="1" style={{ padding: '0px' }}>
          {users.map((user) => {
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
