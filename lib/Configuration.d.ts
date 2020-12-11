export declare class Config {
    constructor(serverRoot: string);
    serverRoot: string;
    configPath: string;
    serverConfig: Config.IonConfig["config"];
}
export declare namespace Config {
    function init(serverRoot: string, version: string): void;
    function load(serverRoot: string): Config;
    interface IonConfig {
        config: {
            version: string;
        };
    }
}
