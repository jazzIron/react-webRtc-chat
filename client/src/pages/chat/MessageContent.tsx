import styled from '@emotion/styled';
import moment from 'moment';
import { ActiveChannel } from './Chat_types';

interface propTypes {
  activeChannel: ActiveChannel;
  chats: ActiveChannel[];
  user: any;
}

export function MessageContent({ chats, activeChannel, user }: propTypes) {
  const { messages, typingUser } = activeChannel;

  console.log('========================MessageContent=================');
  console.log(user);
  console.log(typingUser);
  console.log(activeChannel);
  return (
    <MessageContentStyled>
      <div style={{ height: 'calc( 100vh - 250px)', overflowY: 'auto' }}>
        <div>
          {messages.length > 0 &&
            messages.map((message: any) => (
              <div key={message.id} style={{ marginTop: '0px' }}>
                <div>
                  <h3>{message.message}</h3>
                  {message.sender[0].toUpperCase() + message.sender.slice(1)}
                  {moment(message.time).fromNow()}
                </div>
              </div>
            ))}
          {typingUser &&
            typingUser.map((name: any) => (
              <div key={name} className="typing-user">
                {`${name[0].toUpperCase() + name.slice(1)} typing`}
              </div>
            ))}
        </div>
      </div>
    </MessageContentStyled>
  );
}

const MessageContentStyled = styled.div`
  height: calc(100vh - 500px);
`;
