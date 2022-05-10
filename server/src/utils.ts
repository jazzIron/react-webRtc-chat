const { v4: uuidv4 } = require("uuid");
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

export const createChat = ({
  name = "Community",
  description = "Public room",
} = {}) => ({
  name,
  description,
  messages: [],
  msgCount: 0,
  typingUser: [],
});

export const createMessage = (message: any, sender: string) => ({
  id: uuidv4(),
  time: new Date(Date.now()),
  message,
  sender,
});

export const isChannel = (channelName: string, chats: any) =>
  chats.includes(channelName);
