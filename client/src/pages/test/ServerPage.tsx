import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useWebRTC } from './useWebRTC';

export function ServerPage() {
  const { connected, socketRef, dataChannelRef, localVideoRef, remoteVideoRef, useLocalStream } =
    useWebRTC();
  useEffect(() => {
    useLocalStream('ROOM_1');
  }, []);

  console.log(localVideoRef);
  console.log(remoteVideoRef);

  const handleSendMessage = () => {
    if (!dataChannelRef.current) return false;
    console.log('handle send ');
    dataChannelRef.current?.send('TEST MESSAGE');
  };

  return (
    <ServerPageStyled>
      <div onClick={handleSendMessage}>메세지 전송 테스트 </div>
      <VideoLocal id={'localVideo'} autoPlay playsInline controls={true} ref={localVideoRef} />
      <VideoRemote id={'remoteVideo'} autoPlay playsInline controls={true} ref={remoteVideoRef} />
    </ServerPageStyled>
  );
}

const ServerPageStyled = styled.div``;
const VideoLocal = styled.video``;
const VideoRemote = styled.video``;
