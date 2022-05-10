import styled from '@emotion/styled';
import { ActiveChannel } from './Chat_types';

interface propTypes {
  activeChannel: ActiveChannel;
}

export function MessageHeader({ activeChannel }: propTypes) {
  return (
    <MessageHeaderStyled>
      <div>
        {activeChannel.name[0].toUpperCase() + activeChannel.name.slice(1)}
        <span>
          {activeChannel.description[0].toUpperCase() + activeChannel.description.slice(1)}
        </span>
      </div>
    </MessageHeaderStyled>
  );
}

const MessageHeaderStyled = styled.div``;
