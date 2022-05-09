import styled from '@emotion/styled';
import { useWebRTC } from '@src/hooks/webRTC/useWebRTC';

export function TestPage() {
  const { participants, socket, streamRef, localVideoRef } = useWebRTC({
    userId: 1,
    roomId: 1,
  });
  return <TestPageStyled></TestPageStyled>;
}

const TestPageStyled = styled.div``;
