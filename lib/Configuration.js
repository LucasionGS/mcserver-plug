"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
class Config {
    constructor(serverRoot) {
        this.serverConfig = {
            version: null,
            xms: "2048M",
            xmx: "2048M",
            java: "java",
            useStderr: false,
        };
        this.serverRoot = serverRoot;
        this.configPath = (0, path_1.resolve)(serverRoot, ".ion");
        let serverConfigPath = (0, path_1.resolve)(this.configPath, "serverConfig.json");
        if (fs_1.default.existsSync(serverConfigPath)) {
            try {
                this.serverConfig = JSON.parse(fs_1.default.readFileSync(serverConfigPath, "utf8"));
            }
            catch (error) {
                this.serverConfig = null;
            }
        }
        else {
            if (!fs_1.default.existsSync(this.configPath)) {
                fs_1.default.mkdirSync(this.configPath);
            }
            fs_1.default.writeFileSync(serverConfigPath, JSON.stringify(this.serverConfig, null, 2));
        }
    }
}
exports.Config = Config;
(function (Config) {
    function init(serverRoot, version) {
        let c = new Config(serverRoot);
        c.serverConfig.version = version;
        fs_1.default.writeFileSync((0, path_1.resolve)(c.configPath, "serverConfig.json"), JSON.stringify(c.serverConfig, null, 2));
    }
    Config.init = init;
    function load(serverRoot) {
        let path = (0, path_1.resolve)(serverRoot, ".ion", "serverConfig.json");
        if (!fs_1.default.existsSync(path)) {
            init(serverRoot);
            // return null;
        }
        return new Config(serverRoot);
    }
    Config.load = load;
})(Config = exports.Config || (exports.Config = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsK0JBQStCO0FBQy9CLDRDQUFvQjtBQUdwQixNQUFhLE1BQU07SUFDakIsWUFBWSxVQUFrQjtRQXFCOUIsaUJBQVksR0FBK0I7WUFDekMsT0FBTyxFQUFFLElBQUk7WUFDYixHQUFHLEVBQUUsT0FBTztZQUNaLEdBQUcsRUFBRSxPQUFPO1lBQ1osSUFBSSxFQUFFLE1BQU07WUFDWixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO1FBMUJBLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBQSxjQUFPLEVBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQzdDLElBQUksZ0JBQWdCLEdBQUcsSUFBQSxjQUFPLEVBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3JFLElBQUksWUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ25DLElBQUk7Z0JBQ0YsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQUUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUMzRTtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2FBQzFCO1NBQ0Y7YUFDSTtZQUNILElBQUksQ0FBQyxZQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDbkMsWUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDL0I7WUFDRCxZQUFFLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoRjtJQUNILENBQUM7Q0FhRjtBQS9CRCx3QkErQkM7QUFFRCxXQUFpQixNQUFNO0lBQ3JCLFNBQWdCLElBQUksQ0FBQyxVQUFrQixFQUFFLE9BQWdCO1FBQ3ZELElBQUksQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUNqQyxZQUFFLENBQUMsYUFBYSxDQUFDLElBQUEsY0FBTyxFQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEcsQ0FBQztJQUplLFdBQUksT0FJbkIsQ0FBQTtJQUVELFNBQWdCLElBQUksQ0FBQyxVQUFrQjtRQUNyQyxJQUFJLElBQUksR0FBRyxJQUFBLGNBQU8sRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLFlBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2pCLGVBQWU7U0FDaEI7UUFDRCxPQUFPLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFQZSxXQUFJLE9BT25CLENBQUE7QUFhSCxDQUFDLEVBM0JnQixNQUFNLEdBQU4sY0FBTSxLQUFOLGNBQU0sUUEyQnRCIn0=