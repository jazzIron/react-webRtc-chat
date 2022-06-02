import { Server } from "socket.io";
import { PrivateRooms, User, Users } from "./Chat_types";
const uuid = require("uuid");

// 유저생성
export const createUser = (user: User, socketId: string) => ({
  nickName: user.nickName,
  userAvatar: user.userAvatar,
  socketId,
});

export const createPrivateRoom = (user: User, privateRooms: PrivateRooms) => {
  console.log("====================createPrivateRoom=================");
  const newPrivateRoom = {
    roomName: `ROOM_${user.socketId}`,
    user: user,
    description: "direct message",
    messages: [],
    isTyping: false,
    msgCount: 0,
    type: "Private",
  };

  return privateRooms.rooms.push(newPrivateRoom);
};

export const ChatTypingMessage = (
  type: string,
  message: string,
  sender: User
) => {
  return {
    type,
    id: uuid.v4(),
    time: new Date(Date.now()),
    message,
    sender,
  };
};

export const createMessage = (type: string, message: any, sender: User) => ({
  type,
  id: uuid.v4(),
  time: new Date(Date.now()),
  message,
  sender,
});

export const addUsers = (users: Users, user: User) => {
  users.users.push(user);
  return users;
};

export const getActiveRooms = (io: Server) => {
  const arr = Array.from(io.sockets.adapter.rooms);
  const rooms = arr.filter((room: any) => !room[1].has(room[0]));
  const activeRoom = rooms.map((i: any) => i[0]);
  return activeRoom;
};

export const getRooms = (io: Server) => {
  const adapter = io.sockets.adapter.rooms;
  const arr = Array.from(adapter);
  const rooms = arr.filter((room: any) => !room[1].has(room[0]));
  return rooms;
};

export const isUser = (users: Users, nickName: string) => {
  return users.users.some((v) => v.nickName === nickName);
};
