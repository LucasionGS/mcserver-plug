export class ConsoleInfo {
    constructor(data) {
        this.raw = false;
        /**
         * Use will be set with data from an executed command.
         */
        this.data = null;
        data += ""; // Ensure it's a string
        let m = (data).match(/\[?(\d+:\d+:\d+)\]?\s+\[(?:(.*?)\/)?(.*?)\]:?\s+(.*)/);
        if (m) {
            this.timeStamp = m[1];
            this.sender = m[2] || "Server";
            this.messageType = m[3];
            this.message = m[4];
        }
        else {
            let tmp = ConsoleInfo.create({
                sender: "IonMC",
                messageType: "WARN",
                // message: "Unable to parse: \"" + data + "\"",
                message: data,
                raw: true
            });
            this.timeStamp = tmp.timeStamp;
            this.sender = tmp.sender;
            this.messageType = tmp.messageType;
            this.message = tmp.message;
            this.raw = tmp.raw;
        }
    }
    static create(options) {
        var _a;
        if (typeof options == "string")
            options = {
                message: options,
            };
        let date = new Date();
        let info = new ConsoleInfo(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] [${options.sender || "IonMC"}/${options.messageType || "INFO"}]: ${options.message}`);
        info.raw = (_a = options.raw) !== null && _a !== void 0 ? _a : false;
        return info;
    }
    /**
     * Convert object into a string.
     */
    toString() {
        if (this.raw)
            return this.message;
        return `[${this.timeStamp}] [${this.sender}/${this.messageType}]: ${this.message}`;
    }
    /**
     * Convert object into an HTMLDivElement containing the data.
     */
    toHTML() {
        function escapeHtml(html) {
            return html
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
        if (!document) {
            throw new Error("No document found.");
        }
        ;
        let div = document.createElement("div");
        let color = "";
        switch (this.messageType) {
            case "WARN":
                color = "yellow";
                break;
            case "FATAL":
                color = "red";
                break;
            case "NODEJS":
                color = "lightblue";
                break;
        }
        div.innerHTML = `[${escapeHtml(this.timeStamp)}] [${escapeHtml(this.sender).bold()}/${escapeHtml(this.messageType).fontcolor(color)}]: ${escapeHtml(this.message).fontcolor(color)}`;
        return div;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uc29sZUluZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDb25zb2xlSW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxNQUFNLE9BQU8sV0FBVztJQUN0QixZQUFZLElBQVk7UUF3RnhCLFFBQUcsR0FBWSxLQUFLLENBQUM7UUFDckI7O1dBRUc7UUFDSCxTQUFJLEdBQVEsSUFBSSxDQUFDO1FBM0ZmLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUI7UUFDbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsRUFBRTtZQUNMLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQztZQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQTJCLENBQUM7WUFDbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckI7YUFDSTtZQUNILElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFdBQVcsRUFBRSxNQUFNO2dCQUNuQixnREFBZ0Q7Z0JBQ2hELE9BQU8sRUFBRSxJQUFJO2dCQUNiLEdBQUcsRUFBRSxJQUFJO2FBQ1YsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO1lBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7WUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQzNCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztTQUNwQjtJQUNILENBQUM7SUFJRCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQXFDOztRQUNqRCxJQUFJLE9BQU8sT0FBTyxJQUFJLFFBQVE7WUFBRSxPQUFPLEdBQUc7Z0JBQ3hDLE9BQU8sRUFBRSxPQUFPO2FBQ2pCLENBQUE7UUFDRCxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3RCLElBQUksSUFBSSxHQUFHLElBQUksV0FBVyxDQUN4QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxNQUFNLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxXQUFXLElBQUksTUFBTSxNQUFNLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FDckosQ0FBQztRQUVGLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBQSxPQUFPLENBQUMsR0FBRyxtQ0FBSSxLQUFLLENBQUM7UUFDaEMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsR0FBRztZQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNsQyxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsTUFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3JGLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU07UUFDSixTQUFTLFVBQVUsQ0FBQyxJQUFZO1lBQzlCLE9BQU8sSUFBSTtpQkFDUixPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztpQkFDdEIsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7aUJBQ3JCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO2lCQUNyQixPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztpQkFDdkIsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBRUQsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUN2QztRQUFBLENBQUM7UUFFRixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLFFBQVEsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUN4QixLQUFLLE1BQU07Z0JBQ1QsS0FBSyxHQUFHLFFBQVEsQ0FBQztnQkFDakIsTUFBTTtZQUVSLEtBQUssT0FBTztnQkFDVixLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNkLE1BQU07WUFFUixLQUFLLFFBQVE7Z0JBQ1gsS0FBSyxHQUFHLFdBQVcsQ0FBQztnQkFDcEIsTUFBTTtTQUNUO1FBQ0QsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3JMLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztDQVdGIn0=