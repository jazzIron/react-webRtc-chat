import { User } from '@src/@types/User_types';

export type ChannelType = 'Private' | 'Community';
export type MessageType = 'NEW_USER' | 'DEFAULT';

export interface Message {
  type?: MessageType;
  id: string; // socket_id
  message: string; // 메세지
  sender: User; // 닉네임
  time: Date; // 보낸시간
}
export interface ActiveChannel {
  type?: ChannelType;
  description: string; //Public room
  messages: Message[];
  msgCount: number;
  name: string; // channel name
  typingUser: string[];
}

export interface PrivateRoom {
  roomName: string;
  description: string;
  isTyping: boolean;
  messages: Message[];
  msgCount: number;
  user: User;
  type: string;
  typingUser?: string[];
}

export interface PrivateRooms {
  rooms: PrivateRoom[];
}
