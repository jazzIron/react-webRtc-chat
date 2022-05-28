import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useWebRTC } from './useWebRTC';

export function ServerPage() {
  const { connected, socketRef, localVideoRef, remoteVideoRef, useLocalStream } = useWebRTC();
  useEffect(() => {
    useLocalStream('ROOM_1');
  }, []);

  console.log(localVideoRef);
  console.log(remoteVideoRef);

  return (
    <ServerPageStyled>
      <VideoLocal id={'localVideo'} autoPlay playsInline controls={true} ref={localVideoRef} />
      <VideoRemote id={'remoteVideo'} autoPlay playsInline controls={true} ref={remoteVideoRef} />
    </ServerPageStyled>
  );
}

const ServerPageStyled = styled.div``;
const VideoLocal = styled.video``;
const VideoRemote = styled.video``;
