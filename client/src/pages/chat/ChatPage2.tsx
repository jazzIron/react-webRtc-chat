import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { MessageHeader } from './MessageHeader';
import { MessageInput } from './MessageInput';
import { MessageContent } from './MessageContent';
import { ActiveChannel, ChannelType, Messages } from './Chat_types';
import { SocketMsgType } from '@src/utils/Constant';
import { SideMenu } from '../layout/SideMenu';

export function ChatPage2({ socket, user, users, pChats, setPChatItems, logout }: any) {
  const [chatData, setChatData] = useState<{
    chats: any;
    activeChannel: ActiveChannel;
  }>({
    chats: [
      {
        description: 'Public room!!',
        messages: [],
        msgCount: 0,
        name: 'Community',
        typingUser: [],
      },
    ],
    activeChannel: {
      description: 'Public room!!',
      messages: [],
      msgCount: 0,
      name: 'Community',
      typingUser: [],
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.emit(SocketMsgType.INIT_CHATS, initChats);
    socket.on(SocketMsgType.MESSAGE_SEND, addMessage);
    socket.on(SocketMsgType.TYPING, addTyping);
    socket.on(SocketMsgType.CREATE_CHANNEL, updateChats);
  }, []);

  const initChats = (_chats: ActiveChannel[]) => {
    console.log('initChats====================================');
    console.log(_chats);
    updateChats(_chats, true);
  };

  const updateChats = (_chats: ActiveChannel[], init: boolean = false) => {
    console.log(_chats);
    console.log(init);
    const { chats, activeChannel } = chatData;
    const newChats = init ? [..._chats] : [...chats, _chats];

    console.warn('[INFO] updateChats ==========');
    console.log(newChats);
    console.log(init ? _chats[0] : activeChannel);

    setChatData({
      chats: newChats,
      activeChannel: init ? _chats[0] : activeChannel,
    });

    setLoading(false);
  };

  const sendMsg = (msg: string) => {
    const { activeChannel } = chatData;
    socket.emit(SocketMsgType.MESSAGE_SEND, { channel: activeChannel.name, msg });
  };

  const sendTyping = (isTyping: boolean) => {
    const { activeChannel } = chatData;
    socket.emit(SocketMsgType.TYPING, { channel: activeChannel.name, isTyping });
  };

  interface AddTyping {
    channel: ChannelType;
    isTyping: boolean;
    sender: string;
  }

  const addTyping = ({ channel, isTyping, sender }: AddTyping) => {
    const { chats } = chatData;

    console.log('=====================addTyping======================');
    console.log(chatData);

    if (sender === user.nickName) return;
    chats.map((chat: any) => {
      if (chat.name === channel) {
        if (isTyping && !chat.typingUser.includes(sender)) {
          chat.typingUser.push(sender);
        } else if (!isTyping && chat.typingUser.includes(sender)) {
          chat.typingUser = chat.typingUser.filter((val: any) => val !== sender);
        }
      }
      return null;
    });
    setChatData({
      activeChannel: chats[0],
      chats: chats,
    });
  };

  interface AddMessage {
    channel: string;
    message: Messages;
  }

  const addMessage = ({ channel, message }: AddMessage) => {
    const { chats, activeChannel } = chatData;
    chats.map((chat: any) => {
      if (chat.name === channel) {
        chat.messages.push(message);
        if (activeChannel.name !== channel) chat.msgCount++;
      }
      return null;
    });
    setChatData({
      activeChannel: chats[0],
      chats: chats,
    });
  };

  const onActiveChannel = (name: string) => {
    const { chats } = chatData;
    const newActiveChannel = chats.filter((chat: any) => chat.name === name);
    newActiveChannel[0].msgCount = 0;

    console.log('[INFO] setActiveChannel *************************');
    console.log(newActiveChannel);

    setChatData((prev) => {
      return {
        ...prev,
        activeChannel: newActiveChannel[0],
      };
    });
  };

  const setActivePrivateChannel = (name: string) => {
    const newActiveChannel = pChats.filter((pChat: any) => pChat.name === name);
    newActiveChannel[0].msgCount = 0;
    //setActiveChannel(newActiveChannel[0]);
  };

  console.log('=======================================chatpage2============================');
  console.log(loading);
  console.log(chatData);

  if (loading) return <div>loading...............</div>;

  return (
    <ChatPageStyled>
      <SideMenu
        socket={socket}
        user={user}
        users={users}
        chats={chatData.chats}
        pChats={pChats}
        activeChannel={chatData.activeChannel}
        setActiveChannel={onActiveChannel}
        setActivePrivateChannel={setActivePrivateChannel}
        onLogout={logout}
      />
      {chatData.activeChannel && (
        <>
          <MessageHeader activeChannel={chatData.activeChannel} />
          <MessageContent
            user={user}
            messages={chatData.activeChannel.messages}
            typingUser={chatData.activeChannel.typingUser}
          />
          <MessageInput sendMsg={sendMsg} sendTyping={sendTyping} />
        </>
      )}
    </ChatPageStyled>
  );
}

const ChatPageStyled = styled.div``;
