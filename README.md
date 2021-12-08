# IonMC Utility tool for Minecraft server management.
## Installation
`OS: Windows / Linux`  
Install for the commandline
```
npm i -g ionmc
```

Install for use in node apps or server scripts
```
npm i ionmc
```

## Usage
### Quick start
You can install a server using the CLI:  
(You can run the command `ionmc` on it's own to get the full help list)  
Let's say you want to download a server into a subfolder in the current directory, call it "`my-server`" and you want the latest release version.
```
ionmc download my-server latest
```
This will download the `latest` minecraft version to use for your server.  
To run it use the `start` (or `run`) command:
```
ionmc start my-server
```
Now your server is running with default settings, just like running it normally.

### Customizing your server with IonMC
If you want to customize your server with different listeners for storing data or automatic command execution, you can create a `server.js` file in the same directory as your `server.jar` file. The `ionmc` commmand will always open the `server.js` file if it is present in the server directory.

In your `server.js`, you should start with something like this:
```js
const {Server} = require("ionmc");
// import {Server} from "ionmc"; // For TypeScript

let server = new Server("server.jar");

// Output all the server data to the console.
server.on("data", server.write);
// Exit the node process when the server has stopped.
server.on("stopped", () => process.exit());
```