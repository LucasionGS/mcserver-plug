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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUErQjtBQUMvQix1Q0FBeUI7QUFHekIsTUFBYSxNQUFNO0lBQ2pCLFlBQVksVUFBa0I7UUFxQjlCLGlCQUFZLEdBQStCO1lBQ3pDLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQztRQXRCQSxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLGNBQU8sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDN0MsSUFBSSxnQkFBZ0IsR0FBRyxjQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3JFLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ25DLElBQUk7Z0JBQ0YsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUMzRTtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2FBQzFCO1NBQ0Y7YUFDSTtZQUNILElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDbkMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDL0I7WUFDRCxFQUFFLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoRjtJQUNILENBQUM7Q0FTRjtBQTNCRCx3QkEyQkM7QUFFRCxXQUFpQixNQUFNO0lBQ3JCLFNBQWdCLElBQUksQ0FBQyxVQUFrQixFQUFFLE9BQWU7UUFDdEQsSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0IsRUFBRSxDQUFDLGFBQWEsQ0FBQyxjQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RyxDQUFDO0lBSGUsV0FBSSxPQUduQixDQUFBO0lBRUQsU0FBZ0IsSUFBSSxDQUFDLFVBQWtCO1FBQ3JDLElBQUksSUFBSSxHQUFHLGNBQU8sQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBTmUsV0FBSSxPQU1uQixDQUFBO0FBT0gsQ0FBQyxFQW5CZ0IsTUFBTSxHQUFOLGNBQU0sS0FBTixjQUFNLFFBbUJ0QiJ9