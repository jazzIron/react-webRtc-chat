const DISCONNECT = {
  SERVER_NAMESPACE_DISCONNECT:
    "socket.disconnect로 소켓이 강제로 연결 해제되었습니다.",
  CLIENT_NAMESPACE_DISCONNECT:
    "클라이언트가 socket.disconnect() 를 사용하여 소켓을 수동으로 연결 해제했습니다.",
  SERVER_SHUTTING_DOWN: "서버가 종료됩니다.",
  PING_TIMEOUT:
    "ingTimeout클라이언트가 지연 시간 에 PONG 패킷을 보내지 않았습니다.",
  TRANSPORT_CLOSE:
    "연결이 끊겼습니다(예: 사용자가 연결이 끊겼거나 네트워크가 WiFi에서 4G로 변경됨).",
  TRANSPORT_ERROR: "연결에 오류가 발생했습니다",
};

export { DISCONNECT };
