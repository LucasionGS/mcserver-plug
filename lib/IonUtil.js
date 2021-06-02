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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW9uVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIklvblV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFVLE9BQU8sQ0FvSmhCO0FBcEpELFdBQVUsT0FBTztJQUNmLFNBQWdCLE9BQU87UUFDckIsSUFBSSxJQUFJLEdBQUc7WUFDVCxPQUFPLEVBQUcsSUFBbUI7WUFDN0IsT0FBTyxFQUFHLElBQTZDO1lBQ3ZELE1BQU0sRUFBRyxJQUErQjtTQUN6QyxDQUFBO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN6QyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztZQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQVplLGVBQU8sVUFZdEIsQ0FBQTtJQVdELE1BQU0sY0FBYztRQUNsQixZQUFZLE9BQU8sR0FBRyxDQUFDLEVBQUUsUUFBbUI7WUFhNUMsYUFBUSxHQUFjLE9BQU8sQ0FBQztZQVo1QixJQUFJLE9BQU8sUUFBUSxJQUFJLFFBQVE7Z0JBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDMUQsSUFBSSxDQUF3QixDQUFBO1lBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLENBQUM7UUFFRCxNQUFNLEtBQUssSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixNQUFNLEtBQUssUUFBUSxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLEtBQUssUUFBUSxLQUFLLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sS0FBSyxRQUFRLEtBQUssT0FBTyxJQUFJ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