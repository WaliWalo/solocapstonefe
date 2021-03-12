import { IUser } from "../../utils/types";
import { IRoom } from "../lobbyPage/types";

export interface IMessageProp {
  userId?: string;
  room: IRoom;
}

export interface IMessage {
  _id?: string;
  content: string;
  roomId: string;
  sender: IUser;
  url?: string;
}
