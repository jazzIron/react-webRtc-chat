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
  name: string;
  description: string;
  messages: [];
  isTyping: boolean;
  msgCount: number;
  type: ChannelType;
}
