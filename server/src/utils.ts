export const isUser = (users: any, nickName: string) => nickName in users;
export const createUser = (nickName: string, socketId: string) => ({
  nickName,
  socketId,
});

export const addUsers = (users: any, user: any) => {
  users[user.nickName] = user;
  return users;
};

export const deleteUser = (users: any, nickName: string) => {
  delete users[nickName];
  return users;
};
