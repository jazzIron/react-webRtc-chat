import styled from '@emotion/styled';
import { Avatar, Button, PageHeader, Tooltip, Comment, Badge, Space, Divider, Input } from 'antd';
import { InfoCircleOutlined, PhoneOutlined, RedditOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';

import { GrSend } from 'react-icons/gr';
import { RiEmotionHappyLine } from 'react-icons/ri';
import { css, keyframes } from '@emotion/react';
import { useState, useEffect } from 'react';

const AVATAR_IMG = 'https://blog.kakaocdn.net/dn/qLIlw/btqSDtQEGFg/Ru1mm2rSUISCftBjBOHfs1/img.jpg';

const ChatRoomHeader = () => {
  const ChatRoomHeaderWrapper = styled.div`
    box-sizing: border-box;
    margin: 0;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 1.5715;
    list-style: none;
    position: relative;
    padding: 16px 24px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  const UserWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
  `;

  return (
    <ChatRoomHeaderWrapper>
      <UserWrapper>
        <Badge dot color="green">
          <Avatar shape="square" src={AVATAR_IMG} alt="Han Solo" />
        </Badge>
        <p>이재철</p>
      </UserWrapper>

      <PhoneOutlined />
    </ChatRoomHeaderWrapper>
  );
};

const ChatContents = ({
  nickName,
  message,
  time,
}: {
  nickName: string;
  message?: string;
  time?: Date;
}) => {
  //TODO: 이전 메세지를 확인해서 같은 사람이면 아래에 붙이기
  return (
    <Comment
      author={<a>{nickName}</a>}
      avatar={<Avatar src={AVATAR_IMG} alt="Han Solo" />}
      content={
        <p>
          We supply a series of design principles, practical patterns and high quality design
          resources (Sketch and Axure), to help people create their product prototypes beautifully
          and efficiently.
        </p>
      }
      datetime={
        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
          <span>{moment().fromNow()}</span>
        </Tooltip>
      }
    />
  );
};

const ChatMessageNewUser = ({ nickName }: { nickName: string }) => {
  const newUserMessage = `[알림] ${nickName}님이 입장하셨습니다.`;
  return <Divider plain>{newUserMessage}</Divider>;
};

const ChatTypingMessage = ({ nickNames }: { nickNames: string[] }) => {
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
    color: #bfbfbf;
    animation: ${bounce} 1s ease infinite;
  `;
  return <ChatTypingMessage>{typingGroup} 입력중...</ChatTypingMessage>;
};

const ChatMessageInput = () => {
  const MessageInputItemWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    & svg {
      width: 20px;
      height: 20px;
    }
  `;

  const handleClick = () => {
    console.log('handleClick=============');
  };
  return (
    <Input
      size="large"
      placeholder="메세지를 입력해주세요"
      suffix={
        <MessageInputItemWrapper>
          <RiEmotionHappyLine />
          <GrSend onClick={handleClick} />
        </MessageInputItemWrapper>
      }
    />
  );
};

export function ChatUi() {
  return (
    <>
      <ChatRoomHeader />
      <ChatUiStyled>
        <ChatContentWrapper>
          <ChatContents nickName="이재철" />
          <ChatContents nickName="이재철" />
          <ChatMessageNewUser nickName={'테스터2'} />
          <ChatContents nickName="테스터2" />
          <ChatContents nickName="테스터2" />
          <ChatMessageNewUser nickName={'테스터3'} />
          <ChatContents nickName="테스터3" />
          <ChatContents nickName="테스터3" />
          <ChatContents nickName="테스터3" />
          <ChatContents nickName="테스터3" />
        </ChatContentWrapper>
        <ChatTypingMessage nickNames={['테스터1', '테스터2']} />
        <ChatMessageInput />
      </ChatUiStyled>
    </>
  );
}

const ChatUiStyled = styled.div`
  width: 100%;
`;

const ChatContentWrapper = styled.div`
  padding: 10px 20px 20px 20px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 700px;
`;
