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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Download = void 0;
const fs = __importStar(require("fs"));
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const path = __importStar(require("path"));
const events_1 = require("events");
class Download extends events_1.EventEmitter {
    constructor(url, dest, autoStart) {
        super(
        // {
        //   "captureRejections": true
        // }
        );
        this.url = url;
        this.receivedBytes = 0;
        if (typeof dest === "boolean") {
            autoStart = dest;
            dest = undefined;
        }
        if (autoStart === undefined)
            autoStart = true;
        if (/^http:\/\//.test(url)) {
            this.get = function (a, b) {
                return http.get(a, b);
            };
        }
        else if (/^https:\/\//.test(url)) {
            this.get = function (a, b) {
                return https.get(a, b);
            };
        }
        else {
            throw "Protocol needs to be either http:// or https://";
        }
        if (typeof dest == "string") {
            this.dest = dest;
        }
        if (autoStart == true)
            this.start();
    }
    /**
     * Start the download manually if you disabled autostart when making the download instance.
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            let resolve;
            let p = new Promise(res => resolve = res);
            this.get(this.url, res => {
                this.incomingMessage = res;
                this.totalBytes = +res.headers["content-length"];
                resolve(res);
                this.emit("start", res);
                if (typeof this.dest == "string") {
                    let dir = path.dirname(this.dest);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    var stream = fs.createWriteStream(this.dest);
                    this.stream = stream;
                    res.pipe(stream);
                }
                res.on("data", (buffer) => {
                    this.receivedBytes += buffer.byteLength;
                    this.emit("data", buffer, this.receivedBytes, this.totalBytes);
                });
                res.on("end", () => {
                    this.emit("finish");
                });
            });
            return p;
        });
    }
    get(a, b) { return; }
    /**
     * Contains the current progress in percentage from 0 to 100 as a float.
     */
    get downloadPercentage() {
        return (this.receivedBytes / this.totalBytes) * 100;
    }
}
exports.Download = Download;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG93bmxvYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJEb3dubG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQXlCO0FBQ3pCLDJDQUE2QjtBQUM3Qiw2Q0FBK0I7QUFDL0IsMkNBQTZCO0FBQzdCLG1DQUFzQztBQVl0QyxNQUFhLFFBQVMsU0FBUSxxQkFBWTtJQUt4QyxZQUFtQixHQUFXLEVBQUUsSUFBdUIsRUFBRSxTQUFtQjtRQUMxRSxLQUFLO1FBQ0gsSUFBSTtRQUNKLDhCQUE4QjtRQUM5QixJQUFJO1NBQ0wsQ0FBQztRQUxlLFFBQUcsR0FBSCxHQUFHLENBQVE7UUE2RTlCLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBdEV4QixJQUFJLE9BQU8sSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUM3QixTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksR0FBRyxTQUFTLENBQUM7U0FDbEI7UUFDRCxJQUFJLFNBQVMsS0FBSyxTQUFTO1lBQUUsU0FBUyxHQUFHLElBQUksQ0FBQztRQUU5QyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQU0sRUFBRSxDQUFNO2dCQUNqQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQztTQUNIO2FBQ0ksSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFNLEVBQUUsQ0FBTTtnQkFDakMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUM7U0FDSDthQUNJO1lBQ0gsTUFBTSxpREFBaUQsQ0FBQztTQUN6RDtRQUNELElBQUksT0FBTyxJQUFJLElBQUksUUFBUSxFQUFFO1lBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ2xCO1FBQ0QsSUFBSSxTQUFTLElBQUksSUFBSTtZQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7O09BRUc7SUFDRyxLQUFLOztZQUNULElBQUksT0FBbUYsQ0FBQztZQUN4RixJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBdUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUN2QixJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUU7b0JBQ2hDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNsQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDdkIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztxQkFDeEM7b0JBQ0QsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDN0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7b0JBQ3JCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ2xCO2dCQUVELEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBYyxFQUFFLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxhQUFhLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQztvQkFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNqRSxDQUFDLENBQUMsQ0FBQztnQkFFSCxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7b0JBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsQ0FBQztRQUNYLENBQUM7S0FBQTtJQUlELEdBQUcsQ0FBQyxDQUFNLEVBQUUsQ0FBTSxJQUF3QixPQUFPLENBQUMsQ0FBQztJQWFuRDs7T0FFRztJQUNILElBQUksa0JBQWtCO1FBQ3BCLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDdEQsQ0FBQztDQUNGO0FBM0ZELDRCQTJGQyJ9