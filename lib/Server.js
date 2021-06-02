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
    constructor(serverJarPath = "server.jar", skipStartup = false) {
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
                return info;
            }),
            scoreboard: (text) => __awaiter(this, void 0, void 0, function* () {
                let info = yield this.executeCustomCommand("scoreboard " + text);
                return info;
            }),
            tellRaw: (user, text) => __awaiter(this, void 0, void 0, function* () {
                let info = yield this.executeCustomCommand(`tellraw ${user.username} ${typeof text === "object" ? JSON.stringify(text) : `"${text}"`}`);
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
                    // if (info.sender == "main" && info.messageType == "INFO"
                    // && (m = info.message.match(/^You need to agree to the EULA in order to run the server\. Go to eula\.txt for more info\.$/))) {
                    //   let eula = fs.readFileSync(this.directoryPath + "/eula.txt", "utf8");
                    //   fs.writeFileSync(this.directoryPath + "/eula.txt", eula.replace("false", "true"));
                    //   this.stop(true);
                    //   this.process = this.start();
                    //   return;
                    // }
                    // else
                    if ((m = info.message.match(/^Done \((.*?)s\)! For help, type "help"/))) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0Isa0RBQW9DO0FBQ3BDLHVDQUF5QjtBQUN6QixtQ0FBc0M7QUFDdEMsd0RBQTZCO0FBQzdCLGlDQUE4QjtBQUM5QixxQ0FBaUM7QUFDakMsbURBQXFDO0FBR3JDLE1BQWEsTUFBTyxTQUFRLHFCQUFZO0lBYXRDLFlBQVksZ0JBQXdCLFlBQVksRUFBRSxjQUF1QixLQUFLO1FBQzVFLEtBQUssRUFBRSxDQUFDO1FBMkJWLFVBQUssR0FBWSxLQUFLLENBQUM7UUF1R2hCLGFBQVEsR0FBVyxFQUFFLENBQUM7UUF3RzdCLFlBQU8sR0FBb0IsSUFBSSxDQUFDO1FBRWhDLGFBQVEsR0FBRztZQUNULElBQUksRUFBRSxHQUFTLEVBQUU7Z0JBQ2YsSUFBSSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7Z0JBQ2pGLElBQUksQ0FBQyxJQUFJLEdBQUc7b0JBQ1YsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDZCxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNsQixDQUFBO2dCQUNELE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQyxDQUFBO1lBQ0QsT0FBTyxFQUFFLENBQU8sSUFBWSxFQUFFLEVBQUU7Z0JBQzlCLElBQUksSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFZLElBQUksQ0FBQyxDQUFDO2dCQUM1RCxPQUFPLElBQUksQ0FBQztZQUNkLENBQUMsQ0FBQTtZQUNELFVBQVUsRUFBRSxDQUFPLElBQVksRUFBRSxFQUFFO2dCQUNqQyxJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBZSxhQUFhLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0JBRS9FLE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQyxDQUFBO1lBQ0QsT0FBTyxFQUFFLENBQU8sSUFBVSxFQUFFLElBQXVCLEVBQUUsRUFBRTtnQkFDckQsSUFBSSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQVksV0FBVyxJQUFJLENBQUMsUUFBUSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBRW5KLE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQyxDQUFBO1NBQ0YsQ0FBQTtRQUVELGdCQUFXLEdBQUc7WUFDWixLQUFLLEVBQUUsR0FBRyxFQUFFO2dCQUNWLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDYixPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUMvQyxDQUFDO1lBRUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7U0FDcEMsQ0FBQTtRQTVRQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFakQsSUFBSSxXQUFXLEtBQUssSUFBSTtZQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBZ0JELEtBQUssQ0FBQyxJQUFtQztRQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QixJQUFJLElBQUksWUFBWSxXQUFXO1lBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNuRCxJQUFJLE9BQU8sSUFBSSxJQUFJLFFBQVE7WUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLGdCQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBSU0sV0FBVyxDQUFtQyxJQUFPLEVBQUUsS0FBMEI7UUFDdEYsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUNqQixDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUs7U0FDZCxDQUFDLENBQUE7SUFDSixDQUFDO0lBRU0sV0FBVyxDQUFtQyxJQUFPO1FBQzFELE9BQU8sSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTSxhQUFhLENBQUMsU0FBb0M7UUFDdkQsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRS9CLEtBQUssTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFO1lBQzNCLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRTtnQkFDeEQsTUFBTSxLQUFLLEdBQUksU0FBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckMsQ0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7YUFDeEU7U0FDRjtRQUVELElBQUksT0FBTyxHQUFHLGlFQUFpRSxDQUFDO1FBQ2hGLEtBQUssTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQ25CLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRTtnQkFDaEQsTUFBTSxDQUFDLEdBQUksQ0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixPQUFPLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxTQUFTLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDeEU7U0FDRjtRQUVELEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRU8sZUFBZTtRQUNyQixJQUFJLFVBQVUsR0FBcUIsRUFBc0IsQ0FBQztRQUMxRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV4QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2xCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksS0FBSyxHQUFRLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU3QixJQUFJLEtBQUssS0FBSyxNQUFNO2dCQUFFLEtBQUssR0FBRyxJQUFJLENBQUM7aUJBQzlCLElBQUksS0FBSyxLQUFLLE9BQU87Z0JBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQztpQkFDckMsSUFBSSxLQUFLLEtBQUssRUFBRSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQUUsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBRXpFLFVBQWtCLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUlNLGNBQWMsQ0FBdUMsT0FBb0I7UUFDOUUsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUM5QyxPQUFRLElBQUksQ0FBQyxRQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQXNDLENBQUM7U0FDOUg7YUFDSTtZQUNILE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFjLE9BQU8sQ0FBQyxDQUFDO1NBQ3hEO0lBQ0gsQ0FBQztJQUlNLGlCQUFpQixDQUF1QyxPQUFvQjtRQUNqRixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ2pELE9BQVEsSUFBSSxDQUFDLFdBQW1CLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBc0MsQ0FBQztTQUNqSTthQUNJO1lBQ0gsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO2dCQUM1QixPQUFPLEVBQUUsWUFBWSxZQUFZLGtCQUFrQjtnQkFDbkQsV0FBVyxFQUFFLE1BQU07YUFDcEIsQ0FBQyxDQUFDLENBQUE7U0FDSjtJQUNILENBQUM7SUFJTSxvQkFBb0IsQ0FBQyxPQUFlO1FBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLEdBQUcsaUJBQUksQ0FBQyxPQUFPLEVBQWUsQ0FBQztRQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDdkMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFJRCxJQUFXLGFBQWE7UUFDdEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDRCxJQUFXLGFBQWEsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUlZLFlBQVk7O1lBQ3ZCLElBQUksSUFBSSxHQUFHLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzVGLElBQUksR0FBRyxHQUFlLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkMsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxjQUFjLENBQUMsSUFBVTs7WUFDcEMsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEMsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQztLQUFBO0lBRU8sS0FBSztRQUNYLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUVqQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUMxQixXQUFXO1lBQ1gsV0FBVztZQUNYLE1BQU07WUFDTixJQUFJLENBQUMsUUFBUTtZQUNiLE9BQU8sQ0FBQyx3QkFBd0I7U0FDakMsRUFBRTtZQUNELEdBQUcsRUFBRSxJQUFJLENBQUMsYUFBYTtTQUN4QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDM0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFeEIsRUFBRSx5QkFBeUI7Z0JBQ3pCLElBQUksQ0FBbUIsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ2YsMERBQTBEO29CQUMxRCxpSUFBaUk7b0JBQ2pJLDBFQUEwRTtvQkFDMUUsdUZBQXVGO29CQUN2RixxQkFBcUI7b0JBQ3JCLGlDQUFpQztvQkFDakMsWUFBWTtvQkFDWixJQUFJO29CQUNKLE9BQU87b0JBQ1AsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3ZFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO3dCQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMzQjtpQkFDRjtnQkFDRCxhQUFhO3FCQUNSLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsRUFBRTtvQkFDckQsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLEVBQUU7d0JBQzdELElBQUksSUFBSSxHQUFHLElBQUksV0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUM1QjtpQkFDRjtnQkFDRCxrQkFBa0I7cUJBQ2IsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLEVBQUU7b0JBQ25FLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3JDO2dCQUNELGVBQWU7cUJBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUU7b0JBQ3BELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUNsQzthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFFbEQsMkJBQTJCO1FBQzNCLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJO1lBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUN6QixvQkFBb0I7Z0JBQ3BCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqQztpQkFDSTtnQkFDSCxpQkFBaUI7Z0JBQ2pCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUNyQyxJQUFJLEdBQUcsWUFBWSxPQUFPO29CQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQ3pDLElBQUksR0FBRyxDQUFDLElBQUk7NEJBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3JDLENBQUMsQ0FBQyxDQUFBO2dCQUNGLElBQUksR0FBRyxZQUFZLFdBQVcsRUFBRTtvQkFDOUIsSUFBSSxHQUFHLENBQUMsSUFBSTt3QkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDcEM7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sSUFBSSxDQUFDLFFBQWlCLEtBQUs7UUFDaEMsSUFBSSxLQUFLO1lBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7WUFDMUIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUF1Q0QsS0FBSztRQUNILE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JCLENBQUM7Q0FDRjtBQWpTRCx3QkFpU0M7QUFxSUQsTUFBYSxXQUFXO0lBQ3RCLFlBQVksSUFBWTtRQTRGeEI7O1dBRUc7UUFDSCxTQUFJLEdBQTRCLElBQUksQ0FBQztRQTlGbkMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLEVBQUU7WUFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQTJCLENBQUM7WUFDbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckI7YUFDSTtZQUNILElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFdBQVcsRUFBRSxPQUFPO2dCQUNwQixPQUFPLEVBQUUscUJBQXFCLEdBQUcsSUFBSSxHQUFHLElBQUk7YUFDN0MsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO1lBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7WUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztJQVFELE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FJYjtRQUNDLElBQUksT0FBTyxPQUFPLElBQUksUUFBUTtZQUFFLE9BQU8sR0FBRztnQkFDeEMsT0FBTyxFQUFFLE9BQU87YUFDakIsQ0FBQTtRQUNELElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDdEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxXQUFXLENBQ3hCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLE1BQU0sT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLFdBQVcsSUFBSSxNQUFNLE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUNySixDQUFDO1FBR0YsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxRQUFRO1FBQ04sT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLE1BQU0sSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNyRixDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNO1FBQ0osU0FBUyxVQUFVLENBQUMsSUFBWTtZQUM5QixPQUFPLElBQUk7aUJBQ1YsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7aUJBQ3RCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO2lCQUNyQixPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztpQkFDckIsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7aUJBQ3ZCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUVBLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDdkM7UUFBQSxDQUFDO1FBRUYsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixRQUFRLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDeEIsS0FBSyxNQUFNO2dCQUNULEtBQUssR0FBRyxRQUFRLENBQUM7Z0JBQ2pCLE1BQU07WUFFUixLQUFLLE9BQU87Z0JBQ1YsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDZCxNQUFNO1lBRVIsS0FBSyxRQUFRO2dCQUNYLEtBQUssR0FBRyxXQUFXLENBQUM7Z0JBQ3BCLE1BQU07U0FDVDtRQUNELEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNyTCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7Q0FVRjtBQWpHRCxrQ0FpR0MifQ==