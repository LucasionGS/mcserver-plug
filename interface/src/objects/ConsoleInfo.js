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
                messageType: "INFO",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uc29sZUluZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDb25zb2xlSW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxNQUFNLE9BQU8sV0FBVztJQUN0QixZQUFZLElBQVk7UUF1RnhCLFFBQUcsR0FBWSxLQUFLLENBQUM7UUFDckI7O1dBRUc7UUFDSCxTQUFJLEdBQVEsSUFBSSxDQUFDO1FBMUZmLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUI7UUFDbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsRUFBRTtZQUNMLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQztZQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQTJCLENBQUM7WUFDbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckI7YUFDSTtZQUNILElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFdBQVcsRUFBRSxNQUFNO2dCQUNuQixPQUFPLEVBQUUsSUFBSTtnQkFDYixHQUFHLEVBQUUsSUFBSTthQUNWLENBQUMsQ0FBQTtZQUNGLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO1lBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUMzQixJQUFJLENBQUMsR0FB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