import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { IOfferCare, IRooms, SocketRoom } from "../type";

const cors = require("cors");
const uuid = require("uuid");

const PORT = process.env.PORT || 8081;
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

// nameSpace 설정
const room = io.of("/room");
const chat = io.of("/chat");

const rooms: IRooms = {};
const socketToRoom: SocketRoom = {};
const maxParticipationRoom = 22;

const hasParticipationRoom = (
  rooms: IRooms,
  roomId: string,
  maxParticipationRoom: number
) => {
  return length === maxParticipationRoom ? false : true;
};

io.on("connection", (socket) => {
  socket.on("JOIN_ROOM", (roomId: string) => {
    // 기존의 룸 나가기
    console.log("JOIN_ROOM");
    console.log(socket.id);
    //socket.leave(socket.id);
    socket.join(roomId);

    if (rooms[roomId]) {
      const length = rooms[roomId].length;
      if (length === maxParticipationRoom) {
        socket.emit("ROOM_FULL");
        return;
      }
      rooms[roomId].push(socket.id);
    } else {
      rooms[roomId] = [socket.id];
    }

    socketToRoom[socket.id] = roomId;
    const usersInThisRoom = rooms[roomId].filter(
      (userId) => userId !== socket.id
    );
    io.sockets.to(socket.id).emit("ALL_USERS", usersInThisRoom);
  });

  socket.on("CANDIDATE", (candidate) => {
    socket.broadcast.emit("CANDIDATE", candidate);
  });

  socket.on("OFFER", (sdp) => {
    console.log("[INFO] OFFER ==================");
    socket.broadcast.emit("OFFER", sdp);
  });

  socket.on("ANSWER", (sdp) => {
    console.log("[INFO] ANSWER ==================");
    socket.broadcast.emit("ANSWER", sdp);
  });

  socket.on("DISCONNECT", () => {
    const roomId = socketToRoom[socket.id];
    let room = rooms[roomId];
    if (room) {
      room = room.filter((userId) => userId !== socket.id);
      rooms[roomId] = room;
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(
    "\x1b[33m%s\x1b[0m",
    `*****************************************************************`
  );
  console.log(
    "\x1b[33m%s\x1b[0m",
    `                [SignalingServer START] : ${PORT}                 `
  );
  console.log(
    "\x1b[33m%s\x1b[0m",
    `*****************************************************************`
  );
});
