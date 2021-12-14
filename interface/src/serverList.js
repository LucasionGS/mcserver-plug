var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getToken } from "./token.js";
function makeTd(content) {
    const td = document.createElement("td");
    td.classList.add("server-list-item");
    const span = document.createElement("span");
    if (content)
        span.innerHTML = content;
    td.appendChild(span);
    return td;
}
function makeTh(content) {
    const th = document.createElement("th");
    th.classList.add("server-list-header-item");
    const span = document.createElement("span");
    if (content)
        span.innerHTML = content;
    th.appendChild(span);
    return th;
}
function serverItem(server) {
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
function serverItems(table, servers) {
    table.innerHTML = "";
    // Headers
    const headers = document.createElement("tr");
    headers.classList.add("server-list-header");
    headers.append(makeTh("Server"), makeTh("Players"), makeTh("Status"), makeTh("Port"), makeTh("Actions"));
    table.appendChild(headers);
    servers.forEach(server => {
        table.appendChild(serverItem(server));
    });
    return table;
}
function getServers() {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch("/api/serverList?token=" + getToken()).then(res => res.json()).then((servers) => servers.sort((a, b) => a.name.localeCompare(b.name)));
    });
}
function setServerList() {
    getServers().then(servers => serverItems(document.getElementById("server-list"), servers));
}
setServerList();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyTGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcnZlckxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQVV0QyxTQUFTLE1BQU0sQ0FBQyxPQUFnQjtJQUM5QixNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDckMsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QyxJQUFJLE9BQU87UUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztJQUN0QyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JCLE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQztBQUVELFNBQVMsTUFBTSxDQUFDLE9BQWdCO0lBQzlCLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUM1QyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLElBQUksT0FBTztRQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQ3RDLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckIsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUMsTUFBa0I7SUFFcEMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxN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