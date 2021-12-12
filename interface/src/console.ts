import ws from "./wsc.js";
import { isAction, IWSActionMessage, IWSActionMessageMap } from "./objects/WSMessage.js";
import { ConsoleInfo } from "./objects/ConsoleInfo.js";
const WSTOKEN = "KJUH37IYFBHJFSD7TFASBN6TJBYHB6TBTYDFT"; // Temporary token
let CURRENT_PID: number;
const params = new URLSearchParams(window.location.search);

function send(message: any) {
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
  const data: IWSActionMessage = JSON.parse(event.data);

  if (isAction(data, "message")) {
    if (data.pid !== CURRENT_PID) return;
    const info = new ConsoleInfo(data.message);

    const consoleDiv = document.getElementById("server-console") as HTMLDivElement;
    const div = info.toHTML();
    div.classList.add("container-item", "container-item-small");
    consoleDiv.appendChild(div);
    if ((consoleDiv.scrollHeight - consoleDiv.clientHeight) - 128 < consoleDiv.scrollTop) consoleDiv.scrollTo(0, consoleDiv.scrollHeight);
  }
  else if (isAction(data, "attached")) {
    CURRENT_PID = data.pid;
    console.log(data);
    console.log("Attached to process", CURRENT_PID);

    const consoleDiv = document.getElementById("server-console") as HTMLDivElement;
    consoleDiv.innerHTML = "";
    (data.serverLog ?? []).slice(-100).forEach((line) => {
      const info = new ConsoleInfo(line);
      const div = info.toHTML();
      div.classList.add("container-item", "container-item-small");
      consoleDiv.appendChild(div);
    });
    consoleDiv.scrollTo(0, consoleDiv.scrollHeight);
  }

  else if (isAction(data, "player-list")) {
    if (data.pid !== CURRENT_PID) return;
    const playersDiv = document.getElementById("player-list") as HTMLDivElement;
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

const input = document.getElementById("server-input") as HTMLInputElement;
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