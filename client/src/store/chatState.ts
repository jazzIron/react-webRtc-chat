import { atom } from 'recoil';

export type ChannelType = 'Private' | 'Community';

export interface Messages {
  id: string; // socket_id
  message: string; // 메세지
  sender: string; // 닉네임
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
