import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  createPrivateRoom,
  ChatTypingMessage,
  isUser,
  createUser,
  addUsers,
  createMessage,
} from "./chatUtils";
import { Users, PrivateRooms } from "./Chat_types";
import { SocketMsgType } from "./Constant";
const cors = require("cors");

const PORT = process.env.PORT || 8081;
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const ROOM_COMMUNITY = "ROOM_COMMUNITY";
let privateRooms: PrivateRooms = { rooms: [] };
let users: Users = { users: [] };

const rooms = io.of("/").adapter.rooms;

io.on("connection", (socket) => {
  //시작시 방생성하기
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("LOGIN", (user, isUserCallback) => {
    if (isUser(users, user.nickName)) {
      return isUserCallback({ isUser: true, user: null });
    } else {
      const socketId = socket.id;
      const newUser = {
        ...user,
        socketId: socket.id,
      };
      createPrivateRoom(newUser, privateRooms);
      isUserCallback({
        isUser: false,
        user: createUser(user, socketId),
      });
    }
  });

  socket.on("INIT_ROOM", (user) => {
    console.log("[INFO] INIT_ROOM ");
    users = addUsers(users, user);
    socket.data.user = user;
    socket.join(ROOM_COMMUNITY);
    const msg = `[알림] ${user.nickName}님이 방에 입장하셨습니다. 환영합니다.`;
    const message = ChatTypingMessage("NEW_USER", msg, user);

    console.log(users);
    console.log(privateRooms);

    io.emit(SocketMsgType.NEW_USER, {
      newUser: user,
      users: users,
      message,
      privateRooms,
    });
  });

  socket.on("MESSAGE_SEND", ({ roomId, type, msg }) => {
    console.log(`===============[INFO] MESSAGE_SEND===============`);
    const message = createMessage(type, msg, socket.data.user);
    io.sockets.in(roomId).emit("MESSAGE_SEND", { roomId, message });
  });

  socket.on("P_MESSAGE_SEND", ({ activeRoom, type, msg }) => {
    console.log("P_MESSAGE_SEND");
    console.log(activeRoom);
    console.log(msg);

    if (socket.data.user) {
      const sender = socket.data.user;
      const message = createMessage(type, msg, socket.data.user);
      socket
        .to(activeRoom.user.socketId)
        .emit("P_MESSAGE_SEND", { channel: sender, message });
      socket.emit("P_MESSAGE_SEND", {
        roomId: activeRoom.user.socketId,
        message,
      });
    }
  });

  socket.on("TYPING", ({ roomId, isTyping }) => {
    console.log(`===============[INFO] TYPING===============`);
    console.log(roomId);
    console.log(isTyping);
    console.log(socket.data.user);
    socket.broadcast
      .to(roomId)
      .emit("TYPING", { roomId, isTyping, sender: socket.data.user });
  });

  socket.on("P_TYPING", ({ activeRoom, isTyping }) => {
    console.log(`===============[INFO] P_TYPING===============`);
    const sender = socket.data.user.socketId;
    socket.to(activeRoom.user.socketId).emit("P_TYPING", { sender, isTyping });
  });

  socket.on("ROOM_LIST", async (roomListCallback) => {
    console.log(`===============[INFO] ROOM_LIST===============`);
    io.emit("ROOM_LIST", roomListCallback(rooms));
  });
});

httpServer.listen(PORT, () => console.log("App was start at port : " + PORT));
