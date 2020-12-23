import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as path from "path";
import { EventEmitter } from "events";

export interface Download {
  on(event: "start", listener: (res: http.IncomingMessage) => void): this;
  on(event: "data", listener: (buffer: Buffer, receivedBytes: number, totalBytes: number) => void): this;
  on(event: "finish", listener: () => void): this;
  
  emit(event: "start", res: http.IncomingMessage): boolean;
  emit(event: "data", buffer: Buffer, receivedBytes: number, totalBytes: number): boolean;
  emit(event: "finish"): boolean;
}

export class Download extends EventEmitter {
  constructor(url: string);
  constructor(url: string, dest: string);
  constructor(url: string, autoStart: boolean);
  constructor(url: string, dest: string, autoStart?: boolean);
  constructor(public url: string, dest?: string | boolean, autoStart?: boolean) {
    super({
      "captureRejections": true
    });

    if (typeof dest === "boolean") {
      autoStart = dest;
      dest = undefined;
    }
    if (autoStart === undefined) autoStart = true;

    if (/^http:\/\//.test(url)) {
      this.get = function(a: any, b: any) {
        return http.get(a, b);
      };
    }
    else if (/^https:\/\//.test(url)) {
      this.get = function(a: any, b: any) {
        return https.get(a, b);
      };
    }
    else {
      throw "Protocol needs to be either http:// or https://";
    }
    if (typeof dest == "string") {
      this.dest = dest;
    }
    if (autoStart == true) this.start();
  }

  /**
   * Start the download manually if you disabled autostart when making the download instance.
   */
  async start() {
    let resolve: (value?: http.IncomingMessage | PromiseLike<http.IncomingMessage>) => void;
    let p = new Promise<http.IncomingMessage>(res => resolve = res);
    this.get(this.url, res => {
      this.incomingMessage = res;
      this.totalBytes = +res.headers["content-length"];
      
      resolve(res); this.emit("start", res);
      if (typeof this.dest == "string") {
        let dir = path.dirname(this.dest);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        var stream = fs.createWriteStream(this.dest);
        this.stream = stream;
        res.pipe(stream);
      }

      res.on("data", (buffer: Buffer) => {
        this.receivedBytes += buffer.byteLength;
        this.emit("data", buffer, this.receivedBytes, this.totalBytes);
      });

      res.on("end", () => {
        this.emit("finish");
      });
    });
    return p;
  }

  get(options: http.RequestOptions | string | URL, callback?: (res: http.IncomingMessage) => void): http.ClientRequest;
  get(url: string | URL, options: http.RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest;
  get(a: any, b: any): http.ClientRequest { return; }

  dest: string;

  /**
   * Incoming message from the http request.
   */
  incomingMessage: http.IncomingMessage;
  stream?: fs.WriteStream;

  receivedBytes: number = 0;
  totalBytes: number;

  /**
   * Contains the current progress in percentage from 0 to 100 as a float.
   */
  get downloadPercentage() {
    return (this.receivedBytes / this.totalBytes) * 100;
  }
}