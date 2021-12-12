import ws from "./wsc.js";
import { isAction } from "./objects/WSMessage.js";
import { ConsoleInfo } from "./objects/ConsoleInfo.js";
const WSTOKEN = "KJUH37IYFBHJFSD7TFASBN6TJBYHB6TBTYDFT"; // Temporary token
let CURRENT_PID;
const params = new URLSearchParams(window.location.search);
function send(message) {
    message.token = WSTOKEN;
    ws.send(JSON.stringify(message));
}
ws.addEventListener("open", () => {
    console.log("Connected to server");
    if (params.has("server")) {
        const server = params.get("server");
        console.log("Connecting to server: " + server + "...");
        send({
            action: "start",
            name: server,
        });
    }
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
        if ((consoleDiv.scrollHeight - consoleDiv.clientHeight) - 128 < consoleDiv.scrollTop)
            consoleDiv.scrollTo(0, consoleDiv.scrollHeight);
    }
    else if (isAction(data, "attached")) {
        CURRENT_PID = data.pid;
        console.log(data);
        console.log("Attached to process", CURRENT_PID);
        const consoleDiv = document.getElementById("server-console");
        consoleDiv.innerHTML = "";
        ((_a = data.serverLog) !== null && _a !== void 0 ? _a : []).slice(-100).forEach((line) => {
            const info = new ConsoleInfo(line);
            const div = info.toHTML();
            div.classList.add("container-item", "container-item-small");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnNvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzFCLE9BQU8sRUFBRSxRQUFRLEVBQXlDLE1BQU0sd0JBQXdCLENBQUM7QUFDekYsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3ZELE1BQU0sT0FBTyxHQUFHLHVDQUF1QyxDQUFDLENBQUMsa0JBQWtCO0FBQzNFLElBQUksV0FBbUIsQ0FBQztBQUN4QixNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTNELFNBQVMsSUFBSSxDQUFDLE9BQVk7SUFDeEIsT0FBTyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7SUFDeEIsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUVELEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUVuQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDeEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixHQUFHLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUM7WUFDSCxNQUFNLEVBQUUsT0FBTztZQUNmLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQyxDQUFDO0tBQ0o7QUFFSCxDQUFDLENBQUMsQ0FBQztBQUVILEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTs7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