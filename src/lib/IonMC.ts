import { Api, Server } from "..";
import util from "./IonUtil";
import fs from "fs";
import Path, { basename, dirname } from "path";
import { Config } from "./Configuration";
import ln from "symlink-dir";
import { platform } from "os";
import InterfaceConfiguration from "./InterfaceConfiguration";

/**
 * Interact with the IonMC CLI commands.
 */
namespace IonMC {
  let pf = platform();
  let path = pf == "win32" ? process.env.HOMEDRIVE + process.env.HOMEPATH :
    pf == "linux" ? process.env.HOME :
      false;
  if (path === false) {
    throw new Error("Unsupported system for CLI. Supported systems are Windows and Linux for the CLI.");
  }
  export const ionmcDir = Path.resolve(path, ".ionmc");
  export const globalServersPath = Path.resolve(ionmcDir, "servers");
  export const interfaceConfigPath = Path.resolve(ionmcDir, "interface.json");
  if (!fs.existsSync(ionmcDir)) {
    fs.mkdirSync(ionmcDir);
  }
  if (!fs.existsSync(globalServersPath)) {
    fs.mkdirSync(globalServersPath);
  }
  if (!fs.existsSync(interfaceConfigPath)) {
    fs.writeFileSync(interfaceConfigPath, JSON.stringify(<InterfaceConfiguration>{
      users: {}
    }, null, 2));
  }

  export function getInterfaceConfig(): InterfaceConfiguration {
    let config = JSON.parse(fs.readFileSync(interfaceConfigPath, "utf8"));
    return InterfaceConfiguration.init(config);
  }

  async function exists(path: string) {
    return new Promise<boolean>((resolve, reject) => {
      fs.stat(path, (err, stat) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  interface ServerList {
    global: string[],
    local: string[]
  }
  
  export async function listServers(): Promise<ServerList>;
  /** @deprecated */export async function listServers(log: (...data: any[]) => void): Promise<ServerList>;
  export async function listServers(log: (...data: any[]) => void = console.log) {
    const data: ServerList = {
      global: [],
      local: []
    };
    let globalFiles = await fs.promises.readdir(IonMC.globalServersPath);
    for (let i = 0; i < globalFiles.length; i++) {
      const file = globalFiles[i];
      if (await exists(Path.resolve(IonMC.globalServersPath, file, "server.jar")) || await exists(Path.resolve(IonMC.globalServersPath, file, "server.js"))) {
        data.global.push(file);
      }
    }

    let files = await fs.promises.readdir("./");
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (await exists(Path.resolve(file, "server.jar")) || await exists(Path.resolve(file, "server.js"))) {
        data.local.push(file);
      }
    }
    return data;
  }

  let packageJson: PackageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(Path.resolve(__dirname, "../package.json"), "utf8"));
  } catch (error) {
    packageJson = {
      displayName: "IonMC",
      version: process.version ?? "Undeterminable"
    };
  }

  interface PackageJson {
    displayName: string;
    version: string;
  }

  export async function executeCLI(args: string[]) {
    let [
      operator, object, version, ...rest
    ]: [
        "server" | "download" | "start" | "run" | "update" | "up" | "versions" | "version" | "init" | "list" | "ls" | "setglobal",
        ...string[]
      ] = args as any;

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
        if (operator == "server") {
          return import("./Interface");
        }
        else if (operator == "download") {
          if (!object) {
            return help();
          }
          if (object.startsWith("@")) {
            if (!version)
              version = object.substring(1);
            object = Path.resolve(IonMC.globalServersPath, object.substring(1));
          }
          else {
            if (!version)
              version = object;
          }

          let fullPath = Path.resolve(object);
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

          fs.mkdirSync(fullPath, { recursive: true });
          Api.downloadServer(
            Api.getRelease(
              serverVersion
            ), fullPath, "server").then(dl => {
              dl.on("data", (_, r, t) => {
                let received = new util.Byte(r);
                let total = new util.Byte(t);
                console.log(`Downloading ${serverVersion.id}... ${dl.downloadPercentage.toFixed(2)}%          `
                  + `\n${received.toAutoString()}/${total.toAutoString()}                 `);
                process.stdout.moveCursor(0, -2);
              });

              dl.on("finish", () => {

                console.log(
                  "\n\n\nFinished download.\n" +
                  "\tStart the using command `ionmc start` in the directory.\n"
                );
                fs.writeFileSync(Path.resolve(fullPath, "eula.txt"), "eula=true\n");
                Config.init(fullPath, serverVersion.id);
              });
            });
        }
        else if (operator == "start") {
          object || (object = "./");
          let objectType: "js" | "jar" | "dir";
          if (object.startsWith("@")) {
            object = Path.resolve(IonMC.globalServersPath, object.substring(1));
          }

          if (fs.existsSync(object)) { }
          else if (fs.existsSync(Path.resolve(IonMC.globalServersPath, object))) {
            object = Path.resolve(IonMC.globalServersPath, object);
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

          let config = Config.load(object);

          if (objectType == "dir") {
            let jarPath = Path.resolve(object, "server.jar");
            let jsPath = Path.resolve(object, "server.js");
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
            let server = new Server(object, {
              preventStart: true,
            }, config);
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
          let objectType: "js" | "jar" | "dir";

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
            let jarPath = Path.resolve(object, "server.jar");
            let jsPath = Path.resolve(object, "server.js");
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
            if (rest[0]) {
              lnkName = rest[0].replace(/\//g, "_");
            }
            else {
              return console.error("Error: Expected name after \"as\"");
            }
          }

          ln(
            dirname(object), Path.resolve(IonMC.globalServersPath, lnkName)
          );
        }
        else if (operator == "update") {
          if (!object) {
            return help();
          }
          if (object.startsWith("@")) {
            if (!version)
              version = object.substring(1);
            object = Path.resolve(IonMC.globalServersPath, object.substring(1));
          }
          else {
            if (!version)
              version = object;
          }

          let fullPath = Path.resolve(object);
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

          fs.mkdirSync(fullPath, { recursive: true });
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
                console.log("Finished updating to version " + serverVersion.id + ".\n");
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
          const data = await IonMC.listServers();
          console.log("Global servers:");
          for (let i = 0; i < data.global.length; i++) {
            const file = data.global[i];
            console.log("  @" + file);
          }
      
          console.log("\nServers in this directory:");
          for (let i = 0; i < data.local.length; i++) {
            const file = data.local[i];
            console.log("  " + file);
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
  }
}
export default IonMC;
