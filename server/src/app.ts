import events from "events";
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
    console.log("[INFO] NEW_USER ");
    users = addUsers(users, user);
    socket.data.user = user;
    console.log(socket.data.user);
    socket.emit("NEW_USER", { newUsers: users });
  });

  socket.on("LOGOUT", () => {
    users = deleteUser(users, socket.data.user.nickName);
    socket.emit("LOGOUT", {
      newUsers: users,
      outUser: socket.data.user.nickName,
    });
  });

  socket.on("disconnect", () => {
    if (socket.data.user) {
      users = deleteUser(users, socket.data.user.nickName);
      socket.emit("LOGOUT", {
        newUsers: users,
        outUser: socket.data.user.nickName,
      });
    }
  });

  socket.on("TYPING", ({ channel, isTyping }) => {
    socket.data.user &&
      io.emit("TYPING", {
        channel,
        isTyping,
        sender: socket.data.user.nickName,
      });
  });

  socket.on("P_TYPING", ({ receiver, isTyping }) => {
    const sender = socket.data.user.nickName;
    socket.to(receiver).emit("P_TYPING", { channel: sender, isTyping });
  });
});

httpServer.listen(PORT, () => console.log("App was start at port : " + PORT));
