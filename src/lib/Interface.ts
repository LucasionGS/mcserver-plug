import express from "express";
import Path from "path";
import WebSocket from "ws";
import IonMC from "./IonMC";
import { ConsoleInfo, ServerProperties } from "./Server";
import { Server } from "./Server";
import { User } from "./User";

const app = express();
const PORT = 8090;
const WSPORT = 8091;
const WSTOKEN = "KJUH37IYFBHJFSD7TFASBN6TJBYHB6TBTYDFT"; // Temporary token
app.listen(PORT, () => {
  console.log(`Express: listening on port ${PORT}`);
});
// __dirname is from dist
app.use(express.static(Path.resolve(__dirname, "../../interface"), {
  extensions: ["html", "htm"],
}));

const wss = new WebSocket.Server({ port: WSPORT }, () => {
  console.log(`Websocket: listening on port ${WSPORT}`);
});

namespace WS {
  export function send(ws: WebSocket, message: any) {
    ws.send(JSON.stringify(message));
  }

  export function broadcast(message: IWSActionMessage) {
    wss.clients.forEach((ws) => {
      WS.send(ws, message);
    });
  }

  export function isAction<T extends keyof IWSActionMessageMap>(obj: IWSActionMessage, action: T): obj is IWSActionMessageMap[T] {
    return obj.action === action;
  }

  type IWSMessage<T extends IWSAction, Properties extends { [key: string]: any } = {}> = Properties & {
    token: string;
    action: T;
  }

  export interface IWSActionMessageMap {
    "start": IWSMessage<"start", { name: string }>;
    "attach": IWSMessage<"attach">;
    "input": IWSMessage<"input", { value: string, pid: number }>;
    "change-settings": IWSMessage<"change-settings", ServerProperties>;
    "create": IWSMessage<"create">;
    "server-list": IWSMessage<"server-list">;
  }

  type IWSAction = keyof IWSActionMessageMap;

  export type IWSActionMessage = IWSActionMessageMap[keyof IWSActionMessageMap];

  export function parse(message: string): IWSActionMessage {
    try {
      return JSON.parse(message);
    } catch (error) {
      return null;
    }
  }
}

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    const data: WS.IWSActionMessage = WS.parse(message);
    if (data === null) return;
    if (data.token !== WSTOKEN) return;

    const isAction = WS.isAction;
    if (isAction(data, "start")) {
      Manager.start(data.name, ws);
    }
    else if (isAction(data, "input")) {
      Manager.input(data.pid, data.value);
    }
    else if (isAction(data, "server-list")) {
      Manager.sendServers(ws);
    }
  });
});

namespace Manager {
  export const servers: { [pid: string]: Server } = {};

  export function getRunningServerByName(name: string) {
    for (const pid in servers) {
      const server = servers[pid];
      if (server.name === name) return server;
    }
    return null;
  }

  export async function start(name: string, ws?: WebSocket) {
    let server: Server;
    const startServer = () => {
      server = new Server(Path.resolve(IonMC.globalServersPath, name, "server.jar"), {
        preventStart: true,
        noReadline: true,
      });
    }
    startServer();
    const pidLock = await server.getSessionLock();
    if (pidLock !== null) {
      // console.log("Server is already running");
      // console.log("Attaching to server: " + pidLock);
      
      server = servers[pidLock];
    }

    if (!server || pidLock === null) {
      // console.log("Starting server");
      startServer();
      server.start();
      servers[server.pid] = server;

      server.on("stopped", () => {
        delete servers[server.pid];
      });
    }

    if (!server) {
      console.error("Failed to start server.");
      WS.send(ws, {
        action: "error",
        message: "Failed to start server.",
      });
      return;
    }

    if (ws) {
      attach(server.pid, ws);
    }
  }

  export function attach(pid: number, ws: WebSocket) {
    const server = servers[pid];
    if (!server) return;

    function onData(info: ConsoleInfo) {
      WS.send(ws, {
        pid: pid,
        action: "message",
        message: info.toString(),
      });
    };
    server.on("data", onData);
    
    const onStopped = () => {
      WS.send(ws, {
        pid: pid,
        action: "stopped",
      });
    };
    server.on("stopped", onStopped);

    const onConnect = async (user: User): Promise<void> => {
      WS.send(ws, {
        pid: pid,
        action: "connect",
        user,
      });
      sendPlayers(ws, server);
    };
    server.on("connect", onConnect);

    const onDisconnect = async (user: User): Promise<void> => {
      WS.send(ws, {
        pid: pid,
        action: "disconnect",
        user,
      });
      sendPlayers(ws, server);
    };
    server.on("disconnect", onDisconnect);

    ws.on("close", () => {
      server.off("data", onData);
      server.off("stopped", onStopped);
      server.off("connect", onConnect);
      server.off("disconnect", onDisconnect);
    });

    WS.send(ws, {
      pid,
      action: "attached",
      serverLog: server.serverLog.map(i => i.toString())
    });
    setTimeout(() => {
      sendPlayers(ws, server);
    }, 100);
  }

  export function input(pid: number, value: string) {
    const server = servers[pid];
    if (!server) return;
    server.executeCustomCommand(value);
  }

  function sendPlayers(ws: WebSocket, server: Server) {
    WS.send(ws, {
      pid: server.pid,
      action: "player-list",
      players: server.userList,
    });
  }

  export async function sendServers(ws: WebSocket) {
    WS.send(ws, {
      action: "server-list",
      servers: (await IonMC.listServers(() => void 0)).global,
    });
  }

  export function getServer(pid: number) {
    return servers[pid] ?? null;
  }

  export function getServerByName(name: string) {
    return getRunningServerByName(name) || Server.getServerByName(name);
  }

  export async function getAllServers() {
    const servers = await Server.getAllServers();
    for (let i = 0; i < servers.length; i++) {
      const server = servers[i];
      const found = getRunningServerByName(server.name);
      if (found) {
        servers[i] = found;
      }
    }
    return servers;
  }

  export function getServerStatus(server: Server) {
    const properties = server.parseProperties();
    return {
      name: server.name,
      status: server.getStatus(),
      players: server.userList.length,
      maxPlayers: properties["max-players"],
      port: properties["server-port"],
    }
  }

  export function getServerProperties(server: Server) {
    return server.parseProperties();
  }
}

const router = express.Router();

app.use("/api", router);

function verifyToken() {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.query.token !== WSTOKEN) {
      res.status(403).send("Invalid token");
      return;
    }
    next();
  }
}

router.get("/serverList", verifyToken(), async (req, res) => {
  res.json(await Manager.getAllServers().then(s => s.map(Manager.getServerStatus)));
});