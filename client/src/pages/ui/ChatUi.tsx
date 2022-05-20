import styled from '@emotion/styled';
import { Avatar, Button, PageHeader, Tooltip, Comment, Badge, Space, Divider } from 'antd';
import { PhoneOutlined, RedditOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';

const AVATAR_IMG = 'https://blog.kakaocdn.net/dn/qLIlw/btqSDtQEGFg/Ru1mm2rSUISCftBjBOHfs1/img.jpg';

const ChatRoomHeader = () => {
  <Badge dot>
    <Avatar shape="square" src={AVATAR_IMG} alt="Han Solo" />
  </Badge>;

  return (
    <PageHeader
      title={
        <Badge dot color="green">
          이재철
        </Badge>
      }
      className="site-page-header"
      avatar={{ src: AVATAR_IMG, shape: 'square', size: 'large' }}
      extra={[<PhoneOutlined />]}
    ></PageHeader>
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
          <ChatContents nickName="테스터2" />
          <ChatContents nickName="테스터2" />
          <ChatContents nickName="테스터2" />
          <ChatMessageNewUser nickName={'테스터3'} />
          <ChatContents nickName="테스터3" />
          <ChatContents nickName="테스터3" />
          <ChatContents nickName="테스터1" />
        </ChatContentWrapper>
      </ChatUiStyled>
    </>
  );
}

const ChatUiStyled = styled.div`
  width: 100%;
  height: 700px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const ChatContentWrapper = styled.div`
  padding: 0px 20px;
`;
