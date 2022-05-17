import console from "console";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { SocketMsgType } from "./chat/Constant";
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 8081;
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

interface Rooms {
  roomId: string;
  userId: string;
  roomName: string;
  roomPwd: string;
  roomMax: number;
  roomParticipate: number;
}

let users: Users = {};
const ROOM_COMMUNITY = "ROOM_COMMUNITY";
const rooms: Rooms[] = [];

const duplicationCheckRoom = (roomName: string) => {
  return rooms.some((val) => val.roomName === roomName);
};

// 유저생성
const createUser = (nickName: string, socketId: string) => ({
  nickName,
  socketId,
});

const createMessage = (message: string, sender: string) => {
  return {
    id: uuidv4(),
    time: new Date(Date.now()),
    message,
    sender,
  };
};

const addUsers = (users: any, user: any) => {
  users[user.nickName] = user;
  return users;
};

interface User {
  nickName: string;
  socketId: string;
}
type Users = { [key: string]: User };
const isUser = (users: Users, nickName: string) => {
  return nickName in users;
};

io.on("connection", (socket) => {
  //시작시 방생성하기
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("LOGIN", (nickName, isUserCallback) => {
    isUser(users, nickName)
      ? isUserCallback({ isUser: true, user: null })
      : isUserCallback({
          isUser: false,
          user: createUser(nickName, socket.id),
        });
  });

  socket.on("INIT_ROOM", (user) => {
    console.log("[INFO] INIT_ROOM ");
    users = addUsers(users, user);
    socket.data.user = user;
    socket.join(ROOM_COMMUNITY);
    io.emit(SocketMsgType.NEW_USER, { newUsers: users });
  });

  socket.on("MESSAGE_SEND", ({ roomId, msg }) => {
    console.log(`===============[INFO] MESSAGE_SEND===============`);
    const message = createMessage(msg, socket.data.user.nickName);
    console.log(message);
    io.sockets.in(roomId).emit("MESSAGE_SEND", { roomId, message });
  });

  socket.on("TYPING", ({ roomId, isTyping }) => {
    console.log(`===============[INFO] TYPING===============`);
    console.log(roomId);
    console.log(isTyping);
    console.log(socket.data.user);
    socket.broadcast
      .to(roomId)
      .emit("TYPING", { roomId, isTyping, sender: socket.data.user.nickName });
  });

  socket.on("ROOM_LIST", (roomListCallback) => {
    console.log(`===============[INFO] ROOM_LIST===============`);
    console.log(rooms);
    io.emit("ROOM_LIST", roomListCallback(rooms));
  });

  // socket.on(
  //   "CREATE_ROOM",
  //   ({ roomName, roomPwd, roomMax }, createRoomCallback) => {
  //     if (duplicationCheckRoom(roomName))
  //       return io.emit(
  //         "CREATE_ROOM",
  //         createRoomCallback({ status: false, rooms })
  //       );
  //     const roomId = socket.id;
  //     rooms.push({
  //       roomId: roomId,
  //       userId: `USER_${Math.floor(Math.random() * 1000) + 1}`,
  //       roomName,
  //       roomPwd: roomPwd,
  //       roomMax: roomMax,
  //       roomParticipate: 1,
  //     });
  //     io.emit("CREATE_ROOM", createRoomCallback({ status: true, rooms }));
  //   }
  // );

  // socket.on("JOIN_ROOM", (roomId: string, userId: string) => {
  //   socket.join(roomId);
  //   const userJoinThisRoom = rooms.filter((val) => val.userId !== userId);
  //   io.sockets.to(roomId).emit("JOIN_ROOM", userJoinThisRoom);
  // });
});

httpServer.listen(PORT, () => console.log("App was start at port : " + PORT));
