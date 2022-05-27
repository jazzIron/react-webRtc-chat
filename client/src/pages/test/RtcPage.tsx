import styled from '@emotion/styled';
import { useWebRTC } from '@src/hooks/webRTC/useWebRTC';

export function RtcPage() {
  const { participants, socket, streamRef, localVideoRef } = useWebRTC({
    userId: 1,
    roomId: 1,
  });

  console.log(participants);
  console.log(socket);
  console.log(streamRef);
  console.log(localVideoRef);

  return <RtcPageStyled></RtcPageStyled>;
}

const RtcPageStyled = styled.div``;
