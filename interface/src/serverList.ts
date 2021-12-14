import { getToken } from "./token.js";

interface ServerItem {
  name: string;
  players: number;
  maxPlayers: number;
  status: "running" | "starting" | "offline";
  port: number;
}

function makeTd(content?: string) {
  const td = document.createElement("td");
  td.classList.add("server-list-item");
  const span = document.createElement("span");
  if (content) span.innerHTML = content;
  td.appendChild(span);
  return td;
}

function makeTh(content?: string) {
  const th = document.createElement("th");
  th.classList.add("server-list-header-item");
  const span = document.createElement("span");
  if (content) span.innerHTML = content;
  th.appendChild(span);
  return th;
}

function serverItem(server: ServerItem) {

  const tr = document.createElement("tr");
  tr.appendChild(makeTd(server.name));
  tr.appendChild(makeTd(server.players + "/" + server.maxPlayers));
  tr.appendChild(makeTd(server.status[0].toUpperCase() + server.status.slice(1)));
  tr.appendChild(makeTd(server.port.toString()));

  // Actions
  const actions = makeTd();
  const startBtn = document.createElement("button");
  startBtn.classList.add("server-list-item-button");
  startBtn.innerHTML = server.status !== "offline" ? "Attach console" : "Start";
  startBtn.addEventListener("click", () => {
    window.open("/console?server=" + server.name, "_blank");
    setTimeout(() => {
      setServerList();
    }, 2000);
  });
  actions.appendChild(startBtn);
  // const stopBtn = document.createElement("button");
  // stopBtn.innerHTML = "Stop";
  // stopBtn.addEventListener("click", () => {
  //   console.log("Stop server");
  // });
  // actions.appendChild(stopBtn);
  // const consoleBtn = document.createElement("button");
  // consoleBtn.innerHTML = "Console";
  // consoleBtn.addEventListener("click", () => {
  // });
  // actions.appendChild(consoleBtn);

  tr.appendChild(actions);

  return tr;
}

function serverItems(table: HTMLTableElement, servers: ServerItem[]) {
  table.innerHTML = "";

  // Headers
  const headers = document.createElement("tr");
  headers.classList.add("server-list-header");
  headers.append(
    makeTh("Server"),
    makeTh("Players"),
    makeTh("Status"),
    makeTh("Port"),
    makeTh("Actions"),
  );

  table.appendChild(headers);
  
  servers.forEach(server => {
    table.appendChild(serverItem(server));
  });
  return table;
}

async function getServers(): Promise<ServerItem[]> {
  return fetch("/api/serverList?token=" + getToken()).then(res => res.json()).then((servers: ServerItem[]) => servers.sort((a, b) => a.name.localeCompare(b.name)));
}

function setServerList() {
  getServers().then(servers =>
    serverItems(document.getElementById("server-list") as HTMLTableElement, servers)
  )
}

setServerList();