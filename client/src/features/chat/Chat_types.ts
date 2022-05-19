export type ChannelType = 'Private' | 'Community';

export interface Messages {
  id: string; // socket_id
  message: string; // 메세지
  sender: string; // 닉네임
  time: Date | string; // 보낸시간
}
export interface ActiveChannel {
  type?: ChannelType;
  description: string; //Public room
  messages: Messages[];
  msgCount: number;
  name: string; // channel name
  typingUser: string[];
}

export interface PChat {
  type?: ChannelType;
  description: string;
  messages: Messages[];
  name: string; // user name
  msgCount: number;
  isTyping: boolean;
}
