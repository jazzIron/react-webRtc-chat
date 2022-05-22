export interface User {
  nickName: string;
  userAvatar: string;
  socketId: string;
}

export interface Users {
  users: { [key: string]: User };
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
