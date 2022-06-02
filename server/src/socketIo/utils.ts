interface User {
  nickName: string;
  userAvatar: string;
  socketId: string;
}

export type Users = User[];

export const isUser = (users: Users, nickName: string) => {
  return users.some((v) => v.nickName === nickName);
};

export const createUser = (user: User, socketId: string) => ({
  nickName: user.nickName,
  userAvatar: user.userAvatar,
  socketId,
});

export const addUsers = (users: Users, user: User) => {
  users.push(user);
  return users;
};
