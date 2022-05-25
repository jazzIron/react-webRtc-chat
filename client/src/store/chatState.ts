import { User } from '@src/@types/User_types';
import { atom } from 'recoil';

export type ChannelType = 'Private' | 'Community';
type MessageType = 'NEW_USER' | 'DEFAULT';

export interface Messages {
  type: MessageType;
  id: string; // socket_id
  message: string; // 메세지
  sender: User; // 닉네임
  time: Date | string; // 보낸시간
}

export interface Chat {
  type?: ChannelType;
  description: string; //Public room
  messages: Messages[];
  msgCount: number;
  name: string; // channel name
  typingUser: string[];
}

const initChats = {
  type: 'Community' as ChannelType,
  description: 'Public room',
  messages: [],
  msgCount: 0,
  name: 'Community',
  typingUser: [],
};

export const chatsState = atom<Chat[]>({
  key: 'chatsState',
  default: [initChats],
});

export const activeChannelState = atom<Chat>({
  key: 'activeChannelState',
  default: initChats,
});

// pChats: [
//   description: "direct message"
//   isTyping: false
//   messages: Array(1)
//     0:
//     id: "fe745490-fd3e-4beb-86d5-208e8869354e"
//     message: "ㅂㅈㄷㅂ"
//     sender: "ㅂㄷㅂㅈ"
//     time: "2022-05-25T10:54:37.772Z"
//   msgCount: 0
//   name: "ㅂㅈㄷ"
//   type: "Private"
// ]

export interface PrivateRoom {
  roomName: string;
  description: string;
  isTyping: boolean;
  messages: Messages[];
  msgCount: number;
  user: User;
  type: string;
}

export interface PrivateRooms {
  rooms: PrivateRoom[];
}

export const PrivateRoomsState = atom<PrivateRooms>({
  key: 'PrivateRoomsState',
  default: { rooms: [] },
});
