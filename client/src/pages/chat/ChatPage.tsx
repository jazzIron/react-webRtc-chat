import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { MessageHeader } from './MessageHeader';
import { MessageInput } from './MessageInput';
import { MessageContent } from './MessageContent';
import { ActiveChannel, ChannelType, Messages } from './Chat_types';
import { SocketMsgType } from '@src/utils/Constant';

export function ChatPage({ socket, user, users, pChats, setPChatItems }: any) {
  const [chatData, setChatData] = useState<{
    chats: ActiveChannel[];
    activeChannel: ActiveChannel;
  }>({
    chats: [
      { description: 'Public room', messages: [], msgCount: 0, name: 'Community', typingUser: [] },
    ],
    activeChannel: {
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

  const initChats = (_chats: ActiveChannel[]) => {
    console.log('initChats=====');
    console.log(_chats);
    updateChats(_chats, true);
  };

  const updateChats = (_chats: ActiveChannel[], init: boolean = false) => {
    console.log(_chats);
    const { chats, activeChannel } = chatData;
    const newChats: any = init ? _chats[0] : [...chats, _chats];

    setChatData({
      chats: newChats,
      activeChannel: init ? _chats[0] : activeChannel,
    });
    console.warn('[INFO] updateChats ==========');
    console.log(newChats);
    console.log(init ? _chats[0] : activeChannel);
  };

  const sendMsg = (msg: string) => {
    const { activeChannel } = chatData;
    if (activeChannel.type === 'Private') {
      const receiver: string = users[activeChannel.name];
      socket.emit(SocketMsgType.P_MESSAGE_SEND, { receiver, msg });
    } else {
      socket.emit(SocketMsgType.MESSAGE_SEND, { channel: activeChannel.name, msg });
    }
  };

  const sendTyping = (isTyping: boolean) => {
    const { activeChannel } = chatData;
    if (activeChannel.type === 'Private') {
      let receiver = users[activeChannel.name];
      socket.emit(SocketMsgType.P_TYPING, { receiver: receiver.socketId, isTyping });
    }
    socket.emit(SocketMsgType.TYPING, { channel: activeChannel.name, isTyping });
  };

  interface AddTyping {
    channel: ChannelType;
    isTyping: boolean;
    sender: string;
  }

  const addTyping = ({ channel, isTyping, sender }: AddTyping) => {
    const { chats } = chatData;
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
    setChatData({
      activeChannel: chats[0],
      chats: chats,
    });
  };

  const addPTyping = ({ channel, isTyping }: Omit<AddTyping, 'sender'>) => {
    pChats.map((pChat: any) => {
      if (pChat.name === channel) pChat.isTyping = isTyping;
      return null;
    });
    setPChatItems(pChats);
  };

  interface AddMessage {
    channel: string;
    message: Messages;
  }

  const addMessage = ({ channel, message }: AddMessage) => {
    const { chats, activeChannel } = chatData;
    chats.map((chat) => {
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

  const addPMessage = ({ channel, message }: AddMessage) => {
    const { activeChannel } = chatData;
    pChats.map((pChat: any) => {
      if (pChat.name === channel) {
        pChat.messages.push(message);
        if (activeChannel.name !== channel) pChat.msgCount++;
      }
      return null;
    });
    setPChatItems(pChats);
  };

  return (
    <ChatPageStyled>
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
