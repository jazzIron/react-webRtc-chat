import { useCallback, useRef, useEffect, useState } from 'react';
import useSocketIo from '../socketIo/useSocketIo';
import { PC_CONFIG, SocketDomain } from './config';

// 사용자 stream 권한 설정
const USER_MEDIA = {
  video: true,
  audio: true,
};

const OFFER_OPTIONS = {
  offerToReceiveVideo: true,
  offerToReceiveAudio: true,
};

interface propTypes {
  userId: number;
  roomId: number;
}

export const useLocalStream = () => {
  const streamRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null); // 본인 media
  const getLocalStream = useCallback(async () => {
    try {
      //사용자에게 미디어 입력 장치 사용 권한을 요청
      streamRef.current = await navigator.mediaDevices.getUserMedia(USER_MEDIA);
      if (localVideoRef.current) localVideoRef.current.srcObject = streamRef.current;
      streamRef.current
        .getTracks()
        .forEach((track: MediaStreamTrack) => (track.enabled = !track.enabled));
    } catch (error) {
      console.error(`[ERROR] getLocalStream :${error}`);
    }
  }, []);
  return { streamRef, localVideoRef, getLocalStream };
};

export const useSetPeerConnection = (setParticipants: any, socket: any, streamRef: any) => {
  const pcRef = useRef<RTCPeerConnection>(); //사용자 sessionDescription 생성

  const setPeerConnection = useCallback((participant, socket) => {
    try {
      pcRef.current = new RTCPeerConnection(PC_CONFIG);
      const { userId, socketId } = participant;

      pcRef.current.oniceconnectionstatechange = (e) => {
        //ICE connection 상태가 변경됐을 때의 log
        console.log('current state', e);
      };

      pcRef.current.onicecandidate = (e) => {
        // offer 또는 answer signal을 생성한 후부터 본인의 icecandidate 정보 이벤트가 발생한다.
        // offer 또는 answer를 보냈던 상대방에게 본인의 icecandidate 정보를 Signaling Server를 통해 보낸다.
        if (e.candidate) {
          if (!socket) return;
          socket.emit('candidate', e.candidate);
        }
      };

      pcRef.current.ontrack = (ev) => {
        // 상대방의 RTCSessionDescription을 본인의 RTCPeerConnection에서의 remoteSessionDescription으로 지정하면 상대방의 track 데이터에 대한 이벤트가 발생한다.
        setParticipants((prev: any) =>
          prev
            .filter((participant: any) => participant.userId !== userId)
            .concat({
              stream: ev.streams[0],
              userId: userId,
              socketId: socketId,
            }),
        );
      };

      streamRef.current.getTracks().forEach((track: MediaStreamTrack) => {
        //The getTracks() method of the MediaStream interface returns a sequence that represents all the MediaStreamTrack objects in this stream's track set
        if (!pcRef.current) return;
        pcRef.current.addTrack(track, streamRef.current);
      });
    } catch (error) {
      console.error(`[ERROR] useSetPeerConnection : ${error}`);
      return undefined;
    }
  }, []);

  return { pcRef, setPeerConnection };
};

export const useWebRTC = (payload: propTypes) => {
  const peerConnectionsRef = useRef<any>({});
  const [participants, setParticipants] = useState([]);
  const { socket, socketRef } = useSocketIo();
  const { streamRef, localVideoRef, getLocalStream } = useLocalStream();
  const { pcRef, setPeerConnection } = useSetPeerConnection(setParticipants, socket, streamRef);

  useEffect(() => {
    if (!socket) return;

    const init = async () => {
      try {
        await getLocalStream();
        socketRef.emit('join_room', {
          payload,
          socketId: socket.id,
        });
      } catch (error) {}
    };

    init();

    const createOffer = async (socketId: string) => {
      if (!(pcRef.current && socket)) return;
      try {
        const offer = await pcRef.current.createOffer(OFFER_OPTIONS);
        await pcRef.current.setLocalDescription(new RTCSessionDescription(offer));
        socket.emit('offer', offer, socketId);
      } catch (error) {
        console.error(`[ERROR] createOffer : ${error}`);
      }
    };

    const createAnswer = async (sdp: RTCSessionDescription, userId: number, socketId: any) => {
      try {
        if (!streamRef.current) return;
        const participant = { userId, socketId };
        const peerConnection = setPeerConnection(participant, socket);
        if (!(peerConnection && socket)) return;
        peerConnectionsRef.current = { ...peerConnectionsRef.current, [socketId]: peerConnection };
        await streamRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await streamRef.current.createAnswer(OFFER_OPTIONS);
        await streamRef.current.setLocalDescription(new RTCSessionDescription(answer));
        socket.emit('answer', answer, socketId);
      } catch (e) {
        console.error(e);
      }
    };

    socket.on('join', async (participantsInfo) => {
      try {
        participantsInfo.forEach(async (participant: any) => {
          if (!localVideoRef.current) return;
          const peerConnection = setPeerConnection(participant, socket);
          if (!(peerConnection && socket)) return;

          peerConnectionsRef.current = {
            ...peerConnectionsRef.current,
            [participant.socketId]: peerConnection,
          };
          createOffer(participant.socketId);
        });
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('getOffer', async (sdp: RTCSessionDescription, userId, socketId) => {
      await createAnswer(sdp, userId, socketId);
    });

    socket.on('getAnswer', (sdp: RTCSessionDescription, socketId: string) => {
      const peerConnection = peerConnectionsRef.current[socketId];
      if (!peerConnection) return;
      streamRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on('getCandidate', async (candidate: RTCIceCandidateInit, data) => {
      const peerConnection = peerConnectionsRef.current[data.candidateSendId];
      if (!peerConnection) return;
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('leave', async (socketId) => {
      peerConnectionsRef.current[socketId].close();
      peerConnectionsRef.current[socketId] = null;
      delete peerConnectionsRef.current[socketId];
      setParticipants((oldParticipants) =>
        oldParticipants?.filter((participant: any) => participant.socketId !== socketId),
      );
    });

    return () => {
      setParticipants((oldParticipants) => {
        oldParticipants.forEach((participant: any) => {
          if (!peerConnectionsRef.current[participant.socketId]) return;
          peerConnectionsRef.current[participant.userId].close();
          peerConnectionsRef.current[participant.userId].onicecandidate = null;
          peerConnectionsRef.current[participant.userId].ontrack = null;
          peerConnectionsRef.current[participant.userId] = null;
          delete peerConnectionsRef.current[participant.userId];
        });
        return [];
      });

      const stream = localVideoRef.current?.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [socket]);

  return { participants, socket, streamRef, localVideoRef };
};
