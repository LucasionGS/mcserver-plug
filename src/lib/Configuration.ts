import { resolve } from "path";
import fs from "fs";


export class Config {
  constructor(serverRoot: string) {
    this.serverRoot = serverRoot;
    this.configPath = resolve(serverRoot, ".ion")
    let serverConfigPath = resolve(this.configPath, "serverConfig.json");
    if (fs.existsSync(serverConfigPath)) {
      try {
        this.serverConfig = JSON.parse(fs.readFileSync(serverConfigPath, "utf8"));
      } catch (error) {
        this.serverConfig = null;
      }
    }
    else {
      if (!fs.existsSync(this.configPath)) {
        fs.mkdirSync(this.configPath);
      }
      fs.writeFileSync(serverConfigPath, JSON.stringify(this.serverConfig, null, 2));
    }
  }

  serverRoot: string;
  configPath: string;
  serverConfig: Config.IonConfig["config"] = {
    version: null,
    xms: "2048M",
    xmx: "2048M",
    java: "java",
    useStderr: false,
  };


}

export namespace Config {
  export function init(serverRoot: string, version?: string) {
    let c = new Config(serverRoot);
    c.serverConfig.version = version;
    fs.writeFileSync(resolve(c.configPath, "serverConfig.json"), JSON.stringify(c.serverConfig, null, 2));
  }

  export function load(serverRoot: string): Config {
    let path = resolve(serverRoot, ".ion", "serverConfig.json");
    if (!fs.existsSync(path)) {
      init(serverRoot);
      // return null;
    }
    return new Config(serverRoot);
  }

  export interface IonConfig {
    config: {
      version: string;
      xms: XMX,
      xmx: XMX,
      java: string,
      useStderr: boolean
    }
  }

  type XMX = `${number}${"K" | "M" | "G"}`;
}
