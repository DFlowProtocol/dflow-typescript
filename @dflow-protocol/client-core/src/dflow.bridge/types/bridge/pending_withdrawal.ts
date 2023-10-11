/* eslint-disable */
import * as Long from "long";
import { util, configure, Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.bridge";

export interface PendingWithdrawal {
  withdrawId: number;
}

const basePendingWithdrawal: object = { withdrawId: 0 };

export const PendingWithdrawal = {
  encode(message: PendingWithdrawal, writer: Writer = Writer.create()): Writer {
    if (message.withdrawId !== 0) {
      writer.uint32(8).uint64(message.withdrawId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PendingWithdrawal {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePendingWithdrawal } as PendingWithdrawal;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdrawId = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PendingWithdrawal {
    const message = { ...basePendingWithdrawal } as PendingWithdrawal;
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = Number(object.withdrawId);
    } else {
      message.withdrawId = 0;
    }
    return message;
  },

  toJSON(message: PendingWithdrawal): unknown {
    const obj: any = {};
    message.withdrawId !== undefined && (obj.withdrawId = message.withdrawId);
    return obj;
  },

  fromPartial(object: DeepPartial<PendingWithdrawal>): PendingWithdrawal {
    const message = { ...basePendingWithdrawal } as PendingWithdrawal;
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = object.withdrawId;
    } else {
      message.withdrawId = 0;
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
