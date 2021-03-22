import { IUser } from "../../utils/types";
import { IPlayer } from "../lobbyPage/types";
import { IRoom } from "./../lobbyPage/types";

export interface IRouletteProp {
  players: Array<IPlayer>;
  prizeNumber: number;
  mustSpin: boolean;
  stopSpin?: () => void;
}

export interface ITodModalProp {
  show: boolean;
  onHide: () => void;
  roomName: string;
  userId: string;
}

export interface IQuestionsModalProp {
  show: boolean;
  onHide: () => void;
  selection: string;
  roomName: string;
  userId: string;
}

export interface IPlayersModalProp {
  show: boolean;
  onHide: () => void;
  players: Array<IUser>;
  roomName: string;
}

export interface IPlayerScoreProp {
  room: IRoom;
  userId: string;
}

export interface IWyrProp {
  show: boolean;
  onHide: () => void;
  question: string;
  roomName: string;
  userId: string;
}

export interface IWyrScoreProp {
  selections: Array<string>;
}

export interface IQuestion {
  questionType: string;
  content: string;
}
