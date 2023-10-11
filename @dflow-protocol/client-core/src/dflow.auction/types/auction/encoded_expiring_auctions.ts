/* eslint-disable */
import { Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.auction";

export interface EncodedExpiringAuctions {
  encoded: string;
}

const baseEncodedExpiringAuctions: object = { encoded: "" };

export const EncodedExpiringAuctions = {
  encode(
    message: EncodedExpiringAuctions,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.encoded !== "") {
      writer.uint32(10).string(message.encoded);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): EncodedExpiringAuctions {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseEncodedExpiringAuctions,
    } as EncodedExpiringAuctions;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.encoded = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EncodedExpiringAuctions {
    const message = {
      ...baseEncodedExpiringAuctions,
    } as EncodedExpiringAuctions;
    if (object.encoded !== undefined && object.encoded !== null) {
      message.encoded = String(object.encoded);
    } else {
      message.encoded = "";
    }
    return message;
  },

  toJSON(message: EncodedExpiringAuctions): unknown {
    const obj: any = {};
    message.encoded !== undefined && (obj.encoded = message.encoded);
    return obj;
  },

  fromPartial(
    object: DeepPartial<EncodedExpiringAuctions>
  ): EncodedExpiringAuctions {
    const message = {
      ...baseEncodedExpiringAuctions,
    } as EncodedExpiringAuctions;
    if (object.encoded !== undefined && object.encoded !== null) {
      message.encoded = object.encoded;
    } else {
      message.encoded = "";
    }
    return message;
  },
};

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
