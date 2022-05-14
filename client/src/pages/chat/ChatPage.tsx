import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { MessageHeader } from './MessageHeader';
import { MessageInput } from './MessageInput';
import { MessageContent } from './MessageContent';
import { ActiveChannel, ChannelType, Messages, PChat } from './Chat_types';
import { SocketMsgType } from '@src/utils/Constant';
import { SideMenu } from '../layout/SideMenu';
import { User, Users } from '../User_types';
import { useRecoilState } from 'recoil';
import { activeChannelState, Chat, chatsState } from '@src/store/chatState';

interface propTypes {
  socket: any;
  user: User;
  // users: Users;
  pChats: PChat[];
  logout: () => void;
}

interface AddTyping {
  channel: string;
  isTyping: boolean;
  sender: string;
}

interface AddMessage {
  channel: string;
  message: Messages;
}

export function ChatPage({ socket, user, pChats, logout }: propTypes) {
  const [chats, setChats] = useRecoilState(chatsState);
  const [activeChannel, setActiveChannel] = useRecoilState(activeChannelState);

  useEffect(() => {
    socket.emit(SocketMsgType.INIT_CHATS, initChats);
    socket.on(SocketMsgType.MESSAGE_SEND, addMessage);
    socket.on(SocketMsgType.TYPING, addTyping);
    socket.on(SocketMsgType.P_MESSAGE_SEND, addPMessage);
    socket.on(SocketMsgType.P_TYPING, addPTyping);
    socket.on(SocketMsgType.CREATE_CHANNEL, updateChats);
  }, []);

  const initChats = (_chats: Chat[]) => {
    console.log('================== [INFO] initChats==================');
    console.log(_chats);
    updateChats(_chats, true);
  };

  const updateChats = (_chats: Chat[], init: boolean = false) => {
    const newChats: any[] = init ? [..._chats] : [...chats, _chats];
    setChats(newChats);
    setActiveChannel(init ? _chats[0] : activeChannel);
  };

  const addTyping = ({ channel, isTyping, sender }: AddTyping) => {
    console.log('================== [INFO] addTyping==================');
    console.log(channel);
    console.log(isTyping);
    console.log(sender);
    console.log(user);
    console.log(chats);

    if (sender === user.nickName) return;
    chats.map((chat) => {
      if (chat.name === channel) {
        if (isTyping && !chat.typingUser.includes(sender)) {
          chat.typingUser.push(sender);
        } else if (!isTyping && chat.typingUser.includes(sender)) {
          chat.typingUser = chat.typingUser.filter((val) => val !== sender);
        }
      }
      return null;
    });
    setChats(chats);
    setActiveChannel(chats[0]);
  };

  const sendMsg = (msg: string) => {
    console.log('================== [INFO] sendMsg==================');
    console.log(activeChannel);

    if (activeChannel.type === 'Private') {
      // const receiver = users[activeChannel.name];
      // console.log(receiver);
      // socket.emit(SocketMsgType.P_MESSAGE_SEND, { receiver, msg });
    } else {
      socket.emit(SocketMsgType.MESSAGE_SEND, { channel: activeChannel.name, msg });
    }
  };

  const sendTyping = (isTyping: boolean) => {
    console.log('================== [INFO] sendTyping==================');
    console.log(chats);

    if (activeChannel.type === 'Private') {
      const channelName = activeChannel.name;
      // const receiver = users[channelName];
      // socket.emit(SocketMsgType.P_TYPING, { receiver: receiver.socketId, isTyping });
    }
    socket.emit(SocketMsgType.TYPING, { channel: activeChannel.name, isTyping });
  };

  const addMessage = ({ channel, message }: AddMessage) => {
    console.log('================== [INFO] addMessage==================');
    console.log(channel);
    console.log(message);
    console.log(chats);

    chats.map((chat) => {
      if (chat.name === channel) {
        chat.messages.push(message);
        if (activeChannel.name !== channel) chat.msgCount++;
      }
      return null;
    });
    setChats(chats);
  };

  const addPTyping = ({ channel, isTyping }: Omit<AddTyping, 'sender'>) => {
    console.log('[INFO] addPTyping**************************');
    console.log(channel, isTyping);
    console.log(pChats);

    pChats.map((pChat: any) => {
      if (pChat.name === channel) pChat.isTyping = isTyping;
      return null;
    });
    // setChatData({
    //   activeChannel: pChats,
    //   chats: pChats,
    // });
  };

  const addPMessage = ({ channel, message }: AddMessage) => {
    pChats.map((pChat: any) => {
      if (pChat.name === channel) {
        pChat.messages.push(message);
        if (activeChannel.name !== channel) pChat.msgCount++;
      }
      return null;
    });
    // setChatData({
    //   activeChannel: pChats,
    //   chats: pChats,
    // });
  };

  const onActiveChannel = (name: string) => {
    const newActiveChannel = chats.filter((chat) => chat.name === name);
    newActiveChannel[0].msgCount = 0;

    console.log('[INFO] setActiveChannel *************************');
    console.log(newActiveChannel);
    setActiveChannel(newActiveChannel[0]);
  };

  const setActivePrivateChannel = (name: string) => {
    const newActiveChannel = pChats.filter((pChat: any) => pChat.name === name);
    newActiveChannel[0].msgCount = 0;
    //setActiveChannel(newActiveChannel[0]);
  };

  console.log('=======================[INFO]ChatPage=======================');
  console.log(chats);
  console.log(activeChannel);

  return (
    <ChatPageStyled>
      {/* <SideMenu
        socket={socket}
        user={user}
        users={users}
        chats={chats}
        pChats={pChats}
        activeChannel={activeChannel}
        setActiveChannel={onActiveChannel}
        setActivePrivateChannel={setActivePrivateChannel}
        onLogout={logout}
      /> */}
      {activeChannel && (
        <>
          <MessageHeader activeChannel={activeChannel} />
          <MessageContent user={user} activeChannel={activeChannel} />
          <MessageInput sendMsg={sendMsg} sendTyping={sendTyping} />
        </>
      )}
    </ChatPageStyled>
  );
}

const ChatPageStyled = styled.div``;
