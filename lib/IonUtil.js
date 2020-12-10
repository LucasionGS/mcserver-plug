"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IonUtil;
(function (IonUtil) {
    function promise() {
        let data = {
            promise: null,
            resolve: null,
            reject: null
        };
        data.promise = new Promise((res, rej) => {
            data.resolve = res;
            data.reject = rej;
        });
        return data;
    }
    IonUtil.promise = promise;
    class ByteNumberBase {
        constructor(initial = 0, byteType) {
            this.byteType = "Bytes";
            if (typeof byteType == "string")
                this.byteType = byteType;
            let k;
            this.value = initial;
        }
        static get byte() { return 1; }
        static get kilobyte() { return 1024; }
        static get megabyte() { return Math.pow(1024, 2); }
        static get gigabyte() { return Math.pow(1024, 3); }
        toAutoString() {
            let bytes = this.toBytes();
            if (bytes.value < ByteNumberBase.kilobyte) {
                return bytes.value.toFixed(2) + " Bytes";
            }
            else if (bytes.value < ByteNumberBase.megabyte) {
                return bytes.toKB().value.toFixed(2) + " KB";
            }
            else if (bytes.value < ByteNumberBase.gigabyte) {
                return bytes.toMB().value.toFixed(2) + " MB";
            }
            else {
                return bytes.toGB().value.toFixed(2) + " GB";
            }
        }
        isBytes() {
            return this.byteType == "Bytes";
        }
        isKB() {
            return this.byteType == "KB";
        }
        isMB() {
            return this.byteType == "MB";
        }
        isGB() {
            return this.byteType == "GB";
        }
        toBytes() {
            switch (this.byteType) {
                case "Bytes":
                    return new Byte(this.value);
                case "KB":
                    return new Byte(this.value * 1024);
                case "MB":
                    return new Byte(this.value * Math.pow(1024, 2));
                case "GB":
                    return new Byte(this.value * Math.pow(1024, 3));
            }
        }
        toKB() {
            switch (this.byteType) {
                case "Bytes":
                    return new KiloByte(this.value / 1024);
                case "KB":
                    return new KiloByte(this.value);
                case "MB":
                    return new KiloByte(this.value * 1024);
                case "GB":
                    return new KiloByte(this.value * Math.pow(1024, 2));
            }
        }
        toMB() {
            switch (this.byteType) {
                case "Bytes":
                    return new MegaByte(this.value / Math.pow(1024, 2));
                case "KB":
                    return new MegaByte(this.value / 1024);
                case "MB":
                    return new MegaByte(this.value);
                case "GB":
                    return new MegaByte(this.value * 1024);
            }
        }
        toGB() {
            switch (this.byteType) {
                case "Bytes":
                    return new GigaByte(this.value / Math.pow(1024, 3));
                case "KB":
                    return new GigaByte(this.value / Math.pow(1024, 2));
                case "MB":
                    return new GigaByte(this.value / 1024);
                case "GB":
                    return new GigaByte(this.value);
            }
        }
    }
    class Byte extends ByteNumberBase {
        constructor(initial = 0) {
            super(initial, "Bytes");
        }
    }
    IonUtil.Byte = Byte;
    class KiloByte extends ByteNumberBase {
        constructor(initial = 0) {
            super(initial, "KB");
        }
    }
    IonUtil.KiloByte = KiloByte;
    class MegaByte extends ByteNumberBase {
        constructor(initial = 0) {
            super(initial, "MB");
        }
    }
    IonUtil.MegaByte = MegaByte;
    class GigaByte extends ByteNumberBase {
        constructor(initial = 0) {
            super(initial, "GB");
        }
    }
    IonUtil.GigaByte = GigaByte;
})(IonUtil || (IonUtil = {}));
exports.default = IonUtil;
