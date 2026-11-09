import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { TOKEN_KEY } from "./api";

export function createSocket(): Socket {
  return io(import.meta.env.VITE_API_URL, {
    auth: { token: localStorage.getItem(TOKEN_KEY) },
  });
}