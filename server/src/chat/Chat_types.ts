export interface User {
  nickName: string;
  userAvatar: string;
  socketId: string;
}

export interface Users {
  users: User[];
}

export interface Message {
  id: string; // socket_id
  message: string; // 메세지
  sender: string; // 닉네임
  time: Date | string; // 보낸시간
}

export interface PrivateRoom {
  roomName: string;
  description: string;
  isTyping: boolean;
  messages: Message[];
  msgCount: number;
  user: User;
  type: string;
}

export interface PrivateRooms {
  rooms: PrivateRoom[];
}
