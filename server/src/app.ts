import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { isUser, createUser, addUsers, deleteUser } from "./utils";
const cors = require("cors");

const PORT = process.env.PORT || 8081;
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

let users = {};

io.on("connection", (socket) => {
  // 닉네임 중복 체크 및 닉네임 + socketId 돌려줌
  socket.on("IS_USER", (nickName, isUserCallback) => {
    isUser(users, nickName)
      ? isUserCallback({ isUser: true, user: null })
      : isUserCallback({
          user: createUser(nickName, socket.id),
          isUser: false,
        });
  });
  socket.on("NEW_USER", (user) => {
    users = addUsers(users, user);
    socket.data.user = user;
    socket.emit("NEW_USER", { newUsers: users });
  });

  socket.on("LOGOUT", () => {
    users = deleteUser(users, socket.data.user.nickname);
    io.emit("LOGOUT", { newUsers: users, outUser: socket.data.user.nickname });
  });
});

httpServer.listen(PORT, () => console.log("App was start at port : " + PORT));
