import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { isUser, createUser } from "./utils";
const cors = require("cors");

const PORT = process.env.PORT || 8081;
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const userList = {};

io.on("connection", (socket) => {
  // 닉네임 중복 체크 및 닉네임 + socketId 돌려줌
  socket.on("IS_USER", (nickName, isUserCallback) => {
    isUser(userList, nickName)
      ? isUserCallback({ isUser: true, user: null })
      : isUserCallback({
          user: createUser(nickName, socket.id),
          isUser: false,
        });
  });
});

httpServer.listen(PORT, () => console.log("App was start at port : " + PORT));
