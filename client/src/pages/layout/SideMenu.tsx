import styled from '@emotion/styled';
import { MutableRefObject } from 'react';
import { Socket } from 'socket.io-client';
import { ActiveChannel } from '../chat';
import { User, Users } from '../User_types';

interface propTypes {
  socket: MutableRefObject<Socket | undefined>;
  user: User;
  users: Users;
  chats: ActiveChannel[];
  onLogout: () => void;
}

//온라인 유저 리스트 생성
const OnlineUserList = (user: User, users: Users) => {
  console.log('[INFO] OnlineUserList ==============');
  console.log(users);
  return Object.keys(users).map((user) => {
    console.log(user);
    return <div>{user}</div>;
  });
};

// 채널 리스트 생성
const ChannelList = (chats: ActiveChannel[]) => {
  console.log('[INFO] ChannelList ==============');
  console.log(chats);
  return chats.map((chat) => (
    <div key={chat.name}>
      # {chat.name}
      {chat.msgCount > 0 && <strong>{chat.msgCount}</strong>}
    </div>
  ));
};

const checkChannel = (isChannel: boolean) => {
  // 채널 중복 체크
  return true;
};

const handleMakeChannel = (socket: any) => {
  const channelName = 'TEST';
  const channelDescription = 'TEST_DESC';
  const channelId = 'TEST_ID';
  socket.emit('CHECK_CHANNEL', { channelName, channelDescription, channelId }, checkChannel);
};

export function SideMenu({ socket, user, users, chats, onLogout }: propTypes) {
  console.log('SideMenu');
  console.log(user);
  console.log(users);
  console.log(chats);
  console.log(chats[0] && ChannelList(chats));

  return (
    <SideMenuStyled>
      <div>로그인 정보 : {user.nickName}</div>
      <div onClick={onLogout}>로그아웃</div>
      <div onClick={() => handleMakeChannel(socket)}>채널 생성</div>s
      <div>
        채널 리스트
        {chats[0] && ChannelList(chats)}
      </div>
      <div>
        온라인 유저리스트
        {users && OnlineUserList(user, users)}
      </div>
    </SideMenuStyled>
  );
}

const SideMenuStyled = styled.div``;
