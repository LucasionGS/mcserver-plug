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
    td.classList.add("status-list-item");
    const span = document.createElement("span");
    if (content)
        span.innerHTML = content;
    td.appendChild(span);
    return td;
}
function makeTh(content) {
    const th = document.createElement("th");
    th.classList.add("status-list-header-item");
    th.style.textAlign = "right";
    const span = document.createElement("span");
    if (content)
        span.innerHTML = content;
    th.appendChild(span);
    return th;
}
function getStatus(server) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch(`/api/status?token=${getToken()}&server=${server}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json());
    });
}
const params = new URLSearchParams(window.location.search);
function updateStatus() {
    getStatus(params.get("server")).then(res => {
        // Create table of data.
        const table = document.createElement("table");
        const createRow = (name, value, alter) => {
            const row = document.createElement("tr");
            row.classList.add("status-list-item");
            const th = makeTh(name);
            const td = makeTd(value);
            row.append(th, td);
            if (alter)
                alter(th, td);
            return row;
        };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhdHVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFdEMsU0FBUyxNQUFNLENBQUMsT0FBZ0I7SUFDOUIsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUMsSUFBSSxPQUFPO1FBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7SUFDdEMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQixPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxPQUFnQjtJQUM5QixNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDNUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQzdCLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUMsSUFBSSxPQUFPO1FBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7SUFDdEMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQixPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUM7QUFFRCxTQUFlLFNBQVMsQ0FBQyxNQUFjOztRQUNyQyxPQUFPLEtBQUssQ0FBQyxxQkFBcUIsUUFBUSxFQUFFLFdBQVcsTUFBTSxFQUFFLEVB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