import { Interface } from "readline";

export interface InterfaceUser {
  username: string;
  password: string;
}

interface InterfaceConfiguration {
  users: { [username: string]: string };
}

namespace InterfaceConfiguration {
  export function init(config: InterfaceConfiguration) {
    config ??= {} as InterfaceConfiguration;
    config.users ??= {};
  
    return config;
  }
}

export default InterfaceConfiguration;
