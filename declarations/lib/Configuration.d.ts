export declare class Config {
    constructor(serverRoot: string);
    serverRoot: string;
    configPath: string;
    serverConfig: Config.IonConfig["config"];
}
export declare namespace Config {
    export function init(serverRoot: string, version?: string): void;
    export function load(serverRoot: string): Config;
    export interface IonConfig {
        config: {
            version: string;
            xms: XMX;
            xmx: XMX;
            java: string;
            useStderr: boolean;
        };
    }
    type XMX = `${number}${"K" | "M" | "G"}`;
    export {};
}
