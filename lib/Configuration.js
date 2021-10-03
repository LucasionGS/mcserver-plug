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
        this.configPath = (0, path_1.resolve)(serverRoot, ".ion");
        let serverConfigPath = (0, path_1.resolve)(this.configPath, "serverConfig.json");
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
        fs.writeFileSync((0, path_1.resolve)(c.configPath, "serverConfig.json"), JSON.stringify(c.serverConfig, null, 2));
    }
    Config.init = init;
    function load(serverRoot) {
        let path = (0, path_1.resolve)(serverRoot, "serverConfig.json");
        if (!fs.existsSync(path)) {
            return null;
        }
        return new Config(serverRoot);
    }
    Config.load = load;
})(Config = exports.Config || (exports.Config = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUErQjtBQUMvQix1Q0FBeUI7QUFHekIsTUFBYSxNQUFNO0lBQ2pCLFlBQVksVUFBa0I7UUFxQjlCLGlCQUFZLEdBQStCO1lBQ3pDLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQztRQXRCQSxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUEsY0FBTyxFQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUM3QyxJQUFJLGdCQUFnQixHQUFHLElBQUEsY0FBTyxFQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUNyRSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtZQUNuQyxJQUFJO2dCQUNGLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7YUFDM0U7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzthQUMxQjtTQUNGO2FBQ0k7WUFDSCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQ25DLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQy9CO1lBQ0QsRUFBRSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEY7SUFDSCxDQUFDO0NBU0Y7QUEzQkQsd0JBMkJDO0FBRUQsV0FBaUIsTUFBTTtJQUNyQixTQUFnQixJQUFJLENBQUMsVUFBa0IsRUFBRSxPQUFlO1FBQ3RELElBQUksQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9CLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBQSxjQUFPLEVBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RyxDQUFDO0lBSGUsV0FBSSxPQUduQixDQUFBO0lBRUQsU0FBZ0IsSUFBSSxDQUFDLFVBQWtCO1FBQ3JDLElBQUksSUFBSSxHQUFHLElBQUEsY0FBTyxFQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3hCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFOZSxXQUFJLE9BTW5CLENBQUE7QUFPSCxDQUFDLEVBbkJnQixNQUFNLEdBQU4sY0FBTSxLQUFOLGNBQU0sUUFtQnRCIn0=