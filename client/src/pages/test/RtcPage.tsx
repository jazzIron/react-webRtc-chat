import styled from '@emotion/styled';
import { useWebRTC } from '@src/hooks/webRTC/useWebRTC';
import { useRef, useEffect } from 'react';

export function RtcPage() {
  const { participants, socket, streamRef, localVideoRef } = useWebRTC({
    userId: 1,
    roomId: 1,
  });

  console.log(localVideoRef.current);

  return (
    <RtcPageStyled>
      <div>
        <video ref={localVideoRef} autoPlay muted playsInline />
        {participants.map(({ stream }) => (
          <OtherVideo key={1} stream={stream} />
        ))}
      </div>
    </RtcPageStyled>
  );
}

const RtcPageStyled = styled.div``;

const OtherVideo = function ({ stream }: any) {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current!.srcObject = stream;
  }, [stream]);

  return <video ref={ref} autoPlay playsInline />;
};
