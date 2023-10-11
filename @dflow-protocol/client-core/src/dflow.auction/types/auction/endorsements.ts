/* eslint-disable */
import * as Long from "long";
import { util, configure, Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.auction";

export interface EndorsementInfo {
  id: number;
  expirationTimeUTC: number;
}

export interface Endorsements {
  ofsPublicKey: string;
  endorsements: EndorsementInfo[];
}

const baseEndorsementInfo: object = { id: 0, expirationTimeUTC: 0 };

export const EndorsementInfo = {
  encode(message: EndorsementInfo, writer: Writer = Writer.create()): Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id);
    }
    if (message.expirationTimeUTC !== 0) {
      writer.uint32(16).int64(message.expirationTimeUTC);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): EndorsementInfo {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEndorsementInfo } as EndorsementInfo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.expirationTimeUTC = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EndorsementInfo {
    const message = { ...baseEndorsementInfo } as EndorsementInfo;
    if (object.id !== undefined && object.id !== null) {
      message.id = Number(object.id);
    } else {
      message.id = 0;
    }
    if (
      object.expirationTimeUTC !== undefined &&
      object.expirationTimeUTC !== null
    ) {
      message.expirationTimeUTC = Number(object.expirationTimeUTC);
    } else {
      message.expirationTimeUTC = 0;
    }
    return message;
  },

  toJSON(message: EndorsementInfo): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.expirationTimeUTC !== undefined &&
      (obj.expirationTimeUTC = message.expirationTimeUTC);
    return obj;
  },

  fromPartial(object: DeepPartial<EndorsementInfo>): EndorsementInfo {
    const message = { ...baseEndorsementInfo } as EndorsementInfo;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = 0;
    }
    if (
      object.expirationTimeUTC !== undefined &&
      object.expirationTimeUTC !== null
    ) {
      message.expirationTimeUTC = object.expirationTimeUTC;
    } else {
      message.expirationTimeUTC = 0;
    }
    return message;
  },
};

const baseEndorsements: object = { ofsPublicKey: "" };

export const Endorsements = {
  encode(message: Endorsements, writer: Writer = Writer.create()): Writer {
    if (message.ofsPublicKey !== "") {
      writer.uint32(10).string(message.ofsPublicKey);
    }
    for (const v of message.endorsements) {
      EndorsementInfo.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Endorsements {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEndorsements } as Endorsements;
    message.endorsements = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ofsPublicKey = reader.string();
          break;
        case 2:
          message.endorsements.push(
            EndorsementInfo.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Endorsements {
    const message = { ...baseEndorsements } as Endorsements;
    message.endorsements = [];
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = String(object.ofsPublicKey);
    } else {
      message.ofsPublicKey = "";
    }
    if (object.endorsements !== undefined && object.endorsements !== null) {
      for (const e of object.endorsements) {
        message.endorsements.push(EndorsementInfo.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: Endorsements): unknown {
    const obj: any = {};
    message.ofsPublicKey !== undefined &&
      (obj.ofsPublicKey = message.ofsPublicKey);
    if (message.endorsements) {
      obj.endorsements = message.endorsements.map((e) =>
        e ? EndorsementInfo.toJSON(e) : undefined
      );
    } else {
      obj.endorsements = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Endorsements>): Endorsements {
    const message = { ...baseEndorsements } as Endorsements;
    message.endorsements = [];
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = object.ofsPublicKey;
    } else {
      message.ofsPublicKey = "";
    }
    if (object.endorsements !== undefined && object.endorsements !== null) {
      for (const e of object.endorsements) {
        message.endorsements.push(EndorsementInfo.fromPartial(e));
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
