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
// const rooms: Rooms[] = [];

const rooms = io.of("/").adapter.rooms;
const sids = io.of("/").adapter.sids;

// const duplicationCheckRoom = (roomName: string) => {
//   return rooms.some((val) => val.roomName === roomName);
// };

// 유저생성
const createUser = (nickName: string, socketId: string) => ({
  nickName,
  socketId,
});

const createMessage = (type: string, message: string, sender: string) => {
  return {
    type,
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

function getActiveRooms(io: Server) {
  const arr = Array.from(io.sockets.adapter.rooms);
  const rooms = arr.filter((room: any) => !room[1].has(room[0]));
  console.log(rooms);
  const activeRoom = rooms.map((i: any) => i[0]);
  return activeRoom;
}

function getRooms(io: Server) {
  const adapter = io.sockets.adapter.rooms;
  const arr = Array.from(adapter);

  console.log(arr);
  const rooms = arr.filter((room: any) => !room[1].has(room[0]));
  return rooms;
}

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
    const msg = `[알림] ${user.nickName}님이 방에 입장하셨습니다. 환영합니다.`;
    const message = createMessage("NEW_USER", msg, socket.data.user.nickName);
    io.emit(SocketMsgType.NEW_USER, { newUser: user, users: users, message });
  });

  socket.on("MESSAGE_SEND", ({ roomId, type, msg }) => {
    console.log(`===============[INFO] MESSAGE_SEND===============`);
    const message = createMessage(type, msg, socket.data.user.nickName);
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
    // const roomList = getRooms(io);
    // const activeRoom = getActiveRooms(io);
    // console.log(roomList);
    // console.log(activeRoom);

    console.log(io.sockets.adapter.rooms);
    console.log(socket.rooms);

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
