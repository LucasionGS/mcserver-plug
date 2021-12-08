namespace IonUtil {
  export function promise<T = unknown>() {
    let data = {
      promise: (null as Promise<T>),
      resolve: (null as (value?: T | PromiseLike<T>) => void),
      reject: (null as (reason?: any) => void)
    }
    data.promise = new Promise<T>((res, rej) => {
      data.resolve = res;
      data.reject = rej;
    });

    return data;
  }
  
  interface ByteMap {
    "Bytes": Byte
    "KB": KiloByte
    "MB": MegaByte
    "GB": GigaByte
  }
  
  type ByteTypes = keyof ByteMap;
  
  class ByteNumberBase<ByteType extends ByteTypes = "Bytes"> {
    constructor(initial = 0, byteType?: ByteType) {
      if (typeof byteType == "string") this.byteType = byteType;
      let k: HTMLElementTagNameMap
      this.value = initial;
    }

    static get byte() { return 1; }
    static get kilobyte() { return 1024; }
    static get megabyte() { return Math.pow(1024, 2); }
    static get gigabyte() { return Math.pow(1024, 3); }

    value: number;
  
    byteType: ByteTypes = "Bytes";

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

    isBytes(): this is Byte {
      return this.byteType == "Bytes";
    }

    isKB(): this is KiloByte {
      return this.byteType == "KB";
    }

    isMB(): this is MegaByte {
      return this.byteType == "MB";
    }

    isGB(): this is GigaByte {
      return this.byteType == "GB";
    }

    toBytes(): Byte {
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
  
    toKB(): KiloByte {
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
    
    toMB(): MegaByte {
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
    
    toGB(): GigaByte {
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

  export class Byte extends ByteNumberBase<"Bytes">{
    constructor(initial = 0) {
      super(initial, "Bytes");
    }
  }

  export class KiloByte extends ByteNumberBase<"KB">{
    constructor(initial = 0) {
      super(initial, "KB");
    }
  }

  export class MegaByte extends ByteNumberBase<"MB">{
    constructor(initial = 0) {
      super(initial, "MB");
    }
  }

  export class GigaByte extends ByteNumberBase<"GB">{
    constructor(initial = 0) {
      super(initial, "GB");
    }
  }
}


export default IonUtil;