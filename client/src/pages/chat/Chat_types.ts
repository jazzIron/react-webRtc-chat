export type ActiveType = 'Private' | 'Community';

export interface Messages {
  id: string; // socket_id
  message: string; // 메세지
  sender: string; // 닉네임
  time: Date; // 보낸시간
}
export interface ActiveChannel {
  type?: ActiveType;
  description: string; //Public room
  messages: Messages[];
  msgCount: number;
  name: string; // channel name
  typingUser: string[];
}
