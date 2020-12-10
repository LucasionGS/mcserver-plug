declare namespace IonUtil {
    export function promise<T = unknown>(): {
        promise: Promise<T>;
        resolve: (value?: T | PromiseLike<T>) => void;
        reject: (reason?: any) => void;
    };
    type ByteTypes = "Bytes" | "KB" | "MB" | "GB";
    class ByteNumberBase<ByteType extends ByteTypes = "Bytes"> {
        constructor(initial?: number, byteType?: ByteType);
        static get byte(): number;
        static get kilobyte(): number;
        static get megabyte(): number;
        static get gigabyte(): number;
        value: number;
        byteType: ByteTypes;
        toAutoString(): string;
        isBytes(): this is Byte;
        isKB(): this is KiloByte;
        isMB(): this is MegaByte;
        isGB(): this is GigaByte;
        toBytes(): Byte;
        toKB(): KiloByte;
        toMB(): MegaByte;
        toGB(): GigaByte;
    }
    export class Byte extends ByteNumberBase<"Bytes"> {
        constructor(initial?: number);
    }
    export class KiloByte extends ByteNumberBase<"KB"> {
        constructor(initial?: number);
    }
    export class MegaByte extends ByteNumberBase<"MB"> {
        constructor(initial?: number);
    }
    export class GigaByte extends ByteNumberBase<"GB"> {
        constructor(initial?: number);
    }
    export {};
}
export default IonUtil;
