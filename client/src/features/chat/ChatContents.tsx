import styled from '@emotion/styled';
import { User } from '@src/@types/User_types';
import { AVATAR_LIST } from '@src/components/image/avatarList';
import { Avatar, Tooltip, Comment, Divider } from 'antd';
import { throttle } from 'lodash';
import moment from 'moment';
import { useRef, useEffect, useMemo } from 'react';
import { ChatTypingMessage } from './ChatMessageInput';

type MessageType = 'NEW_USER' | 'DEFAULT';

interface Message {
  type: MessageType;
  id: string;
  time: Date;
  message: string;
  sender: User;
}

interface propTypes {
  messages: Message[];
  typingUser: boolean;
}

const ChatMessageNewUser = ({ nickName }: { nickName: string }) => {
  const newUserMessage = `[알림] ${nickName}님이 입장하셨습니다.`;
  return <Divider plain>{newUserMessage}</Divider>;
};

const ChatMessage = ({ user, message, time }: { user: User; message?: string; time?: Date }) => {
  return (
    <Comment
      author={user.nickName}
      avatar={<Avatar src={AVATAR_LIST[user.userAvatar]} alt="Han Solo" />}
      content={<p>{message}</p>}
      datetime={
        <Tooltip title={moment(time).format('YYYY-MM-DD HH:mm:ss')}>
          <span>{moment().fromNow()}</span>
        </Tooltip>
      }
    />
  );
};

export function ChatContents({ messages, typingUser }: propTypes) {
  const chatContainerRef = useRef<any>();
  const throttledScroll = useMemo(
    () =>
      throttle(() => {
        if (!chatContainerRef.current) return;
        const scroll =
          chatContainerRef.current.scrollHeight - chatContainerRef.current.clientHeight;
        chatContainerRef.current.scrollTo(0, scroll);
      }, 300),
    [],
  );

  useEffect(() => {
    throttledScroll();
  }, [messages]);

  console.log('====================[INFO] ChatContents=====================');
  console.log(messages);

  return (
    <ChatContentStyled>
      <ChatContentWrapper ref={chatContainerRef}>
        {typingUser && <ChatTypingMessage nickNames={['메세지']} />}
        {messages &&
          messages.map((msg, idx) => {
            return (
              <ChatMessageWrapper key={idx}>
                {msg.type === 'NEW_USER' ? (
                  <ChatMessageNewUser nickName={msg.sender.nickName} />
                ) : (
                  <ChatMessage user={msg.sender} message={msg.message} time={msg.time} />
                )}
              </ChatMessageWrapper>
            );
          })}
      </ChatContentWrapper>
    </ChatContentStyled>
  );
}

const ChatContentStyled = styled.div`
  width: 100%;
  background: #fff;
`;
const ChatContentWrapper = styled.div`
  position: relative;
  padding: 10px 20px 20px 20px;
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100vh - 64px - 60px);
`;

const ChatMessageWrapper = styled.div``;
