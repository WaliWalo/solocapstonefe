export interface IHomeProps {
  socket: SocketIOClient.Socket;
}

export interface IHomeJoinMessage {
  msg: string;
  status: string;
}
