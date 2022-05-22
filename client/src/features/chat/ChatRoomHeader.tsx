import { PhoneOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Badge, Avatar } from 'antd';
import { User } from '@src/@types/User_types';
import { AVATAR_LIST } from '@src/components/image/avatarList';

interface propTypes {
  user: User;
}

export function ChatRoomHeader({ user }: propTypes) {
  return (
    <ChatRoomHeaderWrapper>
      <UserWrapper>
        <Badge dot color="green">
          <Avatar shape="square" src={AVATAR_LIST[user.userAvatar]} alt="User Avatar Icon" />
        </Badge>
        <p>{user.nickName}</p>
      </UserWrapper>

      <PhoneOutlined />
    </ChatRoomHeaderWrapper>
  );
}

const ChatRoomHeaderWrapper = styled.div`
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
