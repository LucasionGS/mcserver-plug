import ws from "./wsc.js";
import { isAction } from "./objects/WSMessage.js";
import { ConsoleInfo } from "./objects/ConsoleInfo.js";
const WSTOKEN = "KJUH37IYFBHJFSD7TFASBN6TJBYHB6TBTYDFT"; // Temporary token
let CURRENT_PID;
function send(message) {
    message.token = WSTOKEN;
    ws.send(JSON.stringify(message));
}
ws.addEventListener("open", () => {
    console.log("Connected to server");
    send({
        action: "server-list",
        // name: "test",
    });
});
ws.addEventListener("message", (event) => {
    var _a;
    const data = JSON.parse(event.data);
    if (isAction(data, "message")) {
        if (data.pid !== CURRENT_PID)
            return;
        const info = new ConsoleInfo(data.message);
        const consoleDiv = document.getElementById("server-console");
        const div = info.toHTML();
        div.classList.add("container-item", "container-item-small");
        consoleDiv.appendChild(div);
        consoleDiv.scrollTo(0, consoleDiv.scrollHeight);
    }
    else if (isAction(data, "attached")) {
        CURRENT_PID = data.pid;
        console.log(data);
        console.log("Attached to process", CURRENT_PID);
        const consoleDiv = document.getElementById("server-console");
        consoleDiv.innerHTML = "";
        ((_a = data.serverLog) !== null && _a !== void 0 ? _a : []).slice(-100).forEach((line) => {
            const div = document.createElement("div");
            div.classList.add("container-item", "container-item-small");
            div.innerText = line;
            consoleDiv.appendChild(div);
        });
        consoleDiv.scrollTo(0, consoleDiv.scrollHeight);
    }
    else if (isAction(data, "player-list")) {
        if (data.pid !== CURRENT_PID)
            return;
        const playersDiv = document.getElementById("player-list");
        playersDiv.innerHTML = "";
        data.players.sort((a, b) => a.username.localeCompare(b.username)).forEach(p => {
            const div = document.createElement("div");
            div.classList.add("container-item");
            div.innerText = p.username;
            div.addEventListener("dblclick", e => {
                send({
                    action: "input",
                    value: "kick " + p.username,
                    pid: CURRENT_PID,
                });
            });
            playersDiv.appendChild(div);
        });
    }
    else if (isAction(data, "server-list")) {
        const serversDiv = document.getElementById("server-list");
        serversDiv.innerHTML = "";
        data.servers.sort((a, b) => a.localeCompare(b)).forEach(s => {
            const div = document.createElement("div");
            div.classList.add("container-item");
            div.innerText = s;
            div.addEventListener("dblclick", e => {
                send({
                    action: "start",
                    name: s,
                });
            });
            serversDiv.appendChild(div);
        });
    }
});
const input = document.getElementById("server-input");
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        send({
            action: "input",
            value: input.value,
            pid: CURRENT_PID,
        });
        input.value = "";
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVubmluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJ1bm5pbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzFCLE9BQU8sRUFBRSxRQUFRLEVBQXlDLE1BQU0sd0JBQXdCLENBQUM7QUFDekYsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3ZELE1BQU0sT0FBTyxHQUFHLHVDQUF1QyxDQUFDLENBQUMsa0JBQWtCO0FBQzNFLElBQUksV0FBbUIsQ0FBQztBQUV4QixTQUFTLElBQUksQ0FBQyxPQUFZO0lBQ3hCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO0lBQ3hCLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFFbkMsSUFBSSxDQUFDO1FBQ0gsTUFBTSxFQUFFLGFBQWE7UUFDckIsZ0JBQWdCO0tBQ2pCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFOztJQUN2QyxNQUFNLElBQUksR0FBcUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFdEQsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFO1FBQzdCLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxXQUFXO1lBQUUsT0FBTztRQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFM0MsTUFBTSxVQUFVLEdBQUcsUUFBUSxD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