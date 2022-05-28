import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const PORT = process.env.PORT || 8081;
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

// path를 지정한 고유한 io객체를 전역으로 등록.
// 전역변수로 등록함으로서, 다른 파일에서 바로 io객체를 가져와 소켓 설정을 할 수 있다.
app.set("io", io);
