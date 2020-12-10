import { Server, Api } from "../index";
import util from "../lib/IonUtil";

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

var server: Server;

Api.downloadServer(
  Api.getRelease(
    Api.getVersions()
    .then(res => res.versions.find(v => v.id == res.latest.release))
  ), "E:/Dev/mcserver-plug/servers/myserver").then(dl => {
  dl.on("data", (_, r, t) => {
    let received = new util.Byte(r);
    let total = new util.Byte(t);
    console.log(`Downloading... ${dl.downloadPercentage.toFixed(2)}% | ${received.toAutoString()}/${total.toAutoString()}`);
  });

  dl.on("finish", () => {
    console.log("Finished");
    
    server = new Server(dl.dest);
    server.setProperty("spawn-protection", 16);
    server.on("data", info => {
      server.write(info.toString());
    });

    server.on("ready", () => {
      // On server ready.
    });
  });
});