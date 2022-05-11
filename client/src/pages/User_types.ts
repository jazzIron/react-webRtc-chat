export interface User {
  nickName: string;
  socketId: string;
}
export interface UsersData {
  newUsers: User[];
  outUser: any;
}

export interface UserData {
  nickName: string;
  error: string;
}
