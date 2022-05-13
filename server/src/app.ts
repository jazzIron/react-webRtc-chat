import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { SocketMsgType } from "./chat/Constant";
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
  socket.on(SocketMsgType.IS_USER, (nickName, isUserCallback) => {
    // 닉네임 중복체크
    isUser(users, nickName)
      ? isUserCallback({ isUser: true, user: null })
      : isUserCallback({
          user: createUser(nickName, socket.id),
          isUser: false,
        });
  });

  socket.on(SocketMsgType.NEW_USER, (user) => {
    console.log("[INFO] NEW_USER ");
    users = addUsers(users, user);
    socket.data.user = user;
    io.emit(SocketMsgType.NEW_USER, { newUsers: users });
  });

  socket.on(SocketMsgType.LOGOUT, () => {
    users = deleteUser(users, socket.data.user.nickName);
    io.emit(SocketMsgType.LOGOUT, {
      newUsers: users,
      outUser: socket.data.user.nickName,
    });
  });

  socket.on(SocketMsgType.DISCONNECT, () => {
    if (socket.data.user) {
      users = deleteUser(users, socket.data.user.nickName);
      io.emit(SocketMsgType.LOGOUT, {
        newUsers: users,
        outUser: socket.data.user.nickName,
      });
    }
  });

  socket.on(SocketMsgType.INIT_CHATS, (initChatsCallback) => {
    initChatsCallback(chats);
  });

  socket.on(SocketMsgType.MESSAGE_SEND, ({ channel, msg }) => {
    console.log(`[INFO] MESSAGE_SEND ===========`);

    const message = createMessage(msg, socket.data.user.nickName);

    console.log(channel);
    console.log(message);

    io.emit(SocketMsgType.MESSAGE_SEND, { channel, message });
  });

  socket.on(SocketMsgType.TYPING, ({ channel, isTyping }) => {
    socket.data.user &&
      io.emit(SocketMsgType.TYPING, {
        channel,
        isTyping,
        sender: socket.data.user.nickName,
      });
  });

  socket.on(SocketMsgType.P_MESSAGE_SEND, ({ receiver, msg }) => {
    if (socket.data.user) {
      const sender = socket.data.user.nickName;
      const message = createMessage(msg, sender);
      socket
        .to(receiver.socketId)
        .emit(SocketMsgType.P_MESSAGE_SEND, { channel: sender, message });
      socket.emit(SocketMsgType.P_MESSAGE_SEND, {
        channel: receiver.nickName,
        message,
      });
    }
  });

  socket.on(SocketMsgType.P_TYPING, ({ receiver, isTyping }) => {
    const sender = socket.data.user.nickName;
    socket
      .to(receiver)
      .emit(SocketMsgType.P_TYPING, { channel: sender, isTyping });
  });

  socket.on(
    SocketMsgType.CHECK_CHANNEL,
    ({ channelName, channelDescription }, updateChatsCallback) => {
      console.log(`[INFO] CHECK_CHANNEL ===========`);

      if (isChannel(channelName, chatsList)) {
        updateChatsCallback(true);
      } else {
        const newChat = createChat({
          name: channelName,
          description: channelDescription,
        });
        chatsList.push(channelName);
        chats.push(newChat);
        io.emit(SocketMsgType.CREATE_CHANNEL, newChat);
        updateChatsCallback(false);
      }
    }
  );
});

httpServer.listen(PORT, () => console.log("App was start at port : " + PORT));
