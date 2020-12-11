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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const path_1 = require("path");
const fs = __importStar(require("fs"));
class Config {
    constructor(serverRoot) {
        this.serverConfig = {
            version: null
        };
        this.serverRoot = serverRoot;
        this.configPath = path_1.resolve(serverRoot, ".ion");
        let serverConfigPath = path_1.resolve(this.configPath, "serverConfig.json");
        if (fs.existsSync(serverConfigPath)) {
            try {
                this.serverConfig = JSON.parse(fs.readFileSync(serverConfigPath, "utf8"));
            }
            catch (error) {
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
}
exports.Config = Config;
(function (Config) {
    function init(serverRoot, version) {
        let c = new Config(serverRoot);
        fs.writeFileSync(path_1.resolve(c.configPath, "serverConfig.json"), JSON.stringify(c.serverConfig, null, 2));
    }
    Config.init = init;
    function load(serverRoot) {
        let path = path_1.resolve(serverRoot, "serverConfig.json");
        if (!fs.existsSync(path)) {
            return null;
        }
        return new Config(serverRoot);
    }
    Config.load = load;
})(Config = exports.Config || (exports.Config = {}));
