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
            request_1.default(queryUrl, {
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
            request_1.default(version.url, {
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
