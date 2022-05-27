import { User } from '@src/@types/User_types';
import { ChannelType, Message, PrivateRoom, PrivateRooms } from '@src/features/chat';
import { atom } from 'recoil';

export interface Chat {
  type?: ChannelType;
  description: string; //Public room
  messages: Message[];
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

export const activeRoomState = atom<PrivateRoom | null>({
  key: 'activeRoomState',
  default: null,
});

export const PrivateRoomsState = atom<PrivateRooms>({
  key: 'PrivateRoomsState',
  default: { rooms: [] },
});
