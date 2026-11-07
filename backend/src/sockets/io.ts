import { Server } from "socket.io";

let io: Server | null = null;

export const setIO = (server: Server) => {
  io = server;
};

export const emit = (room: string, event: string, payload: unknown) => {
  io?.to(room).emit(event, payload);
};