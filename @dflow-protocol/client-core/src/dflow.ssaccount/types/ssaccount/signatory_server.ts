/* eslint-disable */
import { Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.ssaccount";

export interface SignatoryServer {
  /** The bech32 DFlow public key of the signatory server */
  ssPublicKey: string;
  /** The bech32 DFlow public key of the signatory server's first signing key */
  signingPublicKey1: string;
  /** The bech32 DFlow public key of the signatory server's second signing key */
  signingPublicKey2: string;
  /** The bech32 DFlow public key of the SS-associated validator */
  validatorPublicKey: string;
}

const baseSignatoryServer: object = {
  ssPublicKey: "",
  signingPublicKey1: "",
  signingPublicKey2: "",
  validatorPublicKey: "",
};

export const SignatoryServer = {
  encode(message: SignatoryServer, writer: Writer = Writer.create()): Writer {
    if (message.ssPublicKey !== "") {
      writer.uint32(10).string(message.ssPublicKey);
    }
    if (message.signingPublicKey1 !== "") {
      writer.uint32(18).string(message.signingPublicKey1);
    }
    if (message.signingPublicKey2 !== "") {
      writer.uint32(26).string(message.signingPublicKey2);
    }
    if (message.validatorPublicKey !== "") {
      writer.uint32(34).string(message.validatorPublicKey);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SignatoryServer {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSignatoryServer } as SignatoryServer;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ssPublicKey = reader.string();
          break;
        case 2:
          message.signingPublicKey1 = reader.string();
          break;
        case 3:
          message.signingPublicKey2 = reader.string();
          break;
        case 4:
          message.validatorPublicKey = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignatoryServer {
    const message = { ...baseSignatoryServer } as SignatoryServer;
    if (object.ssPublicKey !== undefined && object.ssPublicKey !== null) {
      message.ssPublicKey = String(object.ssPublicKey);
    } else {
      message.ssPublicKey = "";
    }
    if (
      object.signingPublicKey1 !== undefined &&
      object.signingPublicKey1 !== null
    ) {
      message.signingPublicKey1 = String(object.signingPublicKey1);
    } else {
      message.signingPublicKey1 = "";
    }
    if (
      object.signingPublicKey2 !== undefined &&
      object.signingPublicKey2 !== null
    ) {
      message.signingPublicKey2 = String(object.signingPublicKey2);
    } else {
      message.signingPublicKey2 = "";
    }
    if (
      object.validatorPublicKey !== undefined &&
      object.validatorPublicKey !== null
    ) {
      message.validatorPublicKey = String(object.validatorPublicKey);
    } else {
      message.validatorPublicKey = "";
    }
    return message;
  },

  toJSON(message: SignatoryServer): unknown {
    const obj: any = {};
    message.ssPublicKey !== undefined &&
      (obj.ssPublicKey = message.ssPublicKey);
    message.signingPublicKey1 !== undefined &&
      (obj.signingPublicKey1 = message.signingPublicKey1);
    message.signingPublicKey2 !== undefined &&
      (obj.signingPublicKey2 = message.signingPublicKey2);
    message.validatorPublicKey !== undefined &&
      (obj.validatorPublicKey = message.validatorPublicKey);
    return obj;
  },

  fromPartial(object: DeepPartial<SignatoryServer>): SignatoryServer {
    const message = { ...baseSignatoryServer } as SignatoryServer;
    if (object.ssPublicKey !== undefined && object.ssPublicKey !== null) {
      message.ssPublicKey = object.ssPublicKey;
    } else {
      message.ssPublicKey = "";
    }
    if (
      object.signingPublicKey1 !== undefined &&
      object.signingPublicKey1 !== null
    ) {
      message.signingPublicKey1 = object.signingPublicKey1;
    } else {
      message.signingPublicKey1 = "";
    }
    if (
      object.signingPublicKey2 !== undefined &&
      object.signingPublicKey2 !== null
    ) {
      message.signingPublicKey2 = object.signingPublicKey2;
    } else {
      message.signingPublicKey2 = "";
    }
    if (
      object.validatorPublicKey !== undefined &&
      object.validatorPublicKey !== null
    ) {
      message.validatorPublicKey = object.validatorPublicKey;
    } else {
      message.validatorPublicKey = "";
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
