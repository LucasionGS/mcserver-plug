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
const fs = __importStar(require("fs"));
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
    if (!fs.existsSync(IonMC.ionmcDir)) {
        fs.mkdirSync(IonMC.ionmcDir);
    }
    if (!fs.existsSync(IonMC.globalServersPath)) {
        fs.mkdirSync(IonMC.globalServersPath);
    }
})(IonMC || (IonMC = {}));
let packageJson;
try {
    packageJson = JSON.parse(fs.readFileSync((0, path_1.resolve)(__dirname, "../package.json"), "utf8"));
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
                if (fs.existsSync(fullPath)) {
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
                fs.mkdirSync(fullPath, { recursive: true });
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
                if (fs.existsSync(object)) { }
                else if (fs.existsSync((0, path_1.resolve)(IonMC.globalServersPath, object))) {
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
                    if (fs.existsSync(jsPath)) {
                        object = jsPath;
                        objectType = "js";
                    }
                    else if (fs.existsSync(jarPath)) {
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
                    let server = new __1.Server(object);
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
                if (!fs.existsSync(object)) {
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
                    if (fs.existsSync(jsPath)) {
                        object = jsPath;
                        objectType = "js";
                    }
                    else if (fs.existsSync(jarPath)) {
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
                if (!fs.existsSync(fullPath)) {
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
                fs.mkdirSync(fullPath, { recursive: true });
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
                let globalFiles = fs.readdirSync(IonMC.globalServersPath);
                console.log("Global servers:");
                for (let i = 0; i < globalFiles.length; i++) {
                    const file = globalFiles[i];
                    if (fs.existsSync((0, path_1.resolve)(IonMC.globalServersPath, file, "server.jar")) || fs.existsSync((0, path_1.resolve)(IonMC.globalServersPath, file, "server.js"))) {
                        console.log("  @" + file);
                    }
                }
                let files = fs.readdirSync("./");
                console.log("\nServers in this directory:");
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (fs.existsSync((0, path_1.resolve)(file, "server.jar")) || fs.existsSync((0, path_1.resolve)(file, "server.js"))) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsMEJBQWlDO0FBQ2pDLDZEQUFrQztBQUNsQyx1Q0FBeUI7QUFDekIsK0JBQWtEO0FBQ2xELHdEQUE4QztBQUM5Qyw4REFBNkI7QUFDN0IsMkJBQThCO0FBRTlCLElBQVUsS0FBSyxDQW1CZDtBQW5CRCxXQUFVLEtBQUs7SUFDYixJQUFJLEVBQUUsR0FBRyxJQUFBLGFBQVEsR0FBRSxDQUFDO0lBQ3BCLElBQUksSUFBSSxHQUNOLEVBQUUsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUQsRUFBRSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxLQUFLLENBQUM7SUFDWixJQUFJLElBQUksS0FBSyxLQUFLLEVBQUU7UUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRkFBa0YsQ0FBQyxDQUFDO0tBQ3JHO0lBRVksY0FBUSxHQUFHLElBQUEsY0FBTyxFQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsaUJBQWlCLEdBQUcsSUFBQSxjQUFPLEVBQUMsTUFBQSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdkQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBQSxRQUFRLENBQUMsRUFBRTtRQUM1QixFQUFFLENBQUMsU0FBUyxDQUFDLE1BQUEsUUFBUSxDQUFDLENBQUM7S0FDeEI7SUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRTtRQUMzQyxFQUFFLENBQUMsU0FBUyxDQUFDLEtB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