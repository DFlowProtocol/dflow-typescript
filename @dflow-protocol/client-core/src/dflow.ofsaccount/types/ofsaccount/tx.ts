/* eslint-disable */
import { Reader, Writer } from "protobufjs/minimal";

export const protobufPackage = "dflow.ofsaccount";

export interface MsgInitAccount {
  /** The bech32 DFlow public key of the order flow source */
  ofsPublicKey: string;
  /** The base58 encoded Ed25519 public key used by the order flow source to endorse flow */
  flowEndorsementKey: string;
  extensions: string;
}

export interface MsgInitAccountResponse {}

export interface MsgUpdateEndorsementKeys {
  /** The bech32 DFlow public key of the order flow source */
  ofsPublicKey: string;
  /** Base58-encoded Ed25519 endorsement key */
  flowEndorsementKey1: string;
  /** Base58-encoded Ed25519 endorsement key */
  flowEndorsementKey2: string;
}

export interface MsgUpdateEndorsementKeysResponse {}

export interface MsgSetExtensions {
  /** The bech32 DFlow public key of the order flow source */
  ofsPublicKey: string;
  extensions: string;
}

export interface MsgSetExtensionsResponse {}

const baseMsgInitAccount: object = {
  ofsPublicKey: "",
  flowEndorsementKey: "",
  extensions: "",
};

export const MsgInitAccount = {
  encode(message: MsgInitAccount, writer: Writer = Writer.create()): Writer {
    if (message.ofsPublicKey !== "") {
      writer.uint32(10).string(message.ofsPublicKey);
    }
    if (message.flowEndorsementKey !== "") {
      writer.uint32(18).string(message.flowEndorsementKey);
    }
    if (message.extensions !== "") {
      writer.uint32(26).string(message.extensions);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgInitAccount {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgInitAccount } as MsgInitAccount;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ofsPublicKey = reader.string();
          break;
        case 2:
          message.flowEndorsementKey = reader.string();
          break;
        case 3:
          message.extensions = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgInitAccount {
    const message = { ...baseMsgInitAccount } as MsgInitAccount;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = String(object.ofsPublicKey);
    } else {
      message.ofsPublicKey = "";
    }
    if (
      object.flowEndorsementKey !== undefined &&
      object.flowEndorsementKey !== null
    ) {
      message.flowEndorsementKey = String(object.flowEndorsementKey);
    } else {
      message.flowEndorsementKey = "";
    }
    if (object.extensions !== undefined && object.extensions !== null) {
      message.extensions = String(object.extensions);
    } else {
      message.extensions = "";
    }
    return message;
  },

  toJSON(message: MsgInitAccount): unknown {
    const obj: any = {};
    message.ofsPublicKey !== undefined &&
      (obj.ofsPublicKey = message.ofsPublicKey);
    message.flowEndorsementKey !== undefined &&
      (obj.flowEndorsementKey = message.flowEndorsementKey);
    message.extensions !== undefined && (obj.extensions = message.extensions);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgInitAccount>): MsgInitAccount {
    const message = { ...baseMsgInitAccount } as MsgInitAccount;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = object.ofsPublicKey;
    } else {
      message.ofsPublicKey = "";
    }
    if (
      object.flowEndorsementKey !== undefined &&
      object.flowEndorsementKey !== null
    ) {
      message.flowEndorsementKey = object.flowEndorsementKey;
    } else {
      message.flowEndorsementKey = "";
    }
    if (object.extensions !== undefined && object.extensions !== null) {
      message.extensions = object.extensions;
    } else {
      message.extensions = "";
    }
    return message;
  },
};

const baseMsgInitAccountResponse: object = {};

export const MsgInitAccountResponse = {
  encode(_: MsgInitAccountResponse, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgInitAccountResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgInitAccountResponse } as MsgInitAccountResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgInitAccountResponse {
    const message = { ...baseMsgInitAccountResponse } as MsgInitAccountResponse;
    return message;
  },

  toJSON(_: MsgInitAccountResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgInitAccountResponse>): MsgInitAccountResponse {
    const message = { ...baseMsgInitAccountResponse } as MsgInitAccountResponse;
    return message;
  },
};

const baseMsgUpdateEndorsementKeys: object = {
  ofsPublicKey: "",
  flowEndorsementKey1: "",
  flowEndorsementKey2: "",
};

export const MsgUpdateEndorsementKeys = {
  encode(
    message: MsgUpdateEndorsementKeys,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.ofsPublicKey !== "") {
      writer.uint32(10).string(message.ofsPublicKey);
    }
    if (message.flowEndorsementKey1 !== "") {
      writer.uint32(18).string(message.flowEndorsementKey1);
    }
    if (message.flowEndorsementKey2 !== "") {
      writer.uint32(26).string(message.flowEndorsementKey2);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgUpdateEndorsementKeys {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgUpdateEndorsementKeys,
    } as MsgUpdateEndorsementKeys;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ofsPublicKey = reader.string();
          break;
        case 2:
          message.flowEndorsementKey1 = reader.string();
          break;
        case 3:
          message.flowEndorsementKey2 = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateEndorsementKeys {
    const message = {
      ...baseMsgUpdateEndorsementKeys,
    } as MsgUpdateEndorsementKeys;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = String(object.ofsPublicKey);
    } else {
      message.ofsPublicKey = "";
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
    return message;
  },

  toJSON(message: MsgUpdateEndorsementKeys): unknown {
    const obj: any = {};
    message.ofsPublicKey !== undefined &&
      (obj.ofsPublicKey = message.ofsPublicKey);
    message.flowEndorsementKey1 !== undefined &&
      (obj.flowEndorsementKey1 = message.flowEndorsementKey1);
    message.flowEndorsementKey2 !== undefined &&
      (obj.flowEndorsementKey2 = message.flowEndorsementKey2);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgUpdateEndorsementKeys>
  ): MsgUpdateEndorsementKeys {
    const message = {
      ...baseMsgUpdateEndorsementKeys,
    } as MsgUpdateEndorsementKeys;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = object.ofsPublicKey;
    } else {
      message.ofsPublicKey = "";
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
    return message;
  },
};

const baseMsgUpdateEndorsementKeysResponse: object = {};

export const MsgUpdateEndorsementKeysResponse = {
  encode(
    _: MsgUpdateEndorsementKeysResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgUpdateEndorsementKeysResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgUpdateEndorsementKeysResponse,
    } as MsgUpdateEndorsementKeysResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgUpdateEndorsementKeysResponse {
    const message = {
      ...baseMsgUpdateEndorsementKeysResponse,
    } as MsgUpdateEndorsementKeysResponse;
    return message;
  },

  toJSON(_: MsgUpdateEndorsementKeysResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgUpdateEndorsementKeysResponse>
  ): MsgUpdateEndorsementKeysResponse {
    const message = {
      ...baseMsgUpdateEndorsementKeysResponse,
    } as MsgUpdateEndorsementKeysResponse;
    return message;
  },
};

const baseMsgSetExtensions: object = { ofsPublicKey: "", extensions: "" };

export const MsgSetExtensions = {
  encode(message: MsgSetExtensions, writer: Writer = Writer.create()): Writer {
    if (message.ofsPublicKey !== "") {
      writer.uint32(10).string(message.ofsPublicKey);
    }
    if (message.extensions !== "") {
      writer.uint32(18).string(message.extensions);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgSetExtensions {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgSetExtensions } as MsgSetExtensions;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ofsPublicKey = reader.string();
          break;
        case 2:
          message.extensions = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSetExtensions {
    const message = { ...baseMsgSetExtensions } as MsgSetExtensions;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = String(object.ofsPublicKey);
    } else {
      message.ofsPublicKey = "";
    }
    if (object.extensions !== undefined && object.extensions !== null) {
      message.extensions = String(object.extensions);
    } else {
      message.extensions = "";
    }
    return message;
  },

  toJSON(message: MsgSetExtensions): unknown {
    const obj: any = {};
    message.ofsPublicKey !== undefined &&
      (obj.ofsPublicKey = message.ofsPublicKey);
    message.extensions !== undefined && (obj.extensions = message.extensions);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgSetExtensions>): MsgSetExtensions {
    const message = { ...baseMsgSetExtensions } as MsgSetExtensions;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = object.ofsPublicKey;
    } else {
      message.ofsPublicKey = "";
    }
    if (object.extensions !== undefined && object.extensions !== null) {
      message.extensions = object.extensions;
    } else {
      message.extensions = "";
    }
    return message;
  },
};

const baseMsgSetExtensionsResponse: object = {};

export const MsgSetExtensionsResponse = {
  encode(
    _: MsgSetExtensionsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgSetExtensionsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgSetExtensionsResponse,
    } as MsgSetExtensionsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgSetExtensionsResponse {
    const message = {
      ...baseMsgSetExtensionsResponse,
    } as MsgSetExtensionsResponse;
    return message;
  },

  toJSON(_: MsgSetExtensionsResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgSetExtensionsResponse>
  ): MsgSetExtensionsResponse {
    const message = {
      ...baseMsgSetExtensionsResponse,
    } as MsgSetExtensionsResponse;
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  InitAccount(request: MsgInitAccount): Promise<MsgInitAccountResponse>;
  UpdateEndorsementKeys(
    request: MsgUpdateEndorsementKeys
  ): Promise<MsgUpdateEndorsementKeysResponse>;
  /** this line is used by starport scaffolding # proto/tx/rpc */
  SetExtensions(request: MsgSetExtensions): Promise<MsgSetExtensionsResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  InitAccount(request: MsgInitAccount): Promise<MsgInitAccountResponse> {
    const data = MsgInitAccount.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.ofsaccount.Msg",
      "InitAccount",
      data
    );
    return promise.then((data) =>
      MsgInitAccountResponse.decode(new Reader(data))
    );
  }

  UpdateEndorsementKeys(
    request: MsgUpdateEndorsementKeys
  ): Promise<MsgUpdateEndorsementKeysResponse> {
    const data = MsgUpdateEndorsementKeys.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.ofsaccount.Msg",
      "UpdateEndorsementKeys",
      data
    );
    return promise.then((data) =>
      MsgUpdateEndorsementKeysResponse.decode(new Reader(data))
    );
  }

  SetExtensions(request: MsgSetExtensions): Promise<MsgSetExtensionsResponse> {
    const data = MsgSetExtensions.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.ofsaccount.Msg",
      "SetExtensions",
      data
    );
    return promise.then((data) =>
      MsgSetExtensionsResponse.decode(new Reader(data))
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

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
