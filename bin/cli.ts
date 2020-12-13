#!/usr/bin/env node

import { Api, Server } from "..";
import util from "../lib/IonUtil";
import * as fs from "fs";
import { basename, dirname, resolve } from "path";
import { Config } from "../lib/Configuration";
import ln from "symlink-dir";

namespace IonMC {
  export var globalServersPath: string;
  export const ionmcDir = resolve((process.env.HOMEDRIVE || "") + process.env.HOMEPATH, ".ionmc");
  if (fs.existsSync(ionmcDir)) {
    IonMC.globalServersPath = resolve(ionmcDir, "servers");
    !fs.existsSync(IonMC.globalServersPath) && fs.mkdirSync(IonMC.globalServersPath);
  }
  else {
    fs.mkdirSync(ionmcDir);
  }
}

try {
  var packageJson: PackageJson = JSON.parse(fs.readFileSync(resolve(__dirname, "../package.json"), "utf8"));
} catch (error) {
  var packageJson: PackageJson = {
    displayName: "IonMC",
    version: "Undeterminable"
  };
}

interface PackageJson {
  displayName: string;
  version: string;
}

var [
  operator,
  object,
  version,
  extra1,
]: [
  "download"
  | "start" | "run"
  | "update" | "up"
  | "versions"
  | "version"
  | "init"
  | "list" | "ls"
  | "setglobal",
  ...string[]
] = process.argv.slice(2) as any;

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

(async function command() {
  if (operator) {
    if (operator == "download") {
      if (!object) {
        return help();
      }
      if (object.startsWith("@")) {
        if (!version) version = object.substring(1);
        object = resolve(IonMC.globalServersPath, object.substring(1));
      }
      else {
        if (!version) version = object;
      }

      let fullPath = resolve(object);
      if (fs.existsSync(fullPath)) {
        return console.log(`Path "${fullPath}" already exists`);
      }
      let serverVersion = await Api.getVersions()
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

      fs.mkdirSync(fullPath, {recursive: true});
      console.clear();
      Api.downloadServer(
        Api.getRelease(
          serverVersion
        ), fullPath, "server").then(dl => {
        dl.on("data", (_, r, t) => {
          let received = new util.Byte(r);
          let total = new util.Byte(t);
          process.stdout.cursorTo(0, 0);
          console.log(`Downloading ${serverVersion.id}... ${dl.downloadPercentage.toFixed(2)}%          `
          + `\n${received.toAutoString()}/${total.toAutoString()}                 `);
        });
      
        dl.on("finish", () => {
          console.log(
            "Finished download.\n",
            "Start the using command `ionmc start` in the directory.\n"
          );
          Config.init(fullPath, serverVersion.id);
        });
      });
    }
    else if (operator == "start") {
      object || (object = "./");
      let objectType: "js" | "jar" | "dir";
      if (object.startsWith("@")) {
        object = resolve(IonMC.globalServersPath, object.substring(1));
      }

      if (fs.existsSync(object)) { }
      else if (fs.existsSync(resolve(IonMC.globalServersPath, object))) {
        object = resolve(IonMC.globalServersPath, object);
      }
      else {
        return console.log("Given path does not exist.");
      }

      if (object.endsWith(".js")) objectType = "js";
      else if (object.endsWith(".jar")) objectType = "jar";
      else objectType = "dir";

      let config = Config.load(object);
      if (objectType == "dir") {
        let jarPath = resolve(object, "server.jar");
        let jsPath = resolve(object, "server.js");
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
        process.chdir(dirname(object));
        import(object);
      }
      else if (objectType == "jar") {
        let server = new Server(object);
        server.on("data", server.write);
        server.on("stopped", () => {
          console.log("Server has been stopped. Exiting...");
          process.exit();
        });
      }
    }
    else if (operator == "setglobal") {
      object || (object = "./");
      let objectType: "js" | "jar" | "dir";

      if (!fs.existsSync(object)) {
        return console.log("Given path does not exist.");
      }

      if (object.endsWith(".js")) objectType = "js";
      else if (object.endsWith(".jar")) objectType = "jar";
      else objectType = "dir";

      if (objectType == "dir") {
        let jarPath = resolve(object, "server.jar");
        let jsPath = resolve(object, "server.js");
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

      let lnkName = basename(dirname(object));
      if (version == "as") {
        if (extra1) {
          lnkName = extra1.replace(/\//g, "_");
        }
        else {
          return console.error("Error: Expected name after \"as\"");
        }
      }
      
      ln(
        dirname(object), resolve(IonMC.globalServersPath, lnkName)
      );
    }
    else if (operator == "update") {
      if (!object) {
        return help();
      }
      if (object.startsWith("@")) {
        if (!version) version = object.substring(1);
        object = resolve(IonMC.globalServersPath, object.substring(1));
      }
      else {
        if (!version) version = object;
      }

      let fullPath = resolve(object);
      if (!fs.existsSync(fullPath)) {
        return console.log(`Path "${fullPath}" doesn't exists`);
      }
      let serverVersion = await Api.getVersions()
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

      fs.mkdirSync(fullPath, {recursive: true});
      console.clear();
      Api.downloadServer(
        Api.getRelease(
          serverVersion
        ), fullPath, "server").then(dl => {
        dl.on("data", (_, r, t) => {
          let received = new util.Byte(r);
          let total = new util.Byte(t);
          process.stdout.cursorTo(0, 0);
          console.log(`Downloading ${serverVersion.id}... ${dl.downloadPercentage.toFixed(2)}%          `
          + `\n${received.toAutoString()}/${total.toAutoString()}                 `);
        });
      
        dl.on("finish", () => {
          console.log("Finished updating to version "+ serverVersion.id +".\n");
        });
      });
    }
    else if (operator == "versions") {
      Api.getVersions().then(versions => {
        let versionsText = versions.versions.map(
          v => v.id + " - " + v.type
          + (versions.latest.release == v.id ? " (Latest Release)" : versions.latest.snapshot == v.id ? " (Latest Snapshot)" : "")
        ).reverse().join("\n");

        console.log(versionsText);
      });
    }
    else if (operator == "version") {
      console.log(
        packageJson.displayName
        + "\nVersion " + packageJson.version
      );
    }
    else if (operator == "init") {
      if (!version) {
        return help();
      }
      Config.init(object, version);
    }
    else if (operator == "list") {
      let globalFiles = fs.readdirSync(IonMC.globalServersPath);
      console.log("Global servers:");
      for (let i = 0; i < globalFiles.length; i++) {
        const file = globalFiles[i];
        if (fs.existsSync(resolve(IonMC.globalServersPath, file, "server.jar")) || fs.existsSync(resolve(IonMC.globalServersPath, file, "server.js"))) {
          console.log("  @" + file);
        }
      }
      
      let files = fs.readdirSync("./");
      console.log("\nServers in this directory:");
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (fs.existsSync(resolve(file, "server.jar")) || fs.existsSync(resolve(file, "server.js"))) {
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
    ionmc setglobal - Add a server to the global server list.
                      All global servers can be accessed via @ and the name of the server from any directory.

    ionmc start [[@][ <path to directory> | <path to jar> | <path to server.js> ]] - Start a server.

    Explainations:
    [@] means using creating/using a global server. Global servers are installed in "${IonMC.globalServersPath}".
    They can be accessed from any directory by adding @ in front of the server name.
    Downloading a global server example: ionmc download "@My Server" latest
    Starting a global server example: ionmc start "@My Server"

    If a server name is not found in the current directory, but DOES exist in the global server folder,
    it will open the global server even without using "@".
`);
}
