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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvQ0FBdUM7QUFDdkMsNkRBQWtDO0FBRWxDLHlFQUF5RTtBQUN6RSwrQkFBK0I7QUFDL0Isa0NBQWtDO0FBQ2xDLE1BQU07QUFDTiwrQkFBK0I7QUFDL0IsK0RBQStEO0FBQy9ELGdEQUFnRDtBQUNoRCw4QkFBOEI7QUFDOUIsUUFBUTtBQUNSLE1BQU07QUFDTixpQ0FBaUM7QUFDakMsZ0VBQWdFO0FBQ2hFLE1BQU07QUFDTiw4Q0FBOEM7QUFDOUMsMkVBQTJFO0FBQzNFLE1BQU07QUFDTixpRkFBaUY7QUFFakYsSUFBSSxNQUFjLENBQUM7QUFFbkIsV0FBRyxDQUFDLGNBQWMsQ0FDaEIsV0FBRyxDQUFDLFVBQVUsQ0FDWixXQUFHLENBQUMsV0FBVyxFQUFFO0tBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQ2pFLEVBQUUsdUNBQXVDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDdEQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3hCLElBQUksUUFBUSxHQUFHLElBQUksaUJBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxpQkFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLFFBQVEsQ0FBQyxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzFILENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1FBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFeEIsTUFBTSxHQUFHLElBQUksY0FBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtZQUN2QixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBUyxFQUFFO1lBQzVCLGtCQUFrQjtZQUNsQixNQUFNLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDdkMsc0RBQXNEO1lBQ3RELElBQUksRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLGNBQWMsQ0FBZSx3Q0FBd0MsQ0FBQyxDQUFDO1lBQzdGLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEIsbUVBQW1FO1lBQ25FLG1CQUFtQjtRQUNyQixDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBTSxJQUFJLEVBQUMsRUFBRTtZQUNoQyxJQUFJLEVBQUUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxjQUFjLENBQWUsNEJBQTRCLEdBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRSxvQ0FBb0MsQ0FBQyxDQUFDO1lBQ3RJLDZCQUE2QjtRQUMvQixDQUFDLENBQUEsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9