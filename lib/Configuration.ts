import { resolve } from "path";
import * as fs from "fs";


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
    version: null
  };


}

export namespace Config {
  export function init(serverRoot: string, version: string) {
    let c = new Config(serverRoot);
    fs.writeFileSync(resolve(c.configPath, "serverConfig.json"), JSON.stringify(c.serverConfig, null, 2));
  }

  export function load(serverRoot: string): Config {
    let path = resolve(serverRoot, "serverConfig.json");
    if (!fs.existsSync(path)) {
      return null;
    }
    return new Config(serverRoot);
  }

  export interface IonConfig {
    config: {
      version: string;
    }
  }
}
