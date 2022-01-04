import { ServerItem } from "./objects/ServerItem";
import { getToken } from "./token.js";

function makeTd(content?: string) {
  const td = document.createElement("td");
  td.classList.add("status-list-item");
  const span = document.createElement("span");
  if (content) span.innerHTML = content;
  td.appendChild(span);
  return td;
}

function makeTh(content?: string) {
  const th = document.createElement("th");
  th.classList.add("status-list-header-item");
  th.style.textAlign = "right";
  const span = document.createElement("span");
  if (content) span.innerHTML = content;
  th.appendChild(span);
  return th;
}

async function getStatus(server: string): Promise<ServerItem> {
  return fetch(`/api/status?token=${getToken()}&server=${server}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(res => res.json());
}

const params = new URLSearchParams(window.location.search);

function updateStatus() {
  getStatus(params.get("server")).then(res => {
    // Create table of data.
    const table = document.createElement("table");
  
    const createRow = (name: string, value: string, alter?: (th: HTMLTableCellElement, td: HTMLTableCellElement) => void) => {
      
      const row = document.createElement("tr");
      row.classList.add("status-list-item");
      const th = makeTh(name);
      const td = makeTd(value);
      row.append(th, td);
  
      if (alter) alter(th, td);
      return row;
    }
  
    table.appendChild(createRow("Name", res.name));
    table.appendChild(createRow("Players", `${res.players}/${res.maxPlayers}`));
    table.appendChild(createRow("Status", res.status[0].toUpperCase() + res.status.slice(1), (th, td) => td.style.color = res.status === "running" ? "green" : "red"));
    table.appendChild(createRow("Port", res.port.toString()));
  
    const main = document.querySelector("main");
    main.innerHTML = "";
    main.appendChild(table);
  });

  setTimeout(() => {
    updateStatus();
  }, 5000);
}

updateStatus();