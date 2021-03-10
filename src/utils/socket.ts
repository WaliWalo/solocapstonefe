import io from "socket.io-client";
const connOpt = {
  secure: true,
  transports: ["websocket"],
};
let socket: SocketIOClient.Socket | null = null;

if (process.env.REACT_APP_BE_URL !== undefined) {
  socket = io(process.env.REACT_APP_BE_URL, connOpt);
}

export { socket };
