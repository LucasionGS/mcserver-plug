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
const readline = __importStar(require("readline"));
const Configuration_1 = require("./Configuration");
class Server extends events_1.EventEmitter {
    constructor(serverJarPath = "server.jar", preventStartup = false, config) {
        super();
        this.ready = false;
        this.userList = [];
        this.xms = "2048M";
        this.xmx = "2048M";
        this.java = "java";
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
        if (!config)
            config = Configuration_1.Config.load(Path.dirname(Path.resolve(serverJarPath)));
        if (config) {
            if (config.serverConfig.xms)
                this.xms = config.serverConfig.xms;
            if (config.serverConfig.xmx)
                this.xmx = config.serverConfig.xmx;
            if (config.serverConfig.java)
                this.java = config.serverConfig.java;
        }
        this.config = config;
        if (preventStartup !== true)
            this.start();
    }
    write(data) {
        this.emit("write", data);
        if (data instanceof ConsoleInfo)
            data = data.toString();
        else if (typeof data == "object")
            data = JSON.stringify(data, null, 2);
        process.stdout.write(data + "\n");
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
        var _a;
        const stdoutName = ((_a = this.config) === null || _a === void 0 ? void 0 : _a.serverConfig.useStderr) ? "stderr" : "stdout";
        this.write("Starting server...");
        let proc = cp.spawn(this.java, [
            `-Xmx${this.xmx}`,
            `-Xms${this.xms}`,
            "-jar",
            this.fileName,
            "nogui" // Makes it CMD specific
        ], {
            cwd: this.directoryPath
        });
        const onOutput = (chk) => {
            const data = chk.toString().replace(/\r?\n|\s$/, "");
            if (data == ">" || data == "")
                return;
            // fs.appendFileSync("/home/ion/development/ionmc/log", "<<Start: " + data + " :End>>\n");
            let info = new ConsoleInfo(data);
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
        };
        // Due to older minecraft versions for some reason using stderr as their stdout, this needs to be an option.
        proc[stdoutName].on("data", onOutput);
        proc[stdoutName].on("error", console.error);
        proc[stdoutName].on("end", () => this.emit("stopped"));
        // Open access to terminal.
        if (this.process != null)
            this.process.kill("SIGKILL");
        this.process = proc;
        process.openStdin();
        this.terminal = readline.createInterface(process.stdin, process.stdout);
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
        let m = (data).match(/\[?(\d+:\d+:\d+)\]?\s+\[(?:(.*?)\/)?(.*?)\]:?\s+(.*)/);
        if (m) {
            this.timeStamp = m[1];
            this.sender = m[2] || "Server";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0Isa0RBQW9DO0FBQ3BDLHVDQUF5QjtBQUN6QixtQ0FBc0M7QUFDdEMsd0RBQTZCO0FBQzdCLGlDQUE4QjtBQUM5QixtREFBcUM7QUFFckMsbURBQXlDO0FBRXpDLE1BQWEsTUFBTyxTQUFRLHFCQUFZO0lBY3RDLFlBQVksZ0JBQXdCLFlBQVksRUFBRSxpQkFBMEIsS0FBSyxFQUFFLE1BQWU7UUFDaEcsS0FBSyxFQUFFLENBQUM7UUEwQ1YsVUFBSyxHQUFZLEtBQUssQ0FBQztRQXVHaEIsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQWFyQixRQUFHLEdBQUcsT0FBTyxDQUFDO1FBQ2QsUUFBRyxHQUFHLE9BQU8sQ0FBQztRQUVkLFNBQUksR0FBRyxNQUFNLENBQUM7UUFxR3RCLFlBQU8sR0FBb0IsSUFBSSxDQUFDO1FBRWhDLGFBQVEsR0FBRztZQUNULElBQUksRUFBRSxHQUFTLEVBQUU7Z0JBQ2YsSUFBSSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7Z0JBQ2pGLElBQUksQ0FBQyxJQUFJLEdBQUc7b0JBQ1YsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDZCxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNsQixDQUFBO2dCQUNELE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQyxDQUFBO1lBQ0QsT0FBTyxFQUFFLENBQU8sSUFBWSxFQUFFLEVBQUU7Z0JBQzlCLElBQUksSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFZ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