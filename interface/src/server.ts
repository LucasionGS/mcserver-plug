import { getToken } from "./token.js";

const serverContent = document.querySelector<HTMLDivElement>(".server-editor-content");
const param = new URLSearchParams(window.location.search);
const serverName = param.get("server");

const buttonActions: { [key: string]: (e: MouseEvent) => void } = {
  "back": (e) => {
    e.preventDefault();
    window.location.href = "..";
  },
  "status": (e) => {
    serverContent.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = "/status?server=" + serverName + "&token=" + getToken();
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    serverContent.appendChild(iframe);
  },
  "properties": (e) => {
    serverContent.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = "/serverproperties?server=" + serverName + "&token=" + getToken();
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    serverContent.appendChild(iframe);
  },
  "console": (e) => {
    serverContent.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = "/console?server=" + serverName + "&token=" + getToken();
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    serverContent.appendChild(iframe);
  },
};

([...document.getElementsByClassName("panel-list-item")] as HTMLDivElement[]).forEach(item => {
  const action = item.id.replace(/-panel$/, "");
  if (action in buttonActions) {
    item.addEventListener("click", buttonActions[action]);
  }
});

buttonActions["status"](null);