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
exports.Server = void 0;
const Path = __importStar(require("path"));
const cp = __importStar(require("child_process"));
const fs = __importStar(require("fs"));
const events_1 = require("events");
const IonUtil_1 = __importDefault(require("./IonUtil"));
const User_1 = require("./User");
const process_1 = require("process");
class Server extends events_1.EventEmitter {
    constructor(serverJarPath) {
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
        this.serverJarPath = Path.resolve(serverJarPath);
        this.process = this.start();
        process.openStdin();
    }
    write(text) {
        if (text instanceof ConsoleInfo)
            text = text.toString();
        else if (typeof text == "object")
            text = JSON.stringify(text, null, 2);
        process_1.stdout.write(text + "\n");
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
        return proc;
    }
    stop(force = false) {
        this.executeCustomCommand("stop");
        if (force)
            this.process.kill();
    }
}
exports.Server = Server;
class ConsoleInfo {
    constructor(data) {
        /**
         * Use will be set with data from an executed command.
         */
        this.data = null;
        let m = (data + "").match(/\[(\d+:\d+:\d+)\] \[(.*?)\/(.*?)\]: (.*)/);
        this.timeStamp = m[1];
        this.sender = m[2];
        this.messageType = m[3];
        this.message = m[4];
    }
    static create(options) {
        throw "Not yet implemented.";
        let info = new ConsoleInfo(``);
    }
    /**
     * Convert object into a string.
     */
    toString() {
        return `[${this.timeStamp}] [${this.sender}/${this.messageType}]: ${this.message}`;
    }
}
