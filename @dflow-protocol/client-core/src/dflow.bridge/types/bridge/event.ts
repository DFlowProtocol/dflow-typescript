/* eslint-disable */
import * as Long from "long";
import { util, configure, Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.bridge";

export interface InitWithdrawCeremony {
  type: string;
  /** The bech32 DFlow public key of the withdrawer */
  src: string;
  /** Base58 encoded destination public key on Solana */
  dst: string;
  /** Amount to withdraw */
  amt: number;
  /** The generated withdraw ID for this withdrawal */
  wid: number;
}

export interface SignatureInfo {
  /** The bech32 encoded DFlow public key of the signatory server */
  ssPublicKey: string;
  /** The base58 encoded Solana public key of the signatory server */
  ed25519PublicKey: string;
  /** A base58 encoded signature from the Solana private key of the signatory server */
  signature: string;
}

const baseInitWithdrawCeremony: object = {
  type: "",
  src: "",
  dst: "",
  amt: 0,
  wid: 0,
};

export const InitWithdrawCeremony = {
  encode(
    message: InitWithdrawCeremony,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.src !== "") {
      writer.uint32(18).string(message.src);
    }
    if (message.dst !== "") {
      writer.uint32(26).string(message.dst);
    }
    if (message.amt !== 0) {
      writer.uint32(32).uint64(message.amt);
    }
    if (message.wid !== 0) {
      writer.uint32(40).uint64(message.wid);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): InitWithdrawCeremony {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseInitWithdrawCeremony } as InitWithdrawCeremony;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.string();
          break;
        case 2:
          message.src = reader.string();
          break;
        case 3:
          message.dst = reader.string();
          break;
        case 4:
          message.amt = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.wid = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InitWithdrawCeremony {
    const message = { ...baseInitWithdrawCeremony } as InitWithdrawCeremony;
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = "";
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
    if (object.amt !== undefined && object.amt !== null) {
      message.amt = Number(object.amt);
    } else {
      message.amt = 0;
    }
    if (object.wid !== undefined && object.wid !== null) {
      message.wid = Number(object.wid);
    } else {
      message.wid = 0;
    }
    return message;
  },

  toJSON(message: InitWithdrawCeremony): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.src !== undefined && (obj.src = message.src);
    message.dst !== undefined && (obj.dst = message.dst);
    message.amt !== undefined && (obj.amt = message.amt);
    message.wid !== undefined && (obj.wid = message.wid);
    return obj;
  },

  fromPartial(object: DeepPartial<InitWithdrawCeremony>): InitWithdrawCeremony {
    const message = { ...baseInitWithdrawCeremony } as InitWithdrawCeremony;
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = "";
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
    if (object.amt !== undefined && object.amt !== null) {
      message.amt = object.amt;
    } else {
      message.amt = 0;
    }
    if (object.wid !== undefined && object.wid !== null) {
      message.wid = object.wid;
    } else {
      message.wid = 0;
    }
    return message;
  },
};

const baseSignatureInfo: object = {
  ssPublicKey: "",
  ed25519PublicKey: "",
  signature: "",
};

export const SignatureInfo = {
  encode(message: SignatureInfo, writer: Writer = Writer.create()): Writer {
    if (message.ssPublicKey !== "") {
      writer.uint32(10).string(message.ssPublicKey);
    }
    if (message.ed25519PublicKey !== "") {
      writer.uint32(18).string(message.ed25519PublicKey);
    }
    if (message.signature !== "") {
      writer.uint32(26).string(message.signature);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SignatureInfo {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSignatureInfo } as SignatureInfo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ssPublicKey = reader.string();
          break;
        case 2:
          message.ed25519PublicKey = reader.string();
          break;
        case 3:
          message.signature = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignatureInfo {
    const message = { ...baseSignatureInfo } as SignatureInfo;
    if (object.ssPublicKey !== undefined && object.ssPublicKey !== null) {
      message.ssPublicKey = String(object.ssPublicKey);
    } else {
      message.ssPublicKey = "";
    }
    if (
      object.ed25519PublicKey !== undefined &&
      object.ed25519PublicKey !== null
    ) {
      message.ed25519PublicKey = String(object.ed25519PublicKey);
    } else {
      message.ed25519PublicKey = "";
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = String(object.signature);
    } else {
      message.signature = "";
    }
    return message;
  },

  toJSON(message: SignatureInfo): unknown {
    const obj: any = {};
    message.ssPublicKey !== undefined &&
      (obj.ssPublicKey = message.ssPublicKey);
    message.ed25519PublicKey !== undefined &&
      (obj.ed25519PublicKey = message.ed25519PublicKey);
    message.signature !== undefined && (obj.signature = message.signature);
    return obj;
  },

  fromPartial(object: DeepPartial<SignatureInfo>): SignatureInfo {
    const message = { ...baseSignatureInfo } as SignatureInfo;
    if (object.ssPublicKey !== undefined && object.ssPublicKey !== null) {
      message.ssPublicKey = object.ssPublicKey;
    } else {
      message.ssPublicKey = "";
    }
    if (
      object.ed25519PublicKey !== undefined &&
      object.ed25519PublicKey !== null
    ) {
      message.ed25519PublicKey = object.ed25519PublicKey;
    } else {
      message.ed25519PublicKey = "";
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = object.signature;
    } else {
      message.signature = "";
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
