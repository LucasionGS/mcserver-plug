export type ConsoleInfoMessageType = "INFO" | "WARN" | "FATAL" | "NODEJS";
export interface ConsoleInfoTemplate {
  sender?: string,
  messageType?: ConsoleInfoMessageType,
  message: string,
  raw?: boolean
}

export class ConsoleInfo<CommandData = null> {
  constructor(data: string) {
    data += ""; // Ensure it's a string
    let m = (data).match(/\[?(\d+:\d+:\d+)\]?\s+\[(?:(.*?)\/)?(.*?)\]:?\s+(.*)/);
    if (m) {
      this.timeStamp = m[1];
      this.sender = m[2] || "Server";
      this.messageType = m[3] as ConsoleInfoMessageType;
      this.message = m[4];
    }
    else {
      let tmp = ConsoleInfo.create({
        sender: "IonMC",
        messageType: "INFO",
        message: data,
        raw: true
      })
      this.timeStamp = tmp.timeStamp;
      this.sender = tmp.sender;
      this.messageType = tmp.messageType;
      this.message = tmp.message;
      this.raw = tmp.raw;
    }
  }

  static create(message: string): ConsoleInfo;
  static create(options: ConsoleInfoTemplate): ConsoleInfo;
  static create(options: string | ConsoleInfoTemplate): ConsoleInfo {
    if (typeof options == "string") options = {
      message: options,
    }
    let date = new Date();
    let info = new ConsoleInfo(
      `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] [${options.sender || "IonMC"}/${options.messageType || "INFO"}]: ${options.message}`
    );

    info.raw = options.raw ?? false;
    return info;
  }

  /**
   * Convert object into a string.
   */
  toString() {
    if (this.raw) return this.message;
    return `[${this.timeStamp}] [${this.sender}/${this.messageType}]: ${this.message}`;
  }

  /**
   * Convert object into an HTMLDivElement containing the data.
   */
  toHTML() {
    function escapeHtml(html: string) {
      return html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    if (!document) {
      throw new Error("No document found.");
    };

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

  timeStamp: string;
  sender: string;
  messageType: ConsoleInfoMessageType;
  message: string;
  raw: boolean = false;
  /**
   * Use will be set with data from an executed command.
   */
  data: any = null;
}