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
    server.on("data", info => {
      server.write(info.toString());
    });
    
    server.on("ready", async () => {
      // On server ready
      server.getProperty("spawn-protection");
      // await server.executeCustomCommand("op Lucasion09");
      let sb = await server.executeCommand<"scoreboard">("scoreboard objectives add test trigger");
      console.log(sb);
      // let tr = await server.executeCommand<"trigger">("trigger test");
      // console.log(tr);
    });

    server.on("connect", async user => {
      let sb = await server.executeCommand<"scoreboard">("execute if entity @a[name="+ user.username +"] scoreboard objectives set test 0");
      // server.commands.scoreboard
    })
  });
});