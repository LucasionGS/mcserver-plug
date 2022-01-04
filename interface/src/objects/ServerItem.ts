export interface ServerItem {
  name: string;
  players: number;
  maxPlayers: number;
  status: "running" | "starting" | "offline";
  port: number;
}
