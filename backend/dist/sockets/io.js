"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emit = exports.setIO = void 0;
let io = null;
const setIO = (server) => {
    io = server;
};
exports.setIO = setIO;
const emit = (room, event, payload) => {
    io?.to(room).emit(event, payload);
};
exports.emit = emit;
