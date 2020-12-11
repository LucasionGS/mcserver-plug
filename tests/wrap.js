"use strict";
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
const index_1 = require("../index");
const IonUtil_1 = __importDefault(require("../lib/IonUtil"));
// let server = new Server("E:/Server/Minecraft/Lisa Server/server.jar");
// server.on("data", (chk) => {
//   server.write(chk.toString());
// });
// server.on("ready", time => {
//   server.write(`Server has started after ${time} seconds!`);
//   server.executeCommand("list").then(ans => {
//     server.write(ans.data);
//   });
// });
// server.on("connect", user => {
//   server.executeCustomCommand(`say Hello ${user.username}!`);
// });
// server.on("disconnect", (user, reason) => {
//   server.write(`${user.username} just disconnected. Reason: ${reason}`);
// });
// server.write(Api.getVersions().then(res => server.write(res.latest.release)));
var server;
index_1.Api.downloadServer(index_1.Api.getRelease(index_1.Api.getVersions()
    .then(res => res.versions.find(v => v.id == res.latest.release))), "E:/Dev/mcserver-plug/servers/myserver").then(dl => {
    dl.on("data", (_, r, t) => {
        let received = new IonUtil_1.default.Byte(r);
        let total = new IonUtil_1.default.Byte(t);
        console.log(`Downloading... ${dl.downloadPercentage.toFixed(2)}% | ${received.toAutoString()}/${total.toAutoString()}`);
    });
    dl.on("finish", () => {
        console.log("Finished");
        server = new index_1.Server(dl.dest);
        server.on("data", info => {
            server.write(info.toString());
        });
        server.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
            // On server ready
            server.getProperty("spawn-protection");
            // await server.executeCustomCommand("op Lucasion09");
            let sb = yield server.executeCommand("scoreboard objectives add test trigger");
            console.log(sb);
            // let tr = await server.executeCommand<"trigger">("trigger test");
            // console.log(tr);
        }));
        server.on("connect", (user) => __awaiter(void 0, void 0, void 0, function* () {
            let sb = yield server.executeCommand("execute if entity @a[name=" + user.username + "] scoreboard objectives set test 0");
            // server.commands.scoreboard
        }));
    });
});
