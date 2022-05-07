import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

export interface SocketRoom {
  [key: string]: string;
}

export interface IRooms {
  [key: string]: string[];
}

var cors = require("cors");
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const rooms: IRooms = {};
const socketToRoom: SocketRoom = {};
const maximum = 2;

io.on("connection", (socket) => {
  socket.on("JOIN_ROOM", (roomId: string) => {
    if (rooms[roomId]) {
      const length = rooms[roomId].length;
      if (length === maximum) {
        socket.to(socket.id).emit("room_full");
        return;
      }
      rooms[roomId].push(socket.id);
    } else {
      rooms[roomId] = [socket.id];
    }
    socketToRoom[socket.id] = roomId;
    socket.join(roomId);
    const usersInThisRoom = rooms[roomId].filter(
      (userId) => userId !== socket.id
    );
    io.sockets.to(socket.id).emit("all_users", usersInThisRoom);
  });
  socket.on("REQUEST_TREATMENT", () => {
    socket.broadcast.emit("REQUEST_TREATMENT_RESULT", true);
  });

  socket.on("REQUEST_TREATMENT_DOCTOR", () => {
    const data = {
      memberId: 1,
      treatmentId: 1,
      memberName: "홍길동",
      memberSexType: "MALE",
      memberBirthDate: "19800101",
    };
    socket.broadcast.emit("REQUEST_TREATMENT_DOCTOR_RESULT", data);
  });
});

httpServer.listen(8080);
