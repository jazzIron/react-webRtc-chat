import console from "console";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { SocketMsgType } from "./chat/Constant";
const cors = require("cors");
const uuid = require("uuid");

const PORT = process.env.PORT || 8081;
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

interface User {
  nickName: string;
  userAvatar: string;
  socketId: string;
}

// type Users = { [key: string]: User };

interface Users {
  users: User[];
}

interface Message {
  id: string; // socket_id
  message: string; // 메세지
  sender: string; // 닉네임
  time: Date | string; // 보낸시간
}

interface PrivateRoom {
  roomName: string;
  description: string;
  isTyping: boolean;
  messages: Message[];
  msgCount: number;
  user: User;
  type: string;
}

interface PrivateRooms {
  rooms: PrivateRoom[];
}

let users: Users = { users: [] };

const ROOM_COMMUNITY = "ROOM_COMMUNITY";
// const rooms: Rooms[] = [];

let privateRooms: PrivateRooms = { rooms: [] };

const rooms = io.of("/").adapter.rooms;
const sids = io.of("/").adapter.sids;

// const duplicationCheckRoom = (roomName: string) => {
//   return rooms.some((val) => val.roomName === roomName);
// };

// 유저생성
const createUser = (user: User, socketId: string) => ({
  nickName: user.nickName,
  userAvatar: user.userAvatar,
  socketId,
});

const createPrivateRoom = (user: User, privateRooms: PrivateRooms) => {
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

const ChatTypingMessage = (type: string, message: string, sender: User) => {
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

const addUsers = (users: Users, user: User) => {
  //users[user.nickName] = user;
  users.users.push(user);
  return users;
};

function getActiveRooms(io: Server) {
  const arr = Array.from(io.sockets.adapter.rooms);
  const rooms = arr.filter((room: any) => !room[1].has(room[0]));
  //console.log(rooms);
  const activeRoom = rooms.map((i: any) => i[0]);
  return activeRoom;
}

function getRooms(io: Server) {
  const adapter = io.sockets.adapter.rooms;
  const arr = Array.from(adapter);

  //console.log(arr);
  const rooms = arr.filter((room: any) => !room[1].has(room[0]));
  return rooms;
}

const isUser = (users: Users, nickName: string) => {
  return users.users.some((v) => v.nickName === nickName);
};

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

  socket.on("TYPING", ({ roomId, isTyping }) => {
    console.log(`===============[INFO] TYPING===============`);
    console.log(roomId);
    console.log(isTyping);
    console.log(socket.data.user);
    socket.broadcast
      .to(roomId)
      .emit("TYPING", { roomId, isTyping, sender: socket.data.user });
  });

  socket.on("ROOM_LIST", async (roomListCallback) => {
    console.log(`===============[INFO] ROOM_LIST===============`);
    // const roomList = getRooms(io);
    // const activeRoom = getActiveRooms(io);
    // console.log(roomList);
    // console.log(activeRoom);

    // console.log(io.sockets.adapter.rooms);
    // console.log("=============================");
    // console.log(socket.rooms);
    // console.log("=============================");
    const sockets = await io.in(socket.id).fetchSockets();

    // console.log(sockets);

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
