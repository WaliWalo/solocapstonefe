import { IPlayer } from "../lobbyPage/types";

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
}

export interface IQuestionsModalProp {
  show: boolean;
  onHide: () => void;
  selection: string;
  roomName: string;
  userId: string;
}

export interface IQuestion {
  questionType: string;
  content: string;
}
