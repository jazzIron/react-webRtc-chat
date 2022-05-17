import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const cors = require("cors");

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

const rooms: Rooms[] = [];

const duplicationCheckRoom = (roomName: string) => {
  return rooms.some((val) => val.roomName === roomName);
};

io.on("connection", (socket) => {
  socket.on(
    "CREATE_ROOM",
    ({ roomName, roomPwd, roomMax }, createRoomCallback) => {
      if (duplicationCheckRoom(roomName))
        return io.emit(
          "CREATE_ROOM",
          createRoomCallback({ status: false, rooms })
        );
      const roomId = socket.id;
      rooms.push({
        roomId: roomId,
        userId: `USER_${Math.floor(Math.random() * 1000) + 1}`,
        roomName,
        roomPwd: roomPwd,
        roomMax: roomMax,
        roomParticipate: 1,
      });
      io.emit("CREATE_ROOM", createRoomCallback({ status: true, rooms }));
    }
  );

  socket.on("ROOM_LIST", () => {
    io.emit("ROOM_LIST", rooms);
  });

  socket.on("JOIN_ROOM", (roomId: string, userId: string) => {
    socket.join(roomId);
    const userJoinThisRoom = rooms.filter((val) => val.userId !== userId);
    io.sockets.to(roomId).emit("NOTI_ROOM_USER", userJoinThisRoom);
  });
});

httpServer.listen(PORT, () => console.log("App was start at port : " + PORT));
