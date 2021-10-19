#!/usr/bin/env node
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const IonUtil_1 = __importDefault(require("../lib/IonUtil"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const Configuration_1 = require("../lib/Configuration");
const symlink_dir_1 = __importDefault(require("symlink-dir"));
const os_1 = require("os");
var IonMC;
(function (IonMC) {
    let pf = (0, os_1.platform)();
    let path = pf == "win32" ? process.env.HOMEDRIVE + process.env.HOMEPATH :
        pf == "linux" ? process.env.HOME :
            false;
    if (path === false) {
        throw new Error("Unsupported system for CLI. Supported systems are Windows and Linux for the CLI.");
    }
    IonMC.ionmcDir = (0, path_1.resolve)(path, ".ionmc");
    IonMC.globalServersPath = (0, path_1.resolve)(IonMC.ionmcDir, "servers");
    if (!fs_1.default.existsSync(IonMC.ionmcDir)) {
        fs_1.default.mkdirSync(IonMC.ionmcDir);
    }
    if (!fs_1.default.existsSync(IonMC.globalServersPath)) {
        fs_1.default.mkdirSync(IonMC.globalServersPath);
    }
})(IonMC || (IonMC = {}));
let packageJson;
try {
    packageJson = JSON.parse(fs_1.default.readFileSync((0, path_1.resolve)(__dirname, "../package.json"), "utf8"));
}
catch (error) {
    packageJson = {
        displayName: "IonMC",
        version: (_a = process.version) !== null && _a !== void 0 ? _a : "Undeterminable"
    };
}
let [operator, object, version, ...rest] = process.argv.slice(2);
// Operator Aliases
switch (operator) {
    case "run":
        operator = "start";
        break;
    case "up":
        operator = "update";
        break;
    case "ls":
        operator = "list";
        break;
    default:
        break;
}
(function command() {
    return __awaiter(this, void 0, void 0, function* () {
        if (operator) {
            if (operator == "download") {
                if (!object) {
                    return help();
                }
                if (object.startsWith("@")) {
                    if (!version)
                        version = object.substring(1);
                    object = (0, path_1.resolve)(IonMC.globalServersPath, object.substring(1));
                }
                else {
                    if (!version)
                        version = object;
                }
                let fullPath = (0, path_1.resolve)(object);
                if (fs_1.default.existsSync(fullPath)) {
                    return console.log(`Path "${fullPath}" already exists`);
                }
                let serverVersion = yield __1.Api.getVersions()
                    .then(res => {
                    switch (version) {
                        case "latest":
                        case "l":
                            return res.versions.find(v => v.id == res.latest.release);
                        case "latest-snapshot":
                        case "ls":
                            return res.versions.find(v => v.id == res.latest.snapshot);
                        default:
                            return res.versions.find(v => v.id == version);
                    }
                });
                if (!serverVersion) {
                    return console.log(`Error: Unable to find version "${version}"`);
                }
                fs_1.default.mkdirSync(fullPath, { recursive: true });
                console.clear();
                __1.Api.downloadServer(__1.Api.getRelease(serverVersion), fullPath, "server").then(dl => {
                    dl.on("data", (_, r, t) => {
                        let received = new IonUtil_1.default.Byte(r);
                        let total = new IonUtil_1.default.Byte(t);
                        process.stdout.cursorTo(0, 0);
                        console.log(`Downloading ${serverVersion.id}... ${dl.downloadPercentage.toFixed(2)}%          `
                            + `\n${received.toAutoString()}/${total.toAutoString()}                 `);
                    });
                    dl.on("finish", () => {
                        console.log("Finished download.\n", "Start the using command `ionmc start` in the directory.\n");
                        Configuration_1.Config.init(fullPath, serverVersion.id);
                    });
                });
            }
            else if (operator == "start") {
                object || (object = "./");
                let objectType;
                if (object.startsWith("@")) {
                    object = (0, path_1.resolve)(IonMC.globalServersPath, object.substring(1));
                }
                if (fs_1.default.existsSync(object)) { }
                else if (fs_1.default.existsSync((0, path_1.resolve)(IonMC.globalServersPath, object))) {
                    object = (0, path_1.resolve)(IonMC.globalServersPath, object);
                }
                else {
                    return console.log("Given path does not exist.");
                }
                if (object.endsWith(".js"))
                    objectType = "js";
                else if (object.endsWith(".jar"))
                    objectType = "jar";
                else
                    objectType = "dir";
                let config = Configuration_1.Config.load(object);
                if (objectType == "dir") {
                    let jarPath = (0, path_1.resolve)(object, "server.jar");
                    let jsPath = (0, path_1.resolve)(object, "server.js");
                    if (fs_1.default.existsSync(jsPath)) {
                        object = jsPath;
                        objectType = "js";
                    }
                    else if (fs_1.default.existsSync(jarPath)) {
                        object = jarPath;
                        objectType = "jar";
                    }
                    else {
                        return console.log(`This directory doesn't contain a server.js or server.jar`);
                    }
                }
                if (objectType == "js") {
                    process.chdir((0, path_1.dirname)(object));
                    Promise.resolve().then(() => __importStar(require(object)));
                }
                else if (objectType == "jar") {
                    let server = new __1.Server(object, true, config);
                    server.start();
                    server.on("data", server.write);
                    server.on("stopped", () => {
                        console.log("Server has been stopped. Exiting...");
                        process.exit();
                    });
                }
            }
            else if (operator == "setglobal") {
                object || (object = "./");
                let objectType;
                if (!fs_1.default.existsSync(object)) {
                    return console.log("Given path does not exist.");
                }
                if (object.endsWith(".js"))
                    objectType = "js";
                else if (object.endsWith(".jar"))
                    objectType = "jar";
                else
                    objectType = "dir";
                if (objectType == "dir") {
                    let jarPath = (0, path_1.resolve)(object, "server.jar");
                    let jsPath = (0, path_1.resolve)(object, "server.js");
                    if (fs_1.default.existsSync(jsPath)) {
                        object = jsPath;
                        objectType = "js";
                    }
                    else if (fs_1.default.existsSync(jarPath)) {
                        object = jarPath;
                        objectType = "jar";
                    }
                    else {
                        return console.log(`This directory doesn't contain a server.js or server.jar`);
                    }
                }
                let lnkName = (0, path_1.basename)((0, path_1.dirname)(object));
                if (version == "as") {
                    if (rest[0]) {
                        lnkName = rest[0].replace(/\//g, "_");
                    }
                    else {
                        return console.error("Error: Expected name after \"as\"");
                    }
                }
                (0, symlink_dir_1.default)((0, path_1.dirname)(object), (0, path_1.resolve)(IonMC.globalServersPath, lnkName));
            }
            else if (operator == "update") {
                if (!object) {
                    return help();
                }
                if (object.startsWith("@")) {
                    if (!version)
                        version = object.substring(1);
                    object = (0, path_1.resolve)(IonMC.globalServersPath, object.substring(1));
                }
                else {
                    if (!version)
                        version = object;
                }
                let fullPath = (0, path_1.resolve)(object);
                if (!fs_1.default.existsSync(fullPath)) {
                    return console.log(`Path "${fullPath}" doesn't exists`);
                }
                let serverVersion = yield __1.Api.getVersions()
                    .then(res => {
                    switch (version) {
                        case "latest":
                        case "l":
                            return res.versions.find(v => v.id == res.latest.release);
                        case "latest-snapshot":
                        case "ls":
                            return res.versions.find(v => v.id == res.latest.snapshot);
                        default:
                            return res.versions.find(v => v.id == version);
                    }
                });
                if (!serverVersion) {
                    return console.log(`Error: Unable to find version "${version}"`);
                }
                fs_1.default.mkdirSync(fullPath, { recursive: true });
                console.clear();
                __1.Api.downloadServer(__1.Api.getRelease(serverVersion), fullPath, "server").then(dl => {
                    dl.on("data", (_, r, t) => {
                        let received = new IonUtil_1.default.Byte(r);
                        let total = new IonUtil_1.default.Byte(t);
                        process.stdout.cursorTo(0, 0);
                        console.log(`Downloading ${serverVersion.id}... ${dl.downloadPercentage.toFixed(2)}%          `
                            + `\n${received.toAutoString()}/${total.toAutoString()}                 `);
                    });
                    dl.on("finish", () => {
                        console.log("Finished updating to version " + serverVersion.id + ".\n");
                    });
                });
            }
            else if (operator == "versions") {
                __1.Api.getVersions().then(versions => {
                    let versionsText = versions.versions.map(v => v.id + " - " + v.type
                        + (versions.latest.release == v.id ? " (Latest Release)" : versions.latest.snapshot == v.id ? " (Latest Snapshot)" : "")).reverse().join("\n");
                    console.log(versionsText);
                });
            }
            else if (operator == "version") {
                console.log(packageJson.displayName
                    + "\nVersion " + packageJson.version);
            }
            else if (operator == "init") {
                if (!version) {
                    return help();
                }
                Configuration_1.Config.init(object, version);
            }
            else if (operator == "list") {
                let globalFiles = fs_1.default.readdirSync(IonMC.globalServersPath);
                console.log("Global servers:");
                for (let i = 0; i < globalFiles.length; i++) {
                    const file = globalFiles[i];
                    if (fs_1.default.existsSync((0, path_1.resolve)(IonMC.globalServersPath, file, "server.jar")) || fs_1.default.existsSync((0, path_1.resolve)(IonMC.globalServersPath, file, "server.js"))) {
                        console.log("  @" + file);
                    }
                }
                let files = fs_1.default.readdirSync("./");
                console.log("\nServers in this directory:");
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (fs_1.default.existsSync((0, path_1.resolve)(file, "server.jar")) || fs_1.default.existsSync((0, path_1.resolve)(file, "server.js"))) {
                        console.log("  " + file);
                    }
                }
            }
            else {
                return help();
            }
        }
        else {
            return help();
        }
    });
})();
function help() {
    console.log(`
${packageJson.displayName} CLI.
  Usage:
    ionmc - Display help
    ionmc download [@]<server name> <version> - Download a server with as specific minecraft version
    ionmc download [@]<server name> latest | latest-snapshot - Download a server with the latest release or snapshot

    ionmc update [@]<server name> <version> - Update a server to a specific minecraft version
    ionmc update [@]<server name> latest | latest-snapshot - Update a server to a latest release or snapshot

    ionmc list - Show the list of global and current directory servers.
    ionmc setglobal <server name> - Add a server to the global server list.
                                    All global servers can be accessed via @
                                    and the name of the server from any directory.

    ionmc start [[@][ <path to directory> | <path to jar> | <path to server.js> ]] - Start a server.

    Explainations:
    [@] means using creating/using a global server.
    Global servers are installed in "${IonMC.globalServersPath}".
    They can be accessed from any directory by adding @ in front of the server name.
    Downloading a global server example: ionmc download "@My Server" latest
    Starting a global server example: ionmc start "@My Server"

    If a server name is not found in the current directory, but does exist in the global server folder,
    it will open the global server even without using "@".
`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsMEJBQWlDO0FBQ2pDLDZEQUFrQztBQUNsQyw0Q0FBb0I7QUFDcEIsK0JBQWtEO0FBQ2xELHdEQUE4QztBQUM5Qyw4REFBNkI7QUFDN0IsMkJBQThCO0FBRTlCLElBQVUsS0FBSyxDQWtCZDtBQWxCRCxXQUFVLEtBQUs7SUFDYixJQUFJLEVBQUUsR0FBRyxJQUFBLGFBQVEsR0FBRSxDQUFDO0lBQ3BCLElBQUksSUFBSSxHQUNOLEVBQUUsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUQsRUFBRSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxLQUFLLENBQUM7SUFDWixJQUFJLElBQUksS0FBSyxLQUFLLEVBQUU7UUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRkFBa0YsQ0FBQyxDQUFDO0tBQ3JHO0lBQ1ksY0FBUSxHQUFHLElBQUEsY0FBTyxFQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNuQyx1QkFBaUIsR0FBRyxJQUFBLGNBQU8sRUFBQyxNQUFBLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM5RCxJQUFJLENBQUMsWUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFBLFFBQVEsQ0FBQyxFQUFFO1FBQzVCLFlBQUUsQ0FBQyxTQUFTLENBQUMsTUFBQSxRQUFRLENBQUMsQ0FBQztLQUN4QjtJQUNELElBQUksQ0FBQyxZQUFFLENBQUMsVUFBVSxDQUFDLE1BQUEsaUJBQWlCLENBQUMsRUFBRTtRQUNyQyxZQUFFLENBQUMsU0FBUyxDQUFDLE1BQUEsaUJBQWlCLENBQUMs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