"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleInfo = exports.Server = void 0;
const Path = __importStar(require("path"));
const cp = __importStar(require("child_process"));
const fs = __importStar(require("fs"));
const events_1 = require("events");
const IonUtil_1 = __importDefault(require("./IonUtil"));
const User_1 = require("./User");
const process_1 = require("process");
const readline = __importStar(require("readline"));
class Server extends events_1.EventEmitter {
    /**
     * Initialize a minecraft server.
     * @param serverJarPath Path to the server.jar file.
     * @param skipStartup If set to `true`, skips the startup and has to be done manually using start();
     ```js
     let server = new Server("/path/to/server.jar", true);
     server.start();
     ```
     */
    constructor(serverJarPath, skipStartup = false) {
        super();
        this.ready = false;
        this.userList = [];
        this.process = null;
        this.commands = {
            list: () => __awaiter(this, void 0, void 0, function* () {
                let info = yield this.executeCustomCommand("list");
                let m = info.message.match(/^There are (\d+) of a max of (\d+) players online:/);
                info.data = {
                    players: +m[1],
                    maxPlayers: +m[2]
                };
                return info;
            }),
            trigger: (text) => __awaiter(this, void 0, void 0, function* () {
                let info = yield this.executeCustomCommand(text);
                // let m = cmd.message.match(/^There are (\d+) of a max of (\d+) players online:/);
                // cmd.data = {
                //   players: +m[1],
                //   maxPlayers: +m[2]
                // }
                return info;
            }),
            scoreboard: (text) => __awaiter(this, void 0, void 0, function* () {
                let info = yield this.executeCustomCommand("scoreboard " + text);
                // let m = cmd.message.match(/^There are (\d+) of a max of (\d+) players online:/);
                // cmd.data = {
                //   players: +m[1],
                //   maxPlayers: +m[2]
                // }
                return info;
            }),
        };
        this.ionCommands = {
            clear: () => {
                this.clear();
                return ConsoleInfo.create("Screen cleared.");
            },
            list: () => this.commands["list"](),
        };
        this.serverJarPath = Path.resolve(serverJarPath);
        if (skipStartup !== true)
            this.start();
    }
    write(data) {
        this.emit("write", data);
        if (data instanceof ConsoleInfo)
            data = data.toString();
        else if (typeof data == "object")
            data = JSON.stringify(data, null, 2);
        process_1.stdout.write(data + "\n");
    }
    setProperty(name, value) {
        this.setProperties({
            [name]: value
        });
    }
    getProperty(name) {
        return this.parseProperties()[name];
    }
    setProperties(keyValues) {
        let p = this.parseProperties();
        for (const key in keyValues) {
            if (Object.prototype.hasOwnProperty.call(keyValues, key)) {
                const value = keyValues[key];
                p[key] = value !== undefined && value !== null ? value : null;
            }
        }
        let newText = "# Minecraft Server Properties\n# Edited by MCServer Ionhancer\n";
        for (const key in p) {
            if (Object.prototype.hasOwnProperty.call(p, key)) {
                const v = p[key];
                newText += key + "=" + (v !== undefined && v !== null ? v : "") + "\n";
            }
        }
        fs.writeFileSync(this.directoryPath + "/server.properties", newText);
    }
    parseProperties() {
        let properties = {};
        let text = fs.readFileSync(this.directoryPath + "/server.properties", "utf8");
        let matches = text.match(/(.+?)=(.*)/g);
        matches.forEach(m => {
            let newMatch = m.match(/(.+?)=(.*)/);
            let key = newMatch[1];
            let value = newMatch[2];
            if (value === "true")
                value = true;
            else if (value === "false")
                value = false;
            else if (value !== "" && value !== null && !isNaN(+value))
                value = +value;
            properties[key] = value;
        });
        return properties;
    }
    executeCommand(command) {
        let parts = command.split(" ");
        let firstCmdWord = parts[0];
        if (this.commands.hasOwnProperty(firstCmdWord)) {
            return this.commands[firstCmdWord](parts.length == 1 ? parts.join(" ") : null);
        }
        else {
            return this.executeCustomCommand(command);
        }
    }
    executeIonCommand(command) {
        let parts = command.split(" ");
        let firstCmdWord = parts[0];
        if (this.ionCommands.hasOwnProperty(firstCmdWord)) {
            return this.ionCommands[firstCmdWord](parts.length == 1 ? parts.join(" ") : null);
        }
        else {
            this.write(ConsoleInfo.create({
                message: `Command "${firstCmdWord}" doesn't exist.`,
                messageType: "WARN"
            }));
        }
    }
    executeCustomCommand(command) {
        this.process.stdin.write(command + "\n");
        let p = IonUtil_1.default.promise();
        this.process.stdout.once("data", (chk) => {
            p.resolve(new ConsoleInfo(chk));
        });
        return p.promise;
    }
    get serverJarPath() {
        return Path.resolve(this.directoryPath, this.fileName);
    }
    set serverJarPath(v) {
        this.directoryPath = Path.dirname(v);
        this.fileName = Path.basename(v);
    }
    getOperators() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield fs.promises.readFile(Path.resolve(this.directoryPath, "ops.json"), "utf8");
            let ops = JSON.parse(data);
            return ops;
        });
    }
    isUserOperator(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let ops = yield this.getOperators();
            return ops.findIndex(o => o.uuid == user.uuid) != -1;
        });
    }
    start() {
        this.write("Starting server...");
        let proc = cp.spawn("java", [
            "-Xmx2048M",
            "-Xms2048M",
            "-jar",
            this.fileName,
            "nogui" // Makes it CMD specific
        ], {
            cwd: this.directoryPath
        });
        proc.stdout.on("data", chk => {
            let info = new ConsoleInfo(chk);
            this.emit("data", info);
            { // Emits for special data
                let m;
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
                        let user = new User_1.User(m[1], m[2]);
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
        // Open access to terminal.
        if (this.process != null)
            this.process.kill("SIGKILL");
        this.process = proc;
        process.openStdin();
        this.terminal = readline.createInterface(process.stdin);
        this.terminal.on("line", line => {
            if (!line.startsWith("@")) {
                // Minecraft command
                this.executeCustomCommand(line);
            }
            else {
                // IonMC command.
                let cmd = line.startsWith("@") ? line.substring(1) : line;
                let res = this.executeIonCommand(cmd);
                if (res instanceof Promise)
                    res.then(res => {
                        if (res.data)
                            this.write(res.data);
                    });
                if (res instanceof ConsoleInfo) {
                    if (res.data)
                        this.write(res.data);
                }
            }
        });
        return proc;
    }
    stop(force = false) {
        if (force)
            this.process.kill();
        else
            this.executeCustomCommand("stop");
    }
    clear() {
        console.clear();
        this.emit("clear");
    }
}
exports.Server = Server;
class ConsoleInfo {
    constructor(data) {
        /**
         * Use will be set with data from an executed command.
         */
        this.data = null;
        data += "";
        let m = (data).match(/\[(\d+:\d+:\d+)\] \[(.*?)\/(.*?)\]: (.*)/);
        if (m) {
            this.timeStamp = m[1];
            this.sender = m[2];
            this.messageType = m[3];
            this.message = m[4];
        }
        else {
            let tmp = ConsoleInfo.create({
                sender: "IonMC",
                messageType: "FATAL",
                message: "Unable to parse: \"" + data + "\""
            });
            this.timeStamp = tmp.timeStamp;
            this.sender = tmp.sender;
            this.messageType = tmp.messageType;
            this.message = tmp.message;
        }
    }
    static create(options) {
        if (typeof options == "string")
            options = {
                message: options,
            };
        let date = new Date();
        let info = new ConsoleInfo(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] [${options.sender || "IonMC"}/${options.messageType || "INFO"}]: ${options.message}`);
        return info;
    }
    /**
     * Convert object into a string.
     */
    toString() {
        return `[${this.timeStamp}] [${this.sender}/${this.messageType}]: ${this.message}`;
    }
    /**
     * Convert object into an HTMLDivElement containing the data.
     */
    toHTML() {
        function escapeHtml(html) {
            return html
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
        if (!document) {
            throw new Error("No document found.");
        }
        ;
        let div = document.createElement("div");
        let color = "";
        switch (this.messageType) {
            case "WARN":
                color = "yellow";
                break;
            case "FATAL":
                color = "red";
                break;
            case "NODEJS":
                color = "lightblue";
                break;
        }
        div.innerHTML = `[${escapeHtml(this.timeStamp)}] [${escapeHtml(this.sender).bold()}/${escapeHtml(this.messageType).fontcolor(color)}]: ${escapeHtml(this.message).fontcolor(color)}`;
        return div;
    }
}
exports.ConsoleInfo = ConsoleInfo;
