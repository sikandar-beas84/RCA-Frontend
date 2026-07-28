import { io } from "socket.io-client";
import { env } from '@/config/env';

const socket = io(env.SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("Socket Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket Disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.log("Socket Error:", err.message);
});

export default socket;