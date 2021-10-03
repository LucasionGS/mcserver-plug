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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const IonUtil_1 = __importDefault(require("./IonUtil"));
const fs = __importStar(require("fs"));
const Download_1 = require("./Download");
var Api;
(function (Api) {
    const queryUrl = "https://launchermeta.mojang.com/mc/game/version_manifest.json";
    function getVersions() {
        return __awaiter(this, void 0, void 0, function* () {
            let p = IonUtil_1.default.promise();
            (0, request_1.default)(queryUrl, {
                json: true
            }, (err, _, data) => {
                if (err)
                    console.error(err);
                p.resolve(data);
            });
            return p.promise;
        });
    }
    Api.getVersions = getVersions;
    function getRelease(version) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof version == "string") {
                version = getVersions().then(v => v.versions.find(v => v.id == version));
            }
            version = yield version;
            let p = IonUtil_1.default.promise();
            (0, request_1.default)(version.url, {
                json: true
            }, (err, _, data) => {
                if (err)
                    console.error(err);
                p.resolve(data);
            });
            return p.promise;
        });
    }
    Api.getRelease = getRelease;
    function downloadServer(release, location, jarName = "server") {
        return __awaiter(this, void 0, void 0, function* () {
            release = yield release;
            if (jarName.endsWith(".jar"))
                jarName = jarName.substring(0, jarName.length - 4);
            fs.mkdirSync(location, { recursive: true });
            let dl = new Download_1.Download(release.downloads.server.url, location + `/${jarName}.jar`);
            return dl;
        });
    }
    Api.downloadServer = downloadServer;
})(Api || (Api = {}));
exports.default = Api;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUE4QjtBQUM5Qix3REFBNkI7QUFDN0IsdUNBQXlCO0FBQ3pCLHlDQUFzQztBQUd0QyxJQUFVLEdBQUcsQ0E0R1o7QUE1R0QsV0FBVSxHQUFHO0lBQ1gsTUFBTSxRQUFRLEdBQUcsK0RBQStELENBQUM7SUFzRWpGLFNBQXNCLFdBQVc7O1lBQy9CLElBQUksQ0FBQyxHQUFHLGlCQUFJLENBQUMsT0FBTyxFQUFtQixDQUFDO1lBQ3hDLElBQUEsaUJBQU8sRUFBQyxRQUFRLEVBQUU7Z0JBQ2hCLElBQUksRUFBRSxJQUFJO2FBQ1gsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBcUIsRUFBRSxFQUFFO2dCQUNuQyxJQUFJLEdBQUc7b0JBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUNuQixDQUFDO0tBQUE7SUFWcUIsZUFBVyxjQVVoQyxDQUFBO0lBRUQsU0FBc0IsVUFBVSxDQUFDLE9BQTRDOztZQUMzRSxJQUFJLE9BQU8sT0FBTyxJQUFJLFFBQVEsRUFBRTtnQkFDOUIsT0FBTyxHQUFHLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQzFFO1lBQ0QsT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxHQUFHLGlCQUFJLENBQUMsT0FBTyxFQUFXLENBQUM7WUFDaEMsSUFBQSxpQkFBTyxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7Z0JBQ25CLElBQUksRUFBRSxJQUFJO2FBQ1gsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBYSxFQUFFLEVBQUU7Z0JBQzNCLElBQUksR0FBRztvQkFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM1QixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUM7S0FBQTtJQWRxQixjQUFVLGFBYy9CLENBQUE7SUFFRCxTQUFzQixjQUFjLENBQUMsT0FBbUMsRUFBRSxRQUFnQixFQUFFLE9BQU8sR0FBRyxRQUFROztZQUM1RyxPQUFPLEdBQUcsTUFBTSxPQUFPLENBQUM7WUFFeEIsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFBRSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUVqRixFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLElBQUksRUFBRSxHQUFHLElBQUksbUJBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsUUFBUSxHQUFHLElBQUksT0FBTyxNQUFNLENBQUMsQ0FBQztZQUNsRixPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7S0FBQTtJQVJxQixrQkFBYyxpQkFRbkMsQ0FBQTtBQUNILENBQUMsRUE1R1MsR0FBRyxLQUFILEdBQUcsUUE0R1o7QUFFRCxrQkFBZSxHQUFHLENBQUMifQ==