import styled from '@emotion/styled';
import { useState, useEffect } from 'react';

export function ChatPage({ socket, users }: any) {
  const [chats, setChats] = useState<any>([]);
  const [activeChannel, setActiveChannel] = useState<any>();

  useEffect(() => {
    socket.emit('INIT_CHATS', initChats);
    // socket.on('MESSAGE_SEND', addMessage);
    // socket.on('TYPING', addTyping);
    // socket.on('P_MESSAGE_SEND', addPMessage);
    // socket.on('P_TYPING', addPTyping);
    socket.on('CREATE_CHANNEL', updateChats);
  }, []);

  const initChats = (_chats: any) => updateChats(_chats, true);

  const updateChats = (_chats: any, init = false) => {
    const newChats = init ? [..._chats] : [...chats, _chats];
    setChats(newChats);
    const activeChannelData = init ? _chats[0] : activeChannel;
    setActiveChannel(activeChannelData);
  };

  const sendMsg = (msg: string) => {
    if (activeChannel.type) {
      let receiver = users[activeChannel.name];
      socket.emit('MESSAGE_SEND', { receiver, msg });
    } else {
      socket.emit('MESSAGE_SEND', { channel: activeChannel.name, msg });
    }
  };

  const sendTyping = (isTyping: any) => {
    if (activeChannel.type) {
      let receiver = users[activeChannel.name];
      socket.emit('P_TYPING', { receiver: receiver.socketId, isTyping });
    }
    socket.emit('TYPING', { channel: activeChannel.name, isTyping });
  };

  return (
    <ChatPageStyled>
      {/* <MessageHeader activeChannel={activeChannel} /> */}
      <MessageInput sendMsg={sendMsg} sendTyping={sendTyping} />
    </ChatPageStyled>
  );
}

const ChatPageStyled = styled.div``;

const MessageHeader = (activeChannel: any) => {
  return (
    <>
      <div>
        {activeChannel.name[0].toUpperCase() + activeChannel.name.slice(1)}
        <span>
          {activeChannel.description[0].toUpperCase() + activeChannel.description.slice(1)}
        </span>
      </div>
    </>
  );
};

const MessageInput = ({ sendMsg, sendTyping }: any) => {
  const [msg, setMsg] = useState<string>('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setMsg(e.target.value);
  const handleSubmit = () => {
    sendMsg(msg);
    setMsg('');
  };

  const handleFocused = () => sendTyping(true);
  const handleBlur = () => sendTyping(false);

  return (
    <>
      <input
        value={msg}
        placeholder="메세지를 입력해주세요."
        onFocus={handleFocused}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>전송</button>
    </>
  );
};
