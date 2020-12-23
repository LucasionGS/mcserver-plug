/// <reference types="node" />
import * as cp from "child_process";
import { EventEmitter } from "events";
import { User } from "./User";
import * as readline from "readline";
export declare class Server extends EventEmitter {
    /**
     * Initialize a minecraft server.
     * @param serverJarPath Path to the server.jar file.
     * @param skipStartup If set to `true`, skips the startup and has to be done manually using start();
     ```js
     let server = new Server("/path/to/server.jar", true);
     server.start();
     ```
     */
    constructor(serverJarPath: string, skipStartup?: boolean);
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
    ready: boolean;
    setProperty<T extends keyof ServerProperties>(name: T, value: ServerProperties[T]): void;
    getProperty<T extends keyof ServerProperties>(name: T): ServerProperties[T];
    setProperties(keyValues: Partial<ServerProperties>): void;
    private parseProperties;
    executeCommand<CommandName extends keyof CommandMap>(command: CommandName): Promise<ConsoleInfo<CommandName>>;
    executeCommand<CommandName extends keyof CommandMap>(command: string): Promise<ConsoleInfo<CommandName>>;
    executeIonCommand<CommandName extends keyof CommandMap>(command: CommandName): Promise<ConsoleInfo<CommandName>>;
    executeIonCommand<CommandName extends keyof CommandMap>(command: string): Promise<ConsoleInfo<CommandName>>;
    executeCustomCommand<CommandName extends keyof CommandMap = null>(command: string): Promise<ConsoleInfo<CommandName>>;
    executeCustomCommand(command: string): Promise<ConsoleInfo>;
    fileName: string;
    directoryPath: string;
    get serverJarPath(): string;
    set serverJarPath(v: string);
    userList: User[];
    getOperators(): Promise<Operator[]>;
    isUserOperator(user: User): Promise<boolean>;
    private start;
    stop(force?: boolean): void;
    process: cp.ChildProcess;
    commands: {
        list: () => Promise<ConsoleInfo<null>>;
        trigger: (text: string) => Promise<ConsoleInfo<"trigger">>;
        scoreboard: (text: string) => Promise<ConsoleInfo<"scoreboard">>;
    };
    ionCommands: {
        clear: () => ConsoleInfo<null>;
        list: () => Promise<ConsoleInfo<null>>;
    };
    clear(): void;
}
export interface Server extends EventEmitter {
    /**
     * Runs when the server console has been cleared.
     */
    on(event: "clear", listener: () => void): this;
    /**
     * Runs when any data has been written to the server console.
     */
    on(event: "write", listener: (data: string | ConsoleInfo | object) => void): this;
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
    emit(event: "clear"): boolean;
    emit(event: "write", data: string | ConsoleInfo | object): boolean;
    emit(event: "stopped"): boolean;
    emit(event: "ready", time: number): boolean;
    emit(event: "connect", user: User): boolean;
    emit(event: "disconnect", user: User, reason?: string): boolean;
    emit(event: "message", message: string, user: User): boolean;
    emit(event: "data", info: ConsoleInfo): boolean;
}
interface Operator {
    "uuid": string;
    "name": string;
    "level": number;
    "bypassesPlayerLimit": boolean;
}
export interface ServerProperties {
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
export declare type CommandMap = {
    list: CommandResponse.List;
    trigger: CommandResponse.Trigger;
    scoreboard: CommandResponse.Scoreboard;
};
declare namespace CommandResponse {
    interface List {
        players: number;
        maxPlayers: number;
    }
    interface Trigger {
    }
    interface Scoreboard {
    }
}
export declare type ConsoleInfoMessageType = "INFO" | "WARN" | "FATAL" | "NODEJS";
export declare class ConsoleInfo<CommandData extends keyof CommandMap = null> {
    constructor(data: string);
    static create(message: string): ConsoleInfo;
    static create(options: {
        sender?: string;
        messageType?: ConsoleInfoMessageType;
        message: string;
    }): ConsoleInfo;
    /**
     * Convert object into a string.
     */
    toString(): string;
    /**
     * Convert object into an HTMLDivElement containing the data.
     */
    toHTML(): HTMLDivElement;
    timeStamp: string;
    sender: string;
    messageType: ConsoleInfoMessageType;
    message: string;
    /**
     * Use will be set with data from an executed command.
     */
    data: CommandMap[CommandData];
}
export {};
