/// <reference types="node" />
import * as fs from "fs";
import * as http from "http";
import { EventEmitter } from "events";
export interface Download {
    on(event: "start", listener: (res: http.IncomingMessage) => void): this;
    on(event: "data", listener: (buffer: Buffer, receivedBytes: number, totalBytes: number) => void): this;
    on(event: "finish", listener: () => void): this;
    emit(event: "start", res: http.IncomingMessage): boolean;
    emit(event: "data", buffer: Buffer, receivedBytes: number, totalBytes: number): boolean;
    emit(event: "finish"): boolean;
}
export declare class Download extends EventEmitter {
    url: string;
    constructor(url: string);
    constructor(url: string, dest: string);
    constructor(url: string, autoStart: boolean);
    constructor(url: string, dest: string, autoStart?: boolean);
    /**
     * Start the download manually if you disabled autostart when making the download instance.
     */
    start(): Promise<http.IncomingMessage>;
    get(options: http.RequestOptions | string | URL, callback?: (res: http.IncomingMessage) => void): http.ClientRequest;
    get(url: string | URL, options: http.RequestOptions, callback?: (res: http.IncomingMessage) => void): http.ClientRequest;
    dest: string;
    /**
     * Incoming message from the http request.
     */
    incomingMessage: http.IncomingMessage;
    stream?: fs.WriteStream;
    receivedBytes: number;
    totalBytes: number;
    /**
     * Contains the current progress in percentage from 0 to 100 as a float.
     */
    get downloadPercentage(): number;
}
