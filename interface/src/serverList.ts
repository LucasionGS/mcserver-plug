interface ServerItem {
  name: string;
  players: number;
  maxPlayers: number;
  status: string;
  port: number;
}

function serverItem(server: ServerItem) {
  function makeTd(content?: string) {
    const td = document.createElement("td");
    td.classList.add("server-list-item");
    const span = document.createElement("span");
    if (content) span.innerHTML = content;
    td.appendChild(span);
    return td;
  }

  const tr = document.createElement("tr");
  tr.appendChild(makeTd(server.name));
  tr.appendChild(makeTd(server.players + "/" + server.maxPlayers));
  tr.appendChild(makeTd(server.status));
  tr.appendChild(makeTd(server.port.toString()));

  // Actions
  const actions = makeTd();
  // Start, Stop, Console
  const startBtn = document.createElement("button");
  startBtn.innerHTML = "Start";
  startBtn.addEventListener("click", () => {
    console.log("Start server");
  });
  actions.appendChild(startBtn);
  const stopBtn = document.createElement("button");
  stopBtn.innerHTML = "Stop";
  stopBtn.addEventListener("click", () => {
    console.log("Stop server");
  });
  actions.appendChild(stopBtn);
  const consoleBtn = document.createElement("button");
  consoleBtn.innerHTML = "Console";
  consoleBtn.addEventListener("click", () => {
    window.open("/console?server=" + server.name, "_blank");
  });
  actions.appendChild(consoleBtn);

  tr.appendChild(actions);
  
  return tr;
}

function serverItems(table: HTMLTableElement, servers: ServerItem[]) {
  table.classList.add("server-list");
  const tbody = table.querySelector("tbody");
  servers.forEach(server => {
    tbody.appendChild(serverItem(server));
  });
  table.appendChild(tbody);
  return table;
}

serverItems(document.getElementById("server-list") as HTMLTableElement, [
  {
    name: "test",
    players: 0,
    maxPlayers: 20,
    status: "online",
    port: 25565
  }
]);