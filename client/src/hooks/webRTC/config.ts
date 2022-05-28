//RTCPeerConnection을 생성할 때의 config
export const PC_CONFIG: RTCConfiguration = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302', 'stun:stun2.l.google.com:19305'],
    },
  ],
};

export const SocketDomain = `ws://${window.location.hostname}:8081`;
