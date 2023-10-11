/* eslint-disable */
import * as Long from "long";
import { util, configure, Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.auction";

/** Params defines the parameters for the module. */
export interface Params {
  auctionCost: number;
  /** The minimum allowed max delivery period in milliseconds */
  minDeliveryPeriod: number;
  /**
   * The maximum allowed endorsement expiration time in seconds relative to when deliver notional is called.
   * Endorsements should not be issued with longer expiration times than this.
   */
  endorsementMaxRelativeExpiration: number;
  /**
   * A grace period in seconds added to the maximum allowed expiration time when checking the
   * maximum expiration time of an endorsement. This can be used to ensure that endorsements are not
   * wrongly rejected due to lag in block timestamps.
   */
  endorsementMaxRelativeExpirationGrace: number;
}

const baseParams: object = {
  auctionCost: 0,
  minDeliveryPeriod: 0,
  endorsementMaxRelativeExpiration: 0,
  endorsementMaxRelativeExpirationGrace: 0,
};

export const Params = {
  encode(message: Params, writer: Writer = Writer.create()): Writer {
    if (message.auctionCost !== 0) {
      writer.uint32(8).uint64(message.auctionCost);
    }
    if (message.minDeliveryPeriod !== 0) {
      writer.uint32(16).int64(message.minDeliveryPeriod);
    }
    if (message.endorsementMaxRelativeExpiration !== 0) {
      writer.uint32(24).int64(message.endorsementMaxRelativeExpiration);
    }
    if (message.endorsementMaxRelativeExpirationGrace !== 0) {
      writer.uint32(32).int64(message.endorsementMaxRelativeExpirationGrace);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseParams } as Params;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.auctionCost = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.minDeliveryPeriod = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.endorsementMaxRelativeExpiration = longToNumber(
            reader.int64() as Long
          );
          break;
        case 4:
          message.endorsementMaxRelativeExpirationGrace = longToNumber(
            reader.int64() as Long
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Params {
    const message = { ...baseParams } as Params;
    if (object.auctionCost !== undefined && object.auctionCost !== null) {
      message.auctionCost = Number(object.auctionCost);
    } else {
      message.auctionCost = 0;
    }
    if (
      object.minDeliveryPeriod !== undefined &&
      object.minDeliveryPeriod !== null
    ) {
      message.minDeliveryPeriod = Number(object.minDeliveryPeriod);
    } else {
      message.minDeliveryPeriod = 0;
    }
    if (
      object.endorsementMaxRelativeExpiration !== undefined &&
      object.endorsementMaxRelativeExpiration !== null
    ) {
      message.endorsementMaxRelativeExpiration = Number(
        object.endorsementMaxRelativeExpiration
      );
    } else {
      message.endorsementMaxRelativeExpiration = 0;
    }
    if (
      object.endorsementMaxRelativeExpirationGrace !== undefined &&
      object.endorsementMaxRelativeExpirationGrace !== null
    ) {
      message.endorsementMaxRelativeExpirationGrace = Number(
        object.endorsementMaxRelativeExpirationGrace
      );
    } else {
      message.endorsementMaxRelativeExpirationGrace = 0;
    }
    return message;
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    message.auctionCost !== undefined &&
      (obj.auctionCost = message.auctionCost);
    message.minDeliveryPeriod !== undefined &&
      (obj.minDeliveryPeriod = message.minDeliveryPeriod);
    message.endorsementMaxRelativeExpiration !== undefined &&
      (obj.endorsementMaxRelativeExpiration =
        message.endorsementMaxRelativeExpiration);
    message.endorsementMaxRelativeExpirationGrace !== undefined &&
      (obj.endorsementMaxRelativeExpirationGrace =
        message.endorsementMaxRelativeExpirationGrace);
    return obj;
  },

  fromPartial(object: DeepPartial<Params>): Params {
    const message = { ...baseParams } as Params;
    if (object.auctionCost !== undefined && object.auctionCost !== null) {
      message.auctionCost = object.auctionCost;
    } else {
      message.auctionCost = 0;
    }
    if (
      object.minDeliveryPeriod !== undefined &&
      object.minDeliveryPeriod !== null
    ) {
      message.minDeliveryPeriod = object.minDeliveryPeriod;
    } else {
      message.minDeliveryPeriod = 0;
    }
    if (
      object.endorsementMaxRelativeExpiration !== undefined &&
      object.endorsementMaxRelativeExpiration !== null
    ) {
      message.endorsementMaxRelativeExpiration =
        object.endorsementMaxRelativeExpiration;
    } else {
      message.endorsementMaxRelativeExpiration = 0;
    }
    if (
      object.endorsementMaxRelativeExpirationGrace !== undefined &&
      object.endorsementMaxRelativeExpirationGrace !== null
    ) {
      message.endorsementMaxRelativeExpirationGrace =
        object.endorsementMaxRelativeExpirationGrace;
    } else {
      message.endorsementMaxRelativeExpirationGrace = 0;
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
