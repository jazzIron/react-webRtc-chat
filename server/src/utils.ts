export const isUser = (userList: any, nickName: string) => nickName in userList;
export const createUser = (nickName: string, socketId: string) => ({
  nickName,
  socketId,
});
