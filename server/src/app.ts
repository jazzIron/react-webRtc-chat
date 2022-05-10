import events from "events";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  isUser,
  createUser,
  addUsers,
  deleteUser,
  createChat,
  createMessage,
  isChannel,
} from "./utils";
const cors = require("cors");

const PORT = process.env.PORT || 8081;
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

let users = {};
let chatsList = ["Community"];
let communityChat = createChat();
let chats = [communityChat];

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

  socket.on("INIT_CHATS", (initChatsCallback) => {
    initChatsCallback(chats);
  });

  socket.on("MESSAGE_SEND", ({ channel, msg }) => {
    console.log(`[INFO] MESSAGE_SEND ===========`);
    const message = createMessage(msg, socket.data.user.nickName);
    console.log(message);
    socket.emit("MESSAGE_SEND", { channel, message });
  });

  socket.on("P_MESSAGE_SEND", ({ receiver, msg }) => {
    if (socket.data.user) {
      const sender = socket.data.user.nickName;
      const message = createMessage(msg, sender);
      socket
        .to(receiver.socketId)
        .emit("P_MESSAGE_SEND", { channel: sender, message });
      socket.emit("P_MESSAGE_SEND", {
        channel: receiver.nickName,
        message,
      });
    }
  });

  socket.on("TYPING", ({ channel, isTyping }) => {
    socket.data.user &&
      socket.emit("TYPING", {
        channel,
        isTyping,
        sender: socket.data.user.nickName,
      });
  });

  socket.on("P_TYPING", ({ receiver, isTyping }) => {
    const sender = socket.data.user.nickName;
    socket.to(receiver).emit("P_TYPING", { channel: sender, isTyping });
  });

  socket.on(
    "CHECK_CHANNEL",
    ({ channelName, channelDescription }, updateChatsCallback) => {
      if (isChannel(channelName, chatsList)) {
        updateChatsCallback(true);
      } else {
        let newChat = createChat({
          name: channelName,
          description: channelDescription,
        });
        chatsList.push(channelName);
        chats.push(newChat);
        socket.emit("CREATE_CHANNEL", newChat);
        updateChatsCallback(false);
      }
    }
  );
});

httpServer.listen(PORT, () => console.log("App was start at port : " + PORT));
