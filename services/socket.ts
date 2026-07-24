import { io } from "socket.io-client";
import { env } from '@/config/env';

const socket = io(env.SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;