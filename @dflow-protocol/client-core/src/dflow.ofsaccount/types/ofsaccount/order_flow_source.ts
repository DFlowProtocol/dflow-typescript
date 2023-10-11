/* eslint-disable */
import * as Long from "long";
import { util, configure, Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.ofsaccount";

export interface OrderFlowSource {
  publicKey: string;
  flowEndorsementKey1: string;
  flowEndorsementKey2: string;
  extensions: string;
  auctions: number[];
}

const baseOrderFlowSource: object = {
  publicKey: "",
  flowEndorsementKey1: "",
  flowEndorsementKey2: "",
  extensions: "",
  auctions: 0,
};

export const OrderFlowSource = {
  encode(message: OrderFlowSource, writer: Writer = Writer.create()): Writer {
    if (message.publicKey !== "") {
      writer.uint32(10).string(message.publicKey);
    }
    if (message.flowEndorsementKey1 !== "") {
      writer.uint32(18).string(message.flowEndorsementKey1);
    }
    if (message.flowEndorsementKey2 !== "") {
      writer.uint32(26).string(message.flowEndorsementKey2);
    }
    if (message.extensions !== "") {
      writer.uint32(34).string(message.extensions);
    }
    writer.uint32(42).fork();
    for (const v of message.auctions) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): OrderFlowSource {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseOrderFlowSource } as OrderFlowSource;
    message.auctions = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.publicKey = reader.string();
          break;
        case 2:
          message.flowEndorsementKey1 = reader.string();
          break;
        case 3:
          message.flowEndorsementKey2 = reader.string();
          break;
        case 4:
          message.extensions = reader.string();
          break;
        case 5:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.auctions.push(longToNumber(reader.uint64() as Long));
            }
          } else {
            message.auctions.push(longToNumber(reader.uint64() as Long));
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OrderFlowSource {
    const message = { ...baseOrderFlowSource } as OrderFlowSource;
    message.auctions = [];
    if (object.publicKey !== undefined && object.publicKey !== null) {
      message.publicKey = String(object.publicKey);
    } else {
      message.publicKey = "";
    }
    if (
      object.flowEndorsementKey1 !== undefined &&
      object.flowEndorsementKey1 !== null
    ) {
      message.flowEndorsementKey1 = String(object.flowEndorsementKey1);
    } else {
      message.flowEndorsementKey1 = "";
    }
    if (
      object.flowEndorsementKey2 !== undefined &&
      object.flowEndorsementKey2 !== null
    ) {
      message.flowEndorsementKey2 = String(object.flowEndorsementKey2);
    } else {
      message.flowEndorsementKey2 = "";
    }
    if (object.extensions !== undefined && object.extensions !== null) {
      message.extensions = String(object.extensions);
    } else {
      message.extensions = "";
    }
    if (object.auctions !== undefined && object.auctions !== null) {
      for (const e of object.auctions) {
        message.auctions.push(Number(e));
      }
    }
    return message;
  },

  toJSON(message: OrderFlowSource): unknown {
    const obj: any = {};
    message.publicKey !== undefined && (obj.publicKey = message.publicKey);
    message.flowEndorsementKey1 !== undefined &&
      (obj.flowEndorsementKey1 = message.flowEndorsementKey1);
    message.flowEndorsementKey2 !== undefined &&
      (obj.flowEndorsementKey2 = message.flowEndorsementKey2);
    message.extensions !== undefined && (obj.extensions = message.extensions);
    if (message.auctions) {
      obj.auctions = message.auctions.map((e) => e);
    } else {
      obj.auctions = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<OrderFlowSource>): OrderFlowSource {
    const message = { ...baseOrderFlowSource } as OrderFlowSource;
    message.auctions = [];
    if (object.publicKey !== undefined && object.publicKey !== null) {
      message.publicKey = object.publicKey;
    } else {
      message.publicKey = "";
    }
    if (
      object.flowEndorsementKey1 !== undefined &&
      object.flowEndorsementKey1 !== null
    ) {
      message.flowEndorsementKey1 = object.flowEndorsementKey1;
    } else {
      message.flowEndorsementKey1 = "";
    }
    if (
      object.flowEndorsementKey2 !== undefined &&
      object.flowEndorsementKey2 !== null
    ) {
      message.flowEndorsementKey2 = object.flowEndorsementKey2;
    } else {
      message.flowEndorsementKey2 = "";
    }
    if (object.extensions !== undefined && object.extensions !== null) {
      message.extensions = object.extensions;
    } else {
      message.extensions = "";
    }
    if (object.auctions !== undefined && object.auctions !== null) {
      for (const e of object.auctions) {
        message.auctions.push(e);
      }
    }
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
