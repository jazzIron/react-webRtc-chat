/**
 * https://runebook.dev/ko/docs/dom/-index-#WebRTC
 */

import { SocketDomain, PC_CONFIG } from '@src/hooks/webRTC/config';
import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

const USER_MEDIA = {
  video: true,
  audio: true,
};

const OFFER_OPTIONS = {
  offerToReceiveVideo: true,
  offerToReceiveAudio: true,
};

const DATA_CHANNEL_OPTIONS = {
  ordered: false, // 순서 보장 안함
  maxRetransmitTime: 3000, // 밀리초 단위
};

const DATA_CHANNEL_NAME = 'CHAT_CHANNEL';

export function useWebRTC() {
  const socketRef = useRef<Socket>();
  const localVideoRef = useRef<HTMLVideoElement>(null); // 본인 Media
  const remoteVideoRef = useRef<HTMLVideoElement>(null); // 상대방 Media
  const pcRef = useRef<RTCPeerConnection>(); //사용자 sessionDescription 생성
  const dataChannelRef = useRef<RTCDataChannel>();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    console.log('useEffect');
    createNewConnection();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const createNewConnection = async () => {
    socketRef.current = io(SocketDomain!);
    pcRef.current = new RTCPeerConnection(PC_CONFIG);

    const socket = socketRef.current;
    console.log(socket);
    console.log(socket.connect().connected);

    dataChannelRef.current = pcRef.current.createDataChannel(
      DATA_CHANNEL_NAME,
      DATA_CHANNEL_OPTIONS,
    );

    const dataChannel = dataChannelRef.current;
    dataChannel.onopen = function () {
      console.log('[INFO] DATA_CHANNEL===============');
      dataChannel.send('Hello World!');
    };
    dataChannel.onmessage = function (event) {
      console.log('Got Data Channel Message:', event.data);
    };

    dataChannel.onclose = function () {
      console.log('The Data Channel is Closed');
    };

    socket.on('connection', () => {
      console.log('connected to server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.info(`Successfully disconnected`);
      setConnected(false);
    });

    socket.on('error', (error) => {
      console.error('Socket Error:', error.message);
    });

    socket.on('ALL_USERS', (allUsers: Array<string>) => {
      console.log('ALL_USERS');
      if (allUsers.length > 0) {
        console.log(allUsers);
        createOffer();
      }
    });
    socket.on('ROOM_FULL', () => {
      console.log('ROOM_FULL');
    });

    socket.on('CANDIDATE', async (candidate: RTCIceCandidateInit) => {
      console.log('CANDIDATE');
      if (!pcRef.current) return;
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('OFFER', async (sdp: RTCSessionDescription) => {
      console.log('[INFO] OFFER================');
      console.log(sdp);
      createAnswer(sdp);
    });

    socket.on('ANSWER', (sdp: RTCSessionDescription) => {
      console.log('[INFO] ANSWER================');
      if (!pcRef.current) return;
      pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    });
  };

  const useLocalStream = async (roomId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(USER_MEDIA);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      if (!(pcRef.current && socketRef.current)) throw new Error('[ERROR] useLocalStream handler');

      stream.getTracks().forEach((track) => {
        if (!pcRef.current) return;
        pcRef.current.addTrack(track, stream);
      });

      pcRef.current.onicecandidate = function (event) {
        if (event.candidate) {
          // event.candidate가 존재하면 원격 유저에게 candidate를 전달합니다.
          if (!socketRef.current) return;
          socketRef.current.emit('CANDIDATE', event.candidate);
        } else {
          // 모든 ICE candidate가 원격 유저에게 전달된 조건에서 실행됩니다.
          // candidate = null
        }
      };

      pcRef.current.oniceconnectionstatechange = (event) => {
        //ICE connection 상태가 변경됐을 때의 log
        console.log(`[INFO] RTCPeerConnection_oniceconnectionstatechange`, event);
        if (!pcRef.current) return;
        if (
          pcRef.current.iceConnectionState === 'failed' ||
          pcRef.current.iceConnectionState === 'disconnected' ||
          pcRef.current.iceConnectionState === 'closed'
        ) {
          // 실패 처리
        }
      };

      pcRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          // 비디오 스트림요소 연결
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      socketRef.current.emit('JOIN_ROOM', roomId);
    } catch (error) {
      console.error('[ERROR] useLocalStream handler');
    }
  };

  // 미디어 정보 입력 후 수신자에게 전달할 SDP를 생성
  const createOffer = async () => {
    if (!(pcRef.current && socketRef.current)) return;
    try {
      // SDP(Session Description Protocol) 을 생성 -> 코덱, 해상도 관련 정보
      const sdp = await pcRef.current.createOffer(OFFER_OPTIONS);
      // 로컬 SDP로 설정
      await pcRef.current.setLocalDescription(new RTCSessionDescription(sdp));
      // 설정이 완료 후 SPD와 Candidate를 Callee에 전달 [시그널링(Signaling)]
      // localDescription이 설정되어야 candidate를 수집할수 있음
      socketRef.current.emit('OFFER', sdp);
    } catch (error) {
      // 오류가 발생했음 연결실패 처리
      console.error(`[ERROR] createOffer : ${error}`);
    }
  };

  // Caller에게 보낼 SDP 생성
  const createAnswer = async (sdp: RTCSessionDescription) => {
    console.log('[INFO] createAnswer =======================');
    if (!(pcRef.current && socketRef.current)) return;
    try {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pcRef.current.createAnswer(OFFER_OPTIONS);
      await pcRef.current.setLocalDescription(new RTCSessionDescription(answer));
      socketRef.current.emit('ANSWER', answer);
    } catch (error) {
      console.error(`[ERROR] createAnswer : ${error}`);
    }
  };

  return { connected, dataChannelRef, socketRef, localVideoRef, remoteVideoRef, useLocalStream };
}
