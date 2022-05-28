import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useWebRTC } from './useWebRTC';

export function CallerPage() {
  const { connected, socketRef, localVideoRef, remoteVideoRef, useLocalStream } = useWebRTC();

  useEffect(() => {
    useLocalStream('ROOM_1');
  }, []);

  return (
    <CallerPageStyled>
      <VideoLocal id={'localVideo'} autoPlay playsInline controls={true} ref={localVideoRef} />
      <VideoRemote id={'remoteVideo'} autoPlay playsInline controls={true} ref={remoteVideoRef} />
    </CallerPageStyled>
  );
}

const CallerPageStyled = styled.div``;
const VideoLocal = styled.video``;
const VideoRemote = styled.video``;
