import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { MessageHeader } from './MessageHeader';
import { MessageInput } from './MessageInput';
import { MessageContent } from './MessageContent';
import { ActiveChannel, ChannelType, Messages, PChat } from './Chat_types';
import { SocketMsgType } from '@src/utils/Constant';
import { SideMenu } from '../layout/SideMenu';
import { User, Users } from '../User_types';

interface propTypes {
  socket: any;
  user: User;
  users: Users;
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

export function ChatPage({ socket, user, users, pChats, logout }: propTypes) {
  const [chatData, setChatData] = useState<{
    chats: ActiveChannel[];
    activeChannel: ActiveChannel;
  }>({
    chats: [
      { description: 'Public room', messages: [], msgCount: 0, name: 'Community', typingUser: [] },
    ],
    activeChannel: {
      type: 'Community',
      description: 'Public room',
      messages: [],
      msgCount: 0,
      name: 'Community',
      typingUser: [],
    },
  });

  useEffect(() => {
    socket.emit(SocketMsgType.INIT_CHATS, initChats);
    socket.on(SocketMsgType.MESSAGE_SEND, addMessage);
    socket.on(SocketMsgType.TYPING, addTyping);
    socket.on(SocketMsgType.P_MESSAGE_SEND, addPMessage);
    socket.on(SocketMsgType.P_TYPING, addPTyping);
    socket.on(SocketMsgType.CREATE_CHANNEL, updateChats);
  }, []);

  useEffect(() => {
    console.log('[INFO] useEffect =============');
    console.log(chatData);
  }, [chatData]);

  const initChats = (_chats: ActiveChannel[]) => {
    console.log('initChats=====');
    console.log(_chats);
    updateChats(_chats, true);
  };

  const updateChats = (_chats: ActiveChannel[], init: boolean = false) => {
    const { chats, activeChannel } = chatData;
    const newChats: any = init ? [..._chats] : [...chats, _chats];
    setChatData({
      chats: newChats,
      activeChannel: init ? _chats[0] : activeChannel,
    });
  };

  const sendMsg = (msg: string) => {
    const { activeChannel } = chatData;

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
    const { activeChannel } = chatData;

    console.log('================== [INFO] sendTyping==================');
    console.log(chatData);

    if (activeChannel.type === 'Private') {
      const channelName = activeChannel.name;
      // const receiver = users[channelName];
      // socket.emit(SocketMsgType.P_TYPING, { receiver: receiver.socketId, isTyping });
    }
    socket.emit(SocketMsgType.TYPING, { channel: activeChannel.name, isTyping });
  };

  const addTyping = ({ channel, isTyping, sender }: AddTyping) => {
    const { chats } = chatData;

    console.log('================== [INFO] addTyping==================');
    console.log(channel);
    console.log(isTyping);
    console.log(sender);
    console.log(user);
    console.log(chatData);

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

    setChatData((prev) => {
      return {
        ...prev,
        chats: chats,
      };
    });
  };

  const addMessage = ({ channel, message }: AddMessage) => {
    const { chats, activeChannel } = chatData;

    console.log('================== [INFO] addMessage==================');
    console.log(channel);
    console.log(message);
    console.log(chatData);

    chats.map((chat) => {
      if (chat.name === channel) {
        chat.messages.push(message);
        if (activeChannel.name !== channel) chat.msgCount++;
      }
      return null;
    });

    setChatData((prev) => {
      // activeChannel: chats[0],
      return {
        ...prev,
        chats: chats,
      };
    });
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
    const { activeChannel } = chatData;
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

  const setActiveChannel = (name: string) => {
    const newActiveChannel = chatData.chats.filter((chat) => chat.name === name);
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
    // setChatData((prev) => {
    //   return {
    //     ...prev,
    //     activeChannel: newActiveChannel[0],
    //   };
    // });
  };

  console.log('=======================[INFO]ChatPage=======================');
  console.log(chatData.activeChannel);
  console.log(chatData.chats);

  return (
    <ChatPageStyled>
      <SideMenu
        socket={socket}
        user={user}
        users={users}
        chats={chatData.chats}
        pChats={pChats}
        activeChannel={chatData.activeChannel}
        setActiveChannel={setActiveChannel}
        setActivePrivateChannel={setActivePrivateChannel}
        onLogout={logout}
      />
      {chatData.activeChannel && (
        <>
          <MessageHeader activeChannel={chatData.activeChannel} />
          <MessageContent user={user} activeChannel={chatData} />
          <MessageInput sendMsg={sendMsg} sendTyping={sendTyping} />
        </>
      )}
    </ChatPageStyled>
  );
}

const ChatPageStyled = styled.div``;
