export interface IRoom {
  roomName: string;
  _id: string;
  started: boolean;
}

export interface IPlayer {
  option: string;
}

export interface IUserJoin {
  userId: string;
}
