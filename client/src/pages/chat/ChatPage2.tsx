import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { MessageHeader } from './MessageHeader';
import { MessageInput } from './MessageInput';
import { MessageContent } from './MessageContent';
import { ActiveChannel, ChannelType, Messages } from './Chat_types';
import { SocketMsgType } from '@src/utils/Constant';
import { SideMenu } from '../layout/SideMenu';
import { useSetRecoilState } from 'recoil';
import { chatsState } from '@src/store/chatState';

interface AddTyping {
  channel: ChannelType;
  isTyping: boolean;
  sender: string;
}

export function ChatPage2({ socket, user, users, chatss, pChats, logout }: any) {
  const setChats = useSetRecoilState(chatsState);

  useEffect(() => {
    console.log(
      '==========================ChatPage2 useEffect====================================',
    );
    socket.emit(SocketMsgType.INIT_CHATS, initChats);
    socket.on(SocketMsgType.MESSAGE_SEND, addMessage);

    socket.on(SocketMsgType.TYPING, addTyping);
    socket.on(SocketMsgType.CREATE_CHANNEL, updateChats);
  }, []);

  const [chatData, setChatData] = useState<{
    chats: any;
    activeChannel: any;
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
      description: 'Public room@@@@@',
      messages: [],
      msgCount: 0,
      name: 'Community',
      typingUser: [],
    },
  });

  const [loading, setLoading] = useState(true);

  const initChats = (_chats: ActiveChannel[]) => {
    console.log('==========================initChats====================================');
    console.log(_chats);
    updateChats(_chats, true);
  };

  const updateChats = (_chats: ActiveChannel[], init: boolean = false) => {
    console.warn('========================== [INFO] updateChats ==========');
    console.log(chatData);

    const { chats, activeChannel } = chatData;
    //const newChats = init ? [..._chats] : [...chats, _chats];

    console.warn('[INFO] updateChats ==========');
    //console.log(newChats);
    //console.log(init ? _chats[0] : activeChannel);

    setChatData((prev) => {
      return {
        chats: init ? [..._chats] : [...prev.chats, _chats],
        activeChannel: init ? _chats[0] : prev.activeChannel,
      };
    });

    setLoading(false);
  };

  const sendMsg = (msg: string) => {
    console.log('========================== [INFO] sendMsg ==========');
    console.log(chatData);
    const { activeChannel } = chatData;
    socket.emit(SocketMsgType.MESSAGE_SEND, { channel: activeChannel.name, msg });
  };

  const sendTyping = (isTyping: boolean) => {
    console.log('================== [INFO] sendTyping==================');
    console.log(chatData);
    const { activeChannel } = chatData;
    socket.emit(SocketMsgType.TYPING, { channel: activeChannel.name, isTyping });
  };

  const addTyping = ({ channel, isTyping, sender }: AddTyping) => {
    console.warn('=====================addTyping======================');
    console.log(chatData);
    console.log(chatss);

    if (sender === user.nickName) return;
    chatData.chats.map((chat: any) => {
      if (chat.name === channel) {
        if (isTyping && !chat.typingUser.includes(sender)) {
          chat.typingUser.push(sender);
        } else if (!isTyping && chat.typingUser.includes(sender)) {
          chat.typingUser = chat.typingUser.filter((val: any) => val !== sender);
        }
      }
      return null;
    });
    // setChatData({
    //   activeChannel: chats[0],
    //   chats: chats,
    // });
  };

  interface AddMessage {
    channel: string;
    message: Messages;
  }

  const addMessage = ({ channel, message }: AddMessage) => {
    console.log('=====================addMessage======================');
    console.log(chatData);
    const { chats, activeChannel } = chatData;
    chats.map((chat: any) => {
      if (chat.name === channel) {
        chat.messages.push(message);
        if (activeChannel.name !== channel) chat.msgCount++;
      }
      return null;
    });

    setChatData((prev) => {
      return {
        chats: [chats, ...prev.chats],
        activeChannel: chats[0],
      };
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
