import { IUser } from "../../utils/types";

export interface IRoom {
  roomName: string;
  _id: string;
  started: boolean;
  roomType: string;
  users: Array<IUser>;
}

export interface IPlayer {
  option: string;
}

export interface IUserJoin {
  userId: string;
}

export interface ILobbyPlayersProps {
  players: IPlayer[];
}
