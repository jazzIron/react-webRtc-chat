import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Input } from 'antd';
import React, { useState } from 'react';
import { GrSend } from 'react-icons/gr';
import { RiEmotionHappyLine } from 'react-icons/ri';

export const ChatTypingMessage = ({ nickNames }: { nickNames: string[] }) => {
  const typingGroup = nickNames.join(', ');

  const bounce = keyframes`
    from, 20%, 53%, 80%, to {
      transform: translate3d(0,0,0);
    }
  
    40%, 43% {
      transform: translate3d(0, -8px, 0);
    }
  
    70% {
      transform: translate3d(0, -5px, 0);
    }
  
    90% {
      transform: translate3d(0,-4px,0);
    }
  `;

  const ChatTypingMessage = styled.div`
    position: absolute;
    bottom: 0px;
    color: #bfbfbf;
    animation: ${bounce} 1s ease infinite;
  `;
  return <ChatTypingMessage>{typingGroup} 입력중...</ChatTypingMessage>;
};

interface propTypes {
  sendMsg: (msg: string) => void;
  sendTyping: (isTyping: boolean) => void;
}

export function ChatMessageInput({ sendMsg, sendTyping }: propTypes) {
  const [msg, setMsg] = useState<string>('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setMsg(e.target.value);
  const handleSubmit = () => {
    if (msg.length <= 0) return false;
    sendMsg(msg);
    setMsg('');
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFocused = () => sendTyping(true);
  const handleBlur = () => sendTyping(false);

  return (
    <ChatMessageInputStyled>
      <div>
        <Input
          size="large"
          placeholder="메세지를 입력해주세요"
          suffix={
            <MessageInputItemWrapper>
              <RiEmotionHappyLine />
              <GrSend onClick={handleSubmit} />
            </MessageInputItemWrapper>
          }
          value={msg}
          onFocus={handleFocused}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyPress={onKeyPress}
        />
      </div>
    </ChatMessageInputStyled>
  );
}

const ChatMessageInputStyled = styled.div`
  padding: 10px 20px 10px 20px;
  min-height: 60px;
`;

const MessageInputItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  & svg {
    width: 20px;
    height: 20px;
  }
`;
