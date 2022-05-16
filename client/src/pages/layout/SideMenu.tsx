import styled from '@emotion/styled';
import { SocketMsgType } from '@src/utils/Constant';
import { MutableRefObject } from 'react';
import { Socket } from 'socket.io-client';
import { ActiveChannel, PChat } from '../chat';
import { User, Users } from '../User_types';

interface propTypes {
  socket: MutableRefObject<Socket | undefined>;
  user: User;
  users: Users;
  chats: ActiveChannel[];
  pChats: PChat[];
  activeChannel: ActiveChannel;
  setActiveChannel: (name: string) => void;
  setActivePrivateChannel: (name: string) => void;
  onLogout: () => void;
}

//온라인 유저 리스트 생성
const OnlineUserList = (
  user: User,
  users: Users,
  pChats: PChat[],
  activeChannel: ActiveChannel,
  setActivePrivateChannel: (name: string) => void,
) => {
  // console.log('[INFO] OnlineUserList ==============');
  // console.log(users);
  return Object.keys(users).map((user) => {
    const pChat = pChats.filter((pchat) => pchat.name === user);
    let msgCount = null;
    if (pChat[0] && pChat[0].name !== activeChannel.name) {
      if (pChat[0].msgCount > 0) {
        msgCount = pChat[0].msgCount;
      }
    }
    return (
      <div onClick={() => setActivePrivateChannel(user)}>
        <div>{user}</div>
        <div>{msgCount && { msgCount }}</div>
      </div>
    );
  });
};

// 채널 리스트 생성
const ChannelList = (chats: ActiveChannel[], setActiveChannel: any) => {
  console.log('[INFO] ChannelList ==============');
  console.log(chats);
  if (chats.length <= 0) return false;
  return chats.map((chat) => (
    <div key={chat.name} onClick={() => setActiveChannel(chat.name)}>
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
  console.log('===================[INFO] handleMakeChannel=====================');
  const channelName = `CHANNEL_${Math.floor(Math.random() * 100)}`;
  const channelDescription = 'Common_Channel';
  socket.emit(SocketMsgType.CHECK_CHANNEL, { channelName, channelDescription }, checkChannel);
};

export function SideMenu({
  socket,
  user,
  users,
  chats,
  pChats,
  activeChannel,
  onLogout,
  setActiveChannel,
  setActivePrivateChannel,
}: propTypes) {
  //const channelList = ChannelList(chats, setActiveChannel);

  const checkChannelList = () => {
    console.log('===================[INFO] checkChannelList=====================');
    console.log(chats);
  };

  console.log(`=====================[INFO] SideMenu ================`);
  console.log(chats);
  return (
    <SideMenuStyled>
      <div onClick={checkChannelList}>로그인 정보 : {user.nickName}</div>
      <div onClick={onLogout}>로그아웃</div>
      <div onClick={() => handleMakeChannel(socket)}>채널 생성</div>
      <div>
        채널 리스트
        {chats[0] && ChannelList(chats, setActiveChannel)}
      </div>
      <div>
        온라인 유저리스트
        {users && OnlineUserList(user, users, pChats, activeChannel, setActivePrivateChannel)}
      </div>
    </SideMenuStyled>
  );
}

const SideMenuStyled = styled.div``;
