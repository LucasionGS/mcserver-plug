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
            false;
    if (path === false) {
        throw new Error("Unsupported system for CLI. Supported systems are Windows and Linux for the CLI.");
    }
    IonMC.ionmcDir = path_1.resolve(path, ".ionmc");
    IonMC.globalServersPath = path_1.resolve(IonMC.ionmcDir, "servers");
    if (!fs.existsSync(IonMC.ionmcDir)) {
        fs.mkdirSync(IonMC.ionmcDir);
    }
    if (!fs.existsSync(IonMC.globalServersPath)) {
        fs.mkdirSync(IonMC.globalServersPath);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSwwQkFBaUM7QUFDakMsNkRBQWtDO0FBQ2xDLHVDQUF5QjtBQUN6QiwrQkFBa0Q7QUFDbEQsd0RBQThDO0FBQzlDLDhEQUE2QjtBQUM3QiwyQkFBOEI7QUFFOUIsSUFBVSxLQUFLLENBbUJkO0FBbkJELFdBQVUsS0FBSztJQUNiLElBQUksRUFBRSxHQUFHLGFBQVEsRUFBRSxDQUFDO0lBQ3BCLElBQUksSUFBSSxHQUNSLEVBQUUsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUQsRUFBRSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxLQUFLLENBQUM7SUFDTixJQUFJLElBQUksS0FBSyxLQUFLLEVBQUU7UUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRkFBa0YsQ0FBQyxDQUFDO0tBQ3JHO0lBRVksY0FBUSxHQUFHLGNBQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGlCQUFpQixHQUFHLGNBQU8sQ0FBQyxNQUFBLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN2RCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFBLFFBQVEsQ0FBQyxFQUFFO1FBQzVCLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBQSxRQUFRLENBQUMsQ0FBQztLQUN4QjtJQUNELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO1FBQzNDLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGlCQUFpQixD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