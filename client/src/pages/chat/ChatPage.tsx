import styled from '@emotion/styled';
import { useState, useEffect, useMemo } from 'react';
import { MessageHeader } from './MessageHeader';
import { MessageInput } from './MessageInput';
import { MessageContent } from './MessageContent';
import { ActiveChannel } from './Chat_types';

export function ChatPage({ socket, user, users, pChats, setPChatItems }: any) {
  const [chatData, setChatData] = useState<{
    chats: any[];
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
    console.log('useEffect');
    socket.emit('INIT_CHATS', initChats);
    socket.on('MESSAGE_SEND', addMessage);
    socket.on('TYPING', addTyping);
    socket.on('P_MESSAGE_SEND', addPMessage);
    socket.on('P_TYPING', addPTyping);
    socket.on('CREATE_CHANNEL', updateChats);
  }, []);

  const initChats = (_chats: any) => updateChats(_chats, true);

  const updateChats = (_chats: any, init = false) => {
    const { chats, activeChannel } = chatData;
    const newChats = init ? [..._chats] : [...chats, _chats];
    setChatData((prev) => {
      return {
        chats: newChats,
        activeChannel: init ? _chats[0] : prev.activeChannel,
      };
    });
    console.warn('[INFO] updateChats ==========');
    console.log(newChats);
  };

  const sendMsg = (msg: any) => {
    const { chats, activeChannel } = chatData;
    if (activeChannel.type === 'Private') {
      const receiver = users[activeChannel.name];
      socket.emit('P_MESSAGE_SEND', { receiver, msg });
    } else {
      socket.emit('MESSAGE_SEND', { channel: activeChannel.name, msg });
    }
  };

  const sendTyping = (isTyping: boolean) => {
    const { chats, activeChannel } = chatData;
    if (activeChannel.type === 'Private') {
      let receiver = users[activeChannel.name];
      socket.emit('P_TYPING', { receiver: receiver.socketId, isTyping });
    }
    socket.emit('TYPING', { channel: activeChannel.name, isTyping });
  };

  const addTyping = ({ channel, isTyping, sender }: any) => {
    const { chats, activeChannel } = chatData;
    if (sender === user.nickName) return;
    chats.map((chat: any) => {
      if (chat.name === channel) {
        if (isTyping && !chat.typingUser.includes(sender)) {
          chat.typingUser.push(sender);
        } else if (!isTyping && chat.typingUser.includes(sender)) {
          chat.typingUser = chat.typingUser.filter((u: any) => u !== sender);
        }
      }
      return null;
    });
    setChatData((prev) => {
      return {
        ...prev,
        chats,
      };
    });
  };

  const addPTyping = ({ channel, isTyping }: any) => {
    console.log(channel, isTyping);
    pChats.map((pChat: any) => {
      if (pChat.name === channel) {
        pChat.isTyping = isTyping;
      }
      return null;
    });
    setPChatItems(pChats);
  };

  const addMessage = ({ channel, message }: { channel: string; message: any }) => {
    const { chats, activeChannel } = chatData;
    console.log('[INFO] addMessage ======');
    console.log(chats);
    console.log(activeChannel);

    chats.map((chat: any) => {
      if (chat.name === channel) {
        chat.messages.push(message);
        if (activeChannel.name !== channel) chat.msgCount++;
      }
      return null;
    });
    setChatData((prev) => {
      return {
        ...prev,
        chats,
      };
    });
  };

  const addPMessage = ({ channel, message }: { channel: string; message: any }) => {
    const { chats, activeChannel } = chatData;
    pChats.map((pChat: any) => {
      if (pChat.name === channel) {
        pChat.messages.push(message);
        if (activeChannel.name !== channel) pChat.msgCount++;
      }
      return null;
    });
    setPChatItems(pChats);
  };

  console.log('[INFO] ChatPage ======');
  console.log(chatData);

  return (
    <ChatPageStyled>
      {chatData.activeChannel && (
        <>
          <MessageHeader activeChannel={chatData.activeChannel} />
          <MessageContent />
          <MessageInput sendMsg={sendMsg} sendTyping={sendTyping} />
        </>
      )}
    </ChatPageStyled>
  );
}

const ChatPageStyled = styled.div``;
