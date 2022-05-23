export interface User {
  nickName: string;
  userAvatar: string;
  socketId: string;
}

export interface Users {
  users: User[];
}

export interface UsersData {
  newUsers: User;
  outUser: any;
}

export interface UserData {
  nickName: string;
  userAvatar: string;
  error: boolean;
}
