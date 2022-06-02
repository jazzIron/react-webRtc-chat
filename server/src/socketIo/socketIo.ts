import console from "console";
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

let users: any = [];

const isValidJwt = (header: string | undefined) => {
  if (!header) return false;
  const token = header.split(" ")[1];
  if (token === "abc") {
    return true;
  } else {
    return false;
  }
};

// io.use((socket, next) => {
//   console.log(`미들웨어`);
//   const header = socket.handshake.headers["authorization"];
//   if (isValidJwt(header)) {
//     return next();
//   }
//   return next(new Error("authentication error"));
// });

io.on("connection", (socket) => {
  //   const users = [];
  //   for (const [id, socket] of io.of("/").sockets) {
  //     console.log(socket);
  //     users.push({
  //       userID: id,
  //       username: socket.data.username,
  //     });
  //   }
  //   console.log(`==============connection================`);
  //   console.log(socket.rooms); // Set { <socket.id> }
  //   console.log(users);
  //   socket.emit("users", users);
  //   socket.broadcast.emit("user_connected", {
  //     userID: socket.id,
  //     username: socket.data.username,
  //   });

  console.log(socket.id);

  socket.on("disconnect", (reason) => {
    console.error("[ERROR] socket disconnected");
    console.log(reason);
  });

  socket.on("disconnecting", (reason) => {
    console.error("[ERROR] socket disconnecting");
    console.log(reason);
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("user has left", socket.id);
      }
    }
  });

  socket.on("login", (user, isUserCallback) => {
    console.log("[LOGIN] socket login");
    console.log(user);
    if (isUser(users, user.nickName)) {
      return isUserCallback({ isUser: true, user: null });
    } else {
      const socketId = socket.id;
      isUserCallback({
        isUser: false,
        user: createUser(user, socketId),
      });
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
    `                [socketIo START] : ${PORT}                 `
  );
  console.log(
    "\x1b[33m%s\x1b[0m",
    `*****************************************************************`
  );
});
