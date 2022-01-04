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
let _saved = true;
function getProperties(name) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch("/api/server.properties?token=" + getToken() + "&name=" + name, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json());
    });
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
};
const propertyPrettyNames = {
    "motd": "Message of the Day",
    "pvp": "PvP",
    "rcon.port": "Rcon port",
    "rcon.password": "Rcon password",
    "query.port": "Query port",
};
const propertyDescriptions = {
    "motd": "The message being displayed to\nplayers in the server explorer.",
    "pvp": "Whether or not players can hurt each other",
    "rcon.port": "The port to use for Rcon",
    "rcon.password": "The password to use for Rcon",
    "query.port": "The port to use for Query",
    "server-ip": "The IP address of the server. Set this to enforce a specific IP address.",
    "white-list": "Whether or not players who can join is exclusive to the a whitelist.",
    "hardcore": "Whether or not players are banned forever when they die.",
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
];
function getPropertyPrettyName(name) {
    if (name in propertyPrettyNames) {
        return propertyPrettyNames[name];
    }
    return name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => {
        return str.toUpperCase();
    }).replace(/-/g, " ");
}
function createPropertiesEditor() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const params = new URLSearchParams(window.location.search);
        const serverName = params.get("server");
        if (!serverName)
            throw new Error("No server name specified.");
        const properties = yield getProperties(serverName); // Use a dummy server name to get the properties for testing
        const editor = document.createElement("form");
        editor.classList.add("properties-editor");
        const keys = Object.keys(properties).sort();
        const categories = {};
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
            tdKey.title = (_a = propertyDescriptions[key]) !== null && _a !== void 0 ? _a : key;
            tdKey.appendChild(label);
            const tdValue = document.createElement("td");
            const tdComment = document.createElement("td");
            const typeofValue = typeof properties[key];
            if (key in selectFields) {
                const select = document.createElement("select");
                select.classList.add("properties-editor-input");
                select.name = key;
                select.id = key;
                const options = selectFields[key];
                for (const option of options) {
                    const optionElement = document.createElement("option");
                    optionElement.value = option;
                    optionElement.innerHTML = getPropertyPrettyName(option);
                    optionElement.title = option;
                    select.appendChild(optionElement);
                }
                const selectValue = properties[key];
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
                    input.value = properties[key];
                }
                else if (typeofValue === "number") {
                    input.type = "number";
                    input.valueAsNumber = properties[key];
                }
                else if (typeofValue === "boolean") {
                    input.type = "checkbox";
                    input.checked = properties[key];
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
            const table = categories[(_c = (_b = propertiesToCategory.find(c => c.properties.includes(key))) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "Other"];
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
            const data = {};
            for (const key of keys) {
                const input = e.target.querySelector(`[name="${key}"]`);
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
    });
}
createPropertiesEditor().then(editor => {
    const propertiesEditor = document.getElementById("properties-editor");
    propertiesEditor.appendChild(editor);
}).catch(e => {
    console.error(e);
    alert(e.message);
});
window.onbeforeunload = (() => {
    if (!_saved) {
        return "Are you sure you want to close without saving?";
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyUHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcnZlclByb3BlcnRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUd0QyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFFbEIsU0FBZSxhQUFhLENBQUMsSUFBWTs7UUFDdkMsT0FBTyxLQUFLLENBQUMsK0JBQStCLEdBQUcsUUFBUSxFQUFFLEdBQUcsUUFBUSxHQUFHLElBQUksRUFBRTtZQUMzRSxNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQUUsa0JBQWtCO2FBQ25DO1NBQ0YsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLENBQUM7Q0FBQTtBQUNELE1BQU0sWUFBWSxHQUFHO0lBQ25CLFFBQVEsRUFBRTtRQUNSLFVBQVU7UUFDVixVQUFVO1FBQ1YsV0FBVztRQUNYLFdBQVc7S0FDWjtJQUNELFVBQVUsRUFBRTtRQUNWLFVBQVU7UUFDVixNQUFNO1FBQ04sUUFBUTtRQUNSLE1BQU07S0FDUDtDQUNGLENBQUE7QUFFRCxNQUFNLG1CQUFtQixHQUE4QjtJQUNyRCxNQUFNLEVBQUUsb0JBQW9CO0lBQzVCLEtBQUssRUFBRSxLQUFLO0lBQ1osV0FBVyxFQUFFLFdBQVc7SUFDeEIsZUFBZSxFQUFFLGVBQWU7SUFDaEMsWUFBWSxFQUFFLFlBQVk7Q0FDM0IsQ0FBQztBQUVGLE1BQU0sb0JBQW9CLEdBQThCO0lBQ3RELE1BQU0sRUFBRSxpRUFBaUU7SUFDekUsS0FBSyxFQUFFLDRDQUE0QztJQUNuRCxXQUFXLEVBQUUsMEJBQTBCO0lBQ3ZDLGVBQWUsRUFBRSw4QkFBOEI7SUFDL0MsWUFBWSxFQUFFLDJCQUEyQjtJQUN6QyxXQUFXLEVBQUUsMEVBQTBFO0lB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