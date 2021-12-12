import IPlayer from "./IPlayer.js";

export function isAction<T extends keyof IWSActionMessageMap>(obj: IWSActionMessage, action: T): obj is IWSActionMessageMap[T] {
  return obj.action === action;
}

type IWSMessage<T extends IWSAction, Properties extends { [key: string]: any } = {}> = Properties & {
  pid?: number;
  token: string;
  action: T;
}

export interface IWSActionMessageMap {
  "message": IWSMessage<"message", {
    message: string;
  }>;

  "attached": IWSMessage<"attached", {
    serverLog: string[];
  }>;

  "player-list": IWSMessage<"player-list", {
    players: IPlayer[];
  }>;

  "server-list": IWSMessage<"server-list", {
    servers: string[];
  }>;
}

type IWSAction = keyof IWSActionMessageMap;

export type IWSActionMessage = IWSActionMessageMap[keyof IWSActionMessageMap];
