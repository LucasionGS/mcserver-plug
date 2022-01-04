import { getToken } from "./token.js";
import ServerProperties from "../../shared/ServerProperties";

let _saved = true;

async function getProperties(name: string): Promise<ServerProperties> {
  return fetch("/api/server.properties?token=" + getToken() + "&name=" + name, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(res => res.json());
}
const selectFields = {
  gamemode: [
    "survival",
    "creative",
    "adventure",
    "spectator",
  ],
  difficulty: [
    "peaceful",
    "easy",
    "normal",
    "hard",
  ],
}

const propertyPrettyNames: { [key: string]: string } = {
  "motd": "Message of the Day",
  "pvp": "PvP",
  "rcon.port": "Rcon port",
  "rcon.password": "Rcon password",
  "query.port": "Query port",
};

const propertyDescriptions: { [key: string]: string } = {
  "motd": "The message being displayed to\nplayers in the server explorer.",
  "pvp": "Whether or not players can hurt each other",
  "rcon.port": "The port to use for Rcon",
  "rcon.password": "The password to use for Rcon",
  "query.port": "The port to use for Query",
  "server-ip": "The IP address of the server. Set this to enforce a specific IP address.",
  "white-list": "Whether or not players who can join is exclusive to the a whitelist.",
  "hardcore" : "Whether or not players are banned forever when they die.",
  "level-name": "The name of the world to load. It can be a relative path.",
  "generate-structures": "Whether or not structures are generated.",
  "max-build-height": "The maximum height at which players can build.",
  "spawn-protection": "The radius around the spawn point that players cannot build.",
  "max-players": "The maximum number of players that can be on the server at once.",
  "view-distance": "The maximum distance players can see.",
  "allow-flight": "Whether or not players can fly.",
  "spawn-animals": "Whether or not animals are spawned.",
  "spawn-monsters": "Whether or not monsters are spawned.",
  "spawn-npcs": "Whether or not NPCs are spawned.",
  "max-world-size": "The maximum size of the world.",
};

const propertiesToCategory = [
  // General
  {
    name: "General",
    properties: [
      "motd",
      "online-mode",
      "server-ip",
      "server-port",
      "white-list",
    ]
  },

  // World
  {
    name: "World",
    properties: [
      "pvp",
      "allow-nether",
      "level-name",
      "difficulty",
      "gamemode",
      "hardcore",
      "max-players",
      "max-world-size",
      "spawn-protection",
      "spawn-animals",
      "spawn-monsters",
      "spawn-npcs",
      "view-distance",
    ]
  },

  // Resource packs
  {
    name: "Resource packs",
    properties: [
      "resource-pack",
      "resource-pack-sha1",
      "resource-pack-url",
      "require-resource-pack",
      "resource-pack-prompt"
    ]
  },

  // Anything else that doesn't fit into any category, goes into the "Other" category.
  {
    name: "Other",
    properties: []
  },
]

function getPropertyPrettyName(name: string) {
  if (name in propertyPrettyNames) {
    return propertyPrettyNames[name];
  }
  return name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => {
    return str.toUpperCase();
  }).replace(/-/g, " ");
}

async function createPropertiesEditor() {
  const params = new URLSearchParams(window.location.search);
  const serverName = params.get("server");
  if (!serverName) throw new Error("No server name specified.");
  const properties = await getProperties(serverName); // Use a dummy server name to get the properties for testing
  const editor = document.createElement("form");
  editor.classList.add("properties-editor");
  const keys = Object.keys(properties).sort();

  const categories: { [key: string]: HTMLTableElement } = {};

  for (const category of propertiesToCategory) {
    const div = document.createElement("div");
    div.classList.add("properties-editor-category");
    const header = document.createElement("h2");
    header.innerText = category.name;
    div.appendChild(header);
    const table = document.createElement("table");
    table.classList.add("properties-editor-table");
    div.appendChild(table);
    div.appendChild(document.createElement("hr"));
    editor.appendChild(div);
    categories[category.name] = table;
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const tr = document.createElement("tr");
    const tdKey = document.createElement("td");
    const label = document.createElement("label");
    label.innerText = getPropertyPrettyName(key);
    label.setAttribute("for", key);
    label.style.display = "block";
    label.style.textAlign = "right";
    label.style.userSelect = "none";
    tdKey.title = propertyDescriptions[key] ?? key;
    tdKey.appendChild(label);
    const tdValue = document.createElement("td");
    const tdComment = document.createElement("td");

    const typeofValue = typeof properties[key as keyof ServerProperties];
    if (key in selectFields) {
      const select = document.createElement("select");
      select.classList.add("properties-editor-input");
      select.name = key;
      select.id = key;
      const options = selectFields[key as keyof typeof selectFields];
      for (const option of options) {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.innerHTML = getPropertyPrettyName(option);
        optionElement.title = option;
        select.appendChild(optionElement);
      }

      const selectValue = properties[key as keyof ServerProperties] as string;
      select.value = selectValue;

      select.addEventListener("change", (e) => {
        submit.disabled = false;
        submit.value = "Save";
        _saved = false;
      });

      tdValue.appendChild(select);
    }
    else {
      const input = document.createElement("input");
      input.classList.add("properties-editor-input");
      input.name = key;
      input.id = key;
      if (typeofValue === "string") {
        input.type = "text";
        input.value = properties[key as keyof ServerProperties] as string;
      }
      else if (typeofValue === "number") {
        input.type = "number";
        input.valueAsNumber = properties[key as keyof ServerProperties] as number;
      }
      else if (typeofValue === "boolean") {
        input.type = "checkbox";
        input.checked = properties[key as keyof ServerProperties] as boolean;
      }

      input.addEventListener("change", (e) => {
        submit.disabled = false;
        submit.value = "Save";
        _saved = false;
      });

      input.addEventListener("input", (e) => {
        submit.disabled = false;
        submit.value = "Save";
        _saved = false;
      });



      tdValue.appendChild(input);
    }

    if (propertyDescriptions[key]) {
      const comment = document.createElement("span");
      comment.classList.add("properties-editor-comment");
      comment.style.color = "gray";
      comment.style.wordSpacing = "pre";
      comment.innerText = propertyDescriptions[key];
      tdComment.appendChild(comment);
    }
    tr.appendChild(tdKey);
    tr.appendChild(tdValue);
    tr.appendChild(tdComment);

    const table = categories[propertiesToCategory.find(c => c.properties.includes(key))?.name ?? "Other"];
    table.appendChild(tr);
  }

  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "Saved";
  submit.disabled = true;
  submit.style.fontSize = "1.5em";
  editor.appendChild(submit);

  editor.addEventListener("submit", (e) => {
    e.preventDefault();
    // const formData = new FormData(editor);
    const data: { [key: string]: any } = {};
    for (const key of keys) {
      const input = ((e.target as HTMLFormElement).querySelector(`[name="${key}"]`) as HTMLInputElement);
      if (input.type === "checkbox") {
        data[key] = input.checked;
      }
      else if (input.type === "number") {
        data[key] = input.valueAsNumber;
      }
      else {
        data[key] = input.value;
      }
    }
    console.log(data);

    fetch("/api/server.properties?token=" + getToken() + "&name=" + serverName, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      res.json().then((text) => {
        console.log(text);
      });
      submit.disabled = true;
      submit.value = "Saved";
      _saved = true;
      // window.location.reload();
    });
  });

  return editor;
}

createPropertiesEditor().then(editor => {
  const propertiesEditor = document.getElementById("properties-editor") as HTMLDivElement;
  propertiesEditor.appendChild(editor);
}).catch(e => {
  console.error(e);
  alert(e.message);
});

window.onbeforeunload = (() => {
  if (!_saved) {
    return "Are you sure you want to close without saving?"
  }
});
