import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  SocketRoom,
  IRooms,
  IDoctor,
  IPatient,
  IRequested,
  IOfferCare,
} from "./type";

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

// 환자들 요청 대기 장소
let patientRoom: IPatient[] = [];
// 의사들 요청 대기 장소
let doctorRoom: IDoctor[] = [];
// 진료 요청 장소
let requestRoom: IRequested[] = [];

// 진료실
const rooms: IRooms = {};
const socketToRoom: SocketRoom = {};
const maximum = 2;

const handleCleanRoom = (socketId: string) => {
  const disPatient = getPatientInfoBySocketId(socketId);
  const disDoctor = doctorRoom.find((doctor) => doctor.socketId === socketId);

  if (disPatient) {
    patientRoom = patientRoom.filter(
      (patient) => patient.socketId !== disPatient?.id
    );
  }

  if (disDoctor) {
    doctorRoom = doctorRoom.filter(
      (doctor) => doctor.socketId !== disDoctor?.id
    );
    io.sockets.emit("getDoctorList", doctorRoom);
  }
};

const handleReset = () => {
  patientRoom = [];
  doctorRoom = [];
  requestRoom = [];
  io.sockets.emit("getDoctorList", []);
  io.sockets.emit("getPatientList", []);
  io.sockets.emit("getRequestPatientList", []);
  io.sockets.emit("reset");
};

const handleRequestCare = (doctorId: string) => {
  const requestDoctor = getDoctorInfoById(doctorId);

  if (requestDoctor) {
    const patientIdList = requestRoom
      .filter((request) => request.doctorId === doctorId)
      .map((request) => request.patientId);

    const requestPatientInfo = patientRoom.filter((patient) =>
      patientIdList.includes(patient.id)
    );

    io.sockets
      .to(requestDoctor.socketId)
      .emit("getRequestPatientList", requestPatientInfo);
  }
};

const getPatientInfoById = (patientId: string) =>
  patientRoom.find((patient) => patient.id === patientId);

const getPatientInfoBySocketId = (socketId: string) =>
  patientRoom.find((patient) => patient.socketId === socketId);

const getDoctorInfoById = (doctorId: string) =>
  doctorRoom.find((doctor) => doctor.id === doctorId);

const getDoctorInfoBySocketId = (socketId: string) =>
  doctorRoom.find((doctor) => doctor.socketId === socketId);

io.on("connection", (socket) => {
  // 환자 입장시 처리
  socket.on("joinPatientRoom", (patientInfo: IPatient) => {
    const refreshPatientList = patientRoom.filter(
      (patient) => patient.id !== patientInfo.id
    );
    patientRoom = [
      ...refreshPatientList,
      { ...patientInfo, socketId: socket.id },
    ];
  });

  // 의사 입장시 처리
  socket.on("joinDoctorRoom", (doctorInfo: IDoctor) => {
    const refreshDoctorList = doctorRoom.filter(
      (doctor) => doctor.id !== doctorInfo.id
    );
    doctorRoom = [...refreshDoctorList, { ...doctorInfo, socketId: socket.id }];
  });

  // 환자가 의사에게 요청하는 함수
  // api로 대체되어야 하지만 기능상 구현되었고, 현재는 사용되지 않음
  socket.on("requestCare", (requestInfo: IRequested) => {
    const refreshRequestList = requestRoom.filter(
      (request) => request.patientId !== requestInfo.patientId
    );
    requestRoom = [...refreshRequestList, requestInfo];
    handleRequestCare(requestInfo.doctorId);
  });

  socket.on("offerCare", (offerInfo: IOfferCare) => {
    const patientSocket = getPatientInfoById(offerInfo.patientId);
    if (patientSocket?.socketId) {
      io.sockets.to(patientSocket.socketId).emit("offerCare", offerInfo);
    }
  });

  socket.on("join_room", (roomId: string) => {
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

  socket.on("offer", (sdp) => {
    socket.broadcast.emit("getOffer", sdp);
  });

  socket.on("answer", (sdp) => {
    socket.broadcast.emit("getAnswer", sdp);
  });

  socket.on("candidate", (candidate) => {
    socket.broadcast.emit("getCandidate", candidate);
  });

  socket.on("reset", () => {
    handleReset();
  });

  socket.on("hangup", () => {
    socket.broadcast.emit("hangup");
  });

  socket.on("sendCompleteData", () => {
    socket.broadcast.emit("sendCompleteData");
  });

  socket.on("disconnect", () => {
    const roomId = socketToRoom[socket.id];
    let room = rooms[roomId];
    if (room) {
      room = room.filter((userId) => userId !== socket.id);
      rooms[roomId] = room;
    }
    handleCleanRoom(socket.id);
  });
});

httpServer.listen(8080);
