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
    let pf = os_1.platform();
    let path = pf == "win32" ? process.env.HOMEDRIVE + process.env.HOMEPATH :
        pf == "linux" ? process.env.HOME :
            "";
    IonMC.ionmcDir = path_1.resolve(path, ".ionmc");
    if (fs.existsSync(IonMC.ionmcDir)) {
        IonMC.globalServersPath = path_1.resolve(IonMC.ionmcDir, "servers");
        !fs.existsSync(IonMC.globalServersPath) && fs.mkdirSync(IonMC.globalServersPath);
    }
    else {
        fs.mkdirSync(IonMC.ionmcDir);
    }
})(IonMC || (IonMC = {}));
try {
    var packageJson = JSON.parse(fs.readFileSync(path_1.resolve(__dirname, "../package.json"), "utf8"));
}
catch (error) {
    var packageJson = {
        displayName: "IonMC",
        version: "Undeterminable"
    };
}
var [operator, object, version, extra1,] = process.argv.slice(2);
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
                    object = path_1.resolve(IonMC.globalServersPath, object.substring(1));
                }
                else {
                    if (!version)
                        version = object;
                }
                let fullPath = path_1.resolve(object);
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
                    object = path_1.resolve(IonMC.globalServersPath, object.substring(1));
                }
                if (fs.existsSync(object)) { }
                else if (fs.existsSync(path_1.resolve(IonMC.globalServersPath, object))) {
                    object = path_1.resolve(IonMC.globalServersPath, object);
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
                    let jarPath = path_1.resolve(object, "server.jar");
                    let jsPath = path_1.resolve(object, "server.js");
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
                    process.chdir(path_1.dirname(object));
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
                    let jarPath = path_1.resolve(object, "server.jar");
                    let jsPath = path_1.resolve(object, "server.js");
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
                let lnkName = path_1.basename(path_1.dirname(object));
                if (version == "as") {
                    if (extra1) {
                        lnkName = extra1.replace(/\//g, "_");
                    }
                    else {
                        return console.error("Error: Expected name after \"as\"");
                    }
                }
                symlink_dir_1.default(path_1.dirname(object), path_1.resolve(IonMC.globalServersPath, lnkName));
            }
            else if (operator == "update") {
                if (!object) {
                    return help();
                }
                if (object.startsWith("@")) {
                    if (!version)
                        version = object.substring(1);
                    object = path_1.resolve(IonMC.globalServersPath, object.substring(1));
                }
                else {
                    if (!version)
                        version = object;
                }
                let fullPath = path_1.resolve(object);
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
                    if (fs.existsSync(path_1.resolve(IonMC.globalServersPath, file, "server.jar")) || fs.existsSync(path_1.resolve(IonMC.globalServersPath, file, "server.js"))) {
                        console.log("  @" + file);
                    }
                }
                let files = fs.readdirSync("./");
                console.log("\nServers in this directory:");
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (fs.existsSync(path_1.resolve(file, "server.jar")) || fs.existsSync(path_1.resolve(file, "server.js"))) {
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
