import * as Path from "path";
import * as cp from "child_process";
import * as fs from "fs";
import { EventEmitter } from "events";
import util from "./IonUtil";
import { User } from "./User";
import { stdout } from "process";
import * as readline from "readline";

export class Server extends EventEmitter {
  constructor(serverJarPath: string) {
    super();
    this.serverJarPath = Path.resolve(serverJarPath);

    this.process = this.start();
    process.openStdin();

    this.terminal = readline.createInterface(process.stdin);
    this.terminal.on("line", line => {
      if (!line.startsWith("@")) {
        // Minecraft command
        this.executeCustomCommand(line);
      }
      else {
        // IonMC command.
        let cmd = line.substring(1);
        this.executeIonCommand(cmd).then(res => {
          if (res.data) this.write(res.data);
        });
      }
    })
  }

  terminal: readline.Interface;

  /**
   * Write console info to the output.
   */
  write(info: ConsoleInfo): void;
  /**
   * Write text to the output.
   */
  write(text: string): void;
  /**
   * Write object info to the output.
   */
  write(object: object): void;
  write(text: string | ConsoleInfo | object) {
    if (text instanceof ConsoleInfo) text = text.toString();
    else if (typeof text == "object") text = JSON.stringify(text, null, 2);
    stdout.write(text + "\n");
  }

  ready: boolean = false;

  public setProperty<T extends keyof ServerProperties>(name: T, value: ServerProperties[T]) {
    this.setProperties({
      [name]: value
    })
  }
  
  public getProperty<T extends keyof ServerProperties>(name: T): ServerProperties[T] {
    return this.parseProperties()[name];
  }
  
  public setProperties(keyValues: Partial<ServerProperties>) {
    let p = this.parseProperties();

    for (const key in keyValues) {
      if (Object.prototype.hasOwnProperty.call(keyValues, key)) {
        const value = (keyValues as any)[key];
        (p as any)[key] = value !== undefined && value !== null ? value : null;
      }
    }

    let newText = "# Minecraft Server Properties\n# Edited by MCServer Ionhancer\n";
    for (const key in p) {
      if (Object.prototype.hasOwnProperty.call(p, key)) {
        const v = (p as any)[key];
        newText += key + "=" + (v !== undefined && v !== null ? v : "") + "\n";
      }
    }

    fs.writeFileSync(this.directoryPath + "/server.properties", newText);
  }
  
  private parseProperties() {
    let properties: ServerProperties = {} as ServerProperties;
    let text = fs.readFileSync(this.directoryPath + "/server.properties", "utf8");
    let matches = text.match(/(.+?)=(.*)/g);

    matches.forEach(m => {
      let newMatch = m.match(/(.+?)=(.*)/);
      let key = newMatch[1];
      let value: any = newMatch[2];

      if (value === "true") value = true;
      else if (value === "false") value = false;
      else if (value !== "" && value !== null && !isNaN(+value)) value = +value;

      (properties as any)[key] = value;
    });

    return properties;
  }

  public executeCommand<CommandName extends keyof CommandMap>(command: CommandName): Promise<ConsoleInfo<CommandName>>;
  public executeCommand<CommandName extends keyof CommandMap>(command: string): Promise<ConsoleInfo<CommandName>>;
  public executeCommand<CommandName extends keyof CommandMap>(command: CommandName): Promise<ConsoleInfo<CommandName>> {
    let parts = command.split(" ");
    let firstCmdWord = parts[0];
    if (this.commands.hasOwnProperty(firstCmdWord)) {
      return (this.commands as any)[firstCmdWord](parts.length == 1 ? parts.join(" ") : null) as Promise<ConsoleInfo<CommandName>>;
    } 
    else {
      return this.executeCustomCommand<CommandName>(command);
    }
  }
  
  public executeIonCommand<CommandName extends keyof CommandMap>(command: CommandName): Promise<ConsoleInfo<CommandName>>;
  public executeIonCommand<CommandName extends keyof CommandMap>(command: string): Promise<ConsoleInfo<CommandName>>;
  public executeIonCommand<CommandName extends keyof CommandMap>(command: CommandName): Promise<ConsoleInfo<CommandName>> {
    let parts = command.split(" ");
    let firstCmdWord = parts[0];
    if (this.ionCommands.hasOwnProperty(firstCmdWord)) {
      return (this.ionCommands as any)[firstCmdWord](parts.length == 1 ? parts.join(" ") : null) as Promise<ConsoleInfo<CommandName>>;
    }
    else {
      this.write(ConsoleInfo.create({
        message: `Command "${firstCmdWord}" doesn't exist.`,
        messageType: "WARN"
      }))
    }
  }
  
  public executeCustomCommand<CommandName extends keyof CommandMap = null>(command: string): Promise<ConsoleInfo<CommandName>>;
  public executeCustomCommand(command: string): Promise<ConsoleInfo>;
  public executeCustomCommand(command: string): Promise<ConsoleInfo> {
    this.process.stdin.write(command + "\n");
    let p = util.promise<ConsoleInfo>();
    this.process.stdout.once("data", (chk) => {
      p.resolve(new ConsoleInfo(chk));
    });
    return p.promise;
  }

  public fileName: string;
  public directoryPath: string;
  public get serverJarPath() {
    return Path.resolve(this.directoryPath, this.fileName);
  }
  public set serverJarPath(v) {
    this.directoryPath = Path.dirname(v);
    this.fileName = Path.basename(v);
  }

  public userList: User[] = [];

  private start() {
    this.write("Starting server...");
    
    let proc = cp.spawn("java", [
      "-Xmx2048M", // Memory
      "-Xms2048M", // Memory
      "-jar",
      this.fileName, // Jar File
      "nogui" // Makes it CMD specific
    ], {
      cwd: this.directoryPath
    });

    proc.stdout.on("data", chk => {
      let info = new ConsoleInfo(chk);
      this.emit("data", info);

      { // Emits for special data
        let m: RegExpMatchArray;
        if (!this.ready) {
          if (info.sender == "main" && info.messageType == "INFO"
          && (m = info.message.match(/^You need to agree to the EULA in order to run the server\. Go to eula\.txt for more info\.$/))) {
            let eula = fs.readFileSync(this.directoryPath + "/eula.txt", "utf8");
            fs.writeFileSync(this.directoryPath + "/eula.txt", eula.replace("false", "true"));
            this.stop(true);
            this.process = this.start();
            return;
          }
          else if ((m = info.message.match(/^Done \((.*?)s\)! For help, type "help"/))) {
            this.ready = true;
            this.emit("ready", +m[1]);
          }
        }
        // User login
        else if (info.sender.startsWith("User Authenticator")) {
          if ((m = info.message.match(/^UUID of player (.+?) is (.+)/))) {
            let user = new User(m[1], m[2]);
            this.userList.push(user);
            this.emit("connect", user);
          }
        }
        // User disconnect
        else if ((m = info.message.match(/^(\S+) lost connection:\s*(.*)/))) {
          let userId = this.userList.findIndex(u => u.username == m[1]);
          let user = this.userList.splice(userId, 1)[0];
          this.emit("disconnect", user, m[2]);
        }
        // User message
        else if ((m = info.message.match(/^<(.*?)>\s*(.+)/))) {
          let user = this.userList.find(u => u.username == m[1]);
          this.emit("message", m[2], user);
        }
      }
    });

    proc.stdout.on("error", console.error);
    proc.stdout.on("end", () => this.emit("stopped"));

    return proc;
  }

  public stop(force: boolean = false) {
    this.executeCustomCommand("stop");
    if (force) this.process.kill();
  }

  process: cp.ChildProcess = null;

  commands = {
    list: async () => {
      let info = await this.executeCustomCommand("list");
      let m = info.message.match(/^There are (\d+) of a max of (\d+) players online:/);
      info.data = {
        players: +m[1],
        maxPlayers: +m[2]
      }
      return info;
    },
    trigger: async (text: string) => {
      let info = await this.executeCustomCommand<"trigger">(text);
      // let m = cmd.message.match(/^There are (\d+) of a max of (\d+) players online:/);
      // cmd.data = {
      //   players: +m[1],
      //   maxPlayers: +m[2]
      // }
      return info;
    },
    scoreboard: async (text: string) => {
      let info = await this.executeCustomCommand<"scoreboard">("scoreboard " + text);
      // let m = cmd.message.match(/^There are (\d+) of a max of (\d+) players online:/);
      // cmd.data = {
      //   players: +m[1],
      //   maxPlayers: +m[2]
      // }
      return info;
    },
  }

  ionCommands = {
    clear: () => {
      this.clear();
      return ConsoleInfo.create("Screen cleared.");
    },

    list: () => this.commands["list"](),
  }

  clear() {
    console.clear();
  }
}

export interface Server extends EventEmitter {
  // On
  /**
   * Runs when the server instance has stopped.
   */
  on(event: "stopped", listener: () => void): this;
  /**
   * Runs when the server is ready and joinable.
   */
  on(event: "ready", listener: (time: number) => void): this;
  /**
   * Runs when a user connects to the server.
   */
  on(event: "connect", listener: (user: User) => void): this;
  /**
   * Runs when a user disconnects from the server.
   */
  on(event: "disconnect", listener: (user: User, reason?: string) => void): this;
  /**
   * Runs when any users sends a message. 
   */
  on(event: "message", listener: (message: string, user: User) => void): this;
  /**
   * Runs when any data has been output to the server instance.
   */
  on(event: "data", listener: (info: ConsoleInfo) => void): this;

  // Emit
  emit(event: "stopped"): boolean;
  emit(event: "ready", time: number): boolean;
  emit(event: "connect", user: User): boolean;
  emit(event: "disconnect", user: User, reason?: string): boolean;
  emit(event: "message", message: string, user: User): boolean;
  emit(event: "data", info: ConsoleInfo): boolean;
}

interface ServerProperties {
  "spawn-protection": number;
  "max-tick-time": number;
  "query.port": number;
  "generator-settings": string;
  "sync-chunk-writes": boolean;
  "force-gamemode": boolean;
  "allow-nether": boolean;
  "enforce-whitelist": boolean;
  "gamemode": string;
  "broadcast-console-to-ops": boolean;
  "enable-query": boolean;
  "player-idle-timeout": number;
  "text-filtering-config": string;
  "difficulty": string;
  "spawn-monsters": boolean;
  "broadcast-rcon-to-ops": boolean;
  "op-permission-level": number;
  "pvp": boolean;
  "entity-broadcast-range-percentage": number;
  "snooper-enabled": boolean;
  "level-type": string;
  "hardcore": boolean;
  "enable-status": boolean;
  "enable-command-block": boolean;
  "max-players": number;
  "network-compression-threshold": number;
  "resource-pack-sha1": string;
  "max-world-size": number;
  "function-permission-level": number;
  "rcon.port": number;
  "server-port": number;
  "server-ip": string;
  "spawn-npcs": boolean;
  "allow-flight": boolean;
  "level-name": string;
  "view-distance": number;
  "resource-pack": string;
  "spawn-animals": boolean;
  "white-list": boolean;
  "rcon.password": string;
  "generate-structures": boolean;
  "online-mode": boolean;
  "max-build-height": number;
  "level-seed": string;
  "prevent-proxy-connections": boolean;
  "use-native-transport": boolean;
  "enable-jmx-monitoring": boolean;
  "motd": string;
  "rate-limit": number;
  "enable-rcon": boolean;
}

type CommandMap = {
  list: CommandResponse.List;
  trigger: CommandResponse.Trigger;
  scoreboard: CommandResponse.Scoreboard
}

namespace CommandResponse {
  export interface List {
    players: number;
    maxPlayers: number;
  }
  export interface Trigger {
    
  }
  export interface Scoreboard {
    
  }
}

type ConsoleInfoMessageType = "INFO" | "WARN" | "FATAL" | "NODEJS";

class ConsoleInfo<CommandData extends keyof CommandMap = null> {
  constructor(data: string) {
    let m = (data + "").match(/\[(\d+:\d+:\d+)\] \[(.*?)\/(.*?)\]: (.*)/);
    this.timeStamp = m[1];
    this.sender = m[2];
    this.messageType = m[3] as ConsoleInfoMessageType;
    this.message = m[4];
  }

  static create(message: string): ConsoleInfo;
  static create(options: {
    sender?: string,
    messageType?: ConsoleInfoMessageType,
    message: string
  }): ConsoleInfo;
  static create(options: string | {
    sender?: string,
    messageType?: ConsoleInfoMessageType,
    message: string
  }): ConsoleInfo {
    if (typeof options == "string") options = {
      message: options,
    }
    let date = new Date();
    let info = new ConsoleInfo(
      `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] [${options.sender || "IonMC"}/${options.messageType || "INFO"}]: ${options.message}`
    );
    

    return info;
  }

  /**
   * Convert object into a string.
   */
  toString() {
    return `[${this.timeStamp}] [${this.sender}/${this.messageType}]: ${this.message}`
  }

  timeStamp: string;
  sender: string;
  messageType: ConsoleInfoMessageType;
  message: string;
  /**
   * Use will be set with data from an executed command.
   */
  data: CommandMap[CommandData] = null;
}
