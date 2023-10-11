/* eslint-disable */
import * as Long from "long";
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import { SignatureInfo } from "../bridge/event";

export const protobufPackage = "dflow.bridge";

export interface WithdrawTxMap {
  withdrawId: number;
  /** Base64-encoded withdrawal message */
  message: string;
  signatures: SignatureInfo[];
  src: string;
  /** The Base58-encoded SPL token account receiving the funds */
  dst: string;
  /** The Base58-encoded Solana wallet that owns the dst account */
  dstOwner: string;
  amt: number;
}

const baseWithdrawTxMap: object = {
  withdrawId: 0,
  message: "",
  src: "",
  dst: "",
  dstOwner: "",
  amt: 0,
};

export const WithdrawTxMap = {
  encode(message: WithdrawTxMap, writer: Writer = Writer.create()): Writer {
    if (message.withdrawId !== 0) {
      writer.uint32(8).uint64(message.withdrawId);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    for (const v of message.signatures) {
      SignatureInfo.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.src !== "") {
      writer.uint32(34).string(message.src);
    }
    if (message.dst !== "") {
      writer.uint32(42).string(message.dst);
    }
    if (message.dstOwner !== "") {
      writer.uint32(50).string(message.dstOwner);
    }
    if (message.amt !== 0) {
      writer.uint32(56).uint64(message.amt);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): WithdrawTxMap {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWithdrawTxMap } as WithdrawTxMap;
    message.signatures = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdrawId = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.message = reader.string();
          break;
        case 3:
          message.signatures.push(
            SignatureInfo.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.src = reader.string();
          break;
        case 5:
          message.dst = reader.string();
          break;
        case 6:
          message.dstOwner = reader.string();
          break;
        case 7:
          message.amt = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WithdrawTxMap {
    const message = { ...baseWithdrawTxMap } as WithdrawTxMap;
    message.signatures = [];
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = Number(object.withdrawId);
    } else {
      message.withdrawId = 0;
    }
    if (object.message !== undefined && object.message !== null) {
      message.message = String(object.message);
    } else {
      message.message = "";
    }
    if (object.signatures !== undefined && object.signatures !== null) {
      for (const e of object.signatures) {
        message.signatures.push(SignatureInfo.fromJSON(e));
      }
    }
    if (object.src !== undefined && object.src !== null) {
      message.src = String(object.src);
    } else {
      message.src = "";
    }
    if (object.dst !== undefined && object.dst !== null) {
      message.dst = String(object.dst);
    } else {
      message.dst = "";
    }
    if (object.dstOwner !== undefined && object.dstOwner !== null) {
      message.dstOwner = String(object.dstOwner);
    } else {
      message.dstOwner = "";
    }
    if (object.amt !== undefined && object.amt !== null) {
      message.amt = Number(object.amt);
    } else {
      message.amt = 0;
    }
    return message;
  },

  toJSON(message: WithdrawTxMap): unknown {
    const obj: any = {};
    message.withdrawId !== undefined && (obj.withdrawId = message.withdrawId);
    message.message !== undefined && (obj.message = message.message);
    if (message.signatures) {
      obj.signatures = message.signatures.map((e) =>
        e ? SignatureInfo.toJSON(e) : undefined
      );
    } else {
      obj.signatures = [];
    }
    message.src !== undefined && (obj.src = message.src);
    message.dst !== undefined && (obj.dst = message.dst);
    message.dstOwner !== undefined && (obj.dstOwner = message.dstOwner);
    message.amt !== undefined && (obj.amt = message.amt);
    return obj;
  },

  fromPartial(object: DeepPartial<WithdrawTxMap>): WithdrawTxMap {
    const message = { ...baseWithdrawTxMap } as WithdrawTxMap;
    message.signatures = [];
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = object.withdrawId;
    } else {
      message.withdrawId = 0;
    }
    if (object.message !== undefined && object.message !== null) {
      message.message = object.message;
    } else {
      message.message = "";
    }
    if (object.signatures !== undefined && object.signatures !== null) {
      for (const e of object.signatures) {
        message.signatures.push(SignatureInfo.fromPartial(e));
      }
    }
    if (object.src !== undefined && object.src !== null) {
      message.src = object.src;
    } else {
      message.src = "";
    }
    if (object.dst !== undefined && object.dst !== null) {
      message.dst = object.dst;
    } else {
      message.dst = "";
    }
    if (object.dstOwner !== undefined && object.dstOwner !== null) {
      message.dstOwner = object.dstOwner;
    } else {
      message.dstOwner = "";
    }
    if (object.amt !== undefined && object.amt !== null) {
      message.amt = object.amt;
    } else {
      message.amt = 0;
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
