/* eslint-disable */
import { Reader, Writer } from "protobufjs/minimal";

export const protobufPackage = "dflow.ssaccount";

export interface MsgInitSsaccount {
  /** The bech32 DFlow public key of the validator. This is the signer. */
  validatorPublicKey: string;
  /** The bech32 DFlow public key of the signatory server. Not a signer. */
  ssPublicKey: string;
  /** The bech32 DFlow public key of the signatory server's first signing key. Not a signer. */
  signingPublicKey1: string;
  /** The bech32 DFlow public key of the signatory server's second signing key. Not a signer. */
  signingPublicKey2: string;
}

export interface MsgInitSsaccountResponse {}

export interface MsgCreateNetworkAccount {
  /**
   * The bech32 DFlow public key of the transaction signer. This must be the signatory server's
   * account key or one of its signing keys.
   */
  signerPublicKey: string;
  /** The bech32 DFlow public key of the signatory server */
  ssPublicKey: string;
  /** The bech32 DFlow public key of the new network account */
  newNetworkAccount: string;
}

export interface MsgCreateNetworkAccountResponse {}

export interface MsgSetSigningKeys {
  /**
   * The bech32 DFlow public key of the transaction signer. This must be the signatory server's
   * account key or one of its current signing keys.
   */
  signerPublicKey: string;
  /** The bech32 DFlow public key of the signatory server */
  ssPublicKey: string;
  /** The bech32 DFlow public key of the signatory server's first signing key */
  signingPublicKey1: string;
  /** The bech32 DFlow public key of the signatory server's second signing key */
  signingPublicKey2: string;
}

export interface MsgSetSigningKeysResponse {}

const baseMsgInitSsaccount: object = {
  validatorPublicKey: "",
  ssPublicKey: "",
  signingPublicKey1: "",
  signingPublicKey2: "",
};

export const MsgInitSsaccount = {
  encode(message: MsgInitSsaccount, writer: Writer = Writer.create()): Writer {
    if (message.validatorPublicKey !== "") {
      writer.uint32(10).string(message.validatorPublicKey);
    }
    if (message.ssPublicKey !== "") {
      writer.uint32(18).string(message.ssPublicKey);
    }
    if (message.signingPublicKey1 !== "") {
      writer.uint32(26).string(message.signingPublicKey1);
    }
    if (message.signingPublicKey2 !== "") {
      writer.uint32(34).string(message.signingPublicKey2);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgInitSsaccount {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgInitSsaccount } as MsgInitSsaccount;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorPublicKey = reader.string();
          break;
        case 2:
          message.ssPublicKey = reader.string();
          break;
        case 3:
          message.signingPublicKey1 = reader.string();
          break;
        case 4:
          message.signingPublicKey2 = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgInitSsaccount {
    const message = { ...baseMsgInitSsaccount } as MsgInitSsaccount;
    if (
      object.validatorPublicKey !== undefined &&
      object.validatorPublicKey !== null
    ) {
      message.validatorPublicKey = String(object.validatorPublicKey);
    } else {
      message.validatorPublicKey = "";
    }
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
    return message;
  },

  toJSON(message: MsgInitSsaccount): unknown {
    const obj: any = {};
    message.validatorPublicKey !== undefined &&
      (obj.validatorPublicKey = message.validatorPublicKey);
    message.ssPublicKey !== undefined &&
      (obj.ssPublicKey = message.ssPublicKey);
    message.signingPublicKey1 !== undefined &&
      (obj.signingPublicKey1 = message.signingPublicKey1);
    message.signingPublicKey2 !== undefined &&
      (obj.signingPublicKey2 = message.signingPublicKey2);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgInitSsaccount>): MsgInitSsaccount {
    const message = { ...baseMsgInitSsaccount } as MsgInitSsaccount;
    if (
      object.validatorPublicKey !== undefined &&
      object.validatorPublicKey !== null
    ) {
      message.validatorPublicKey = object.validatorPublicKey;
    } else {
      message.validatorPublicKey = "";
    }
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
    return message;
  },
};

const baseMsgInitSsaccountResponse: object = {};

export const MsgInitSsaccountResponse = {
  encode(
    _: MsgInitSsaccountResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgInitSsaccountResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgInitSsaccountResponse,
    } as MsgInitSsaccountResponse;
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

  fromJSON(_: any): MsgInitSsaccountResponse {
    const message = {
      ...baseMsgInitSsaccountResponse,
    } as MsgInitSsaccountResponse;
    return message;
  },

  toJSON(_: MsgInitSsaccountResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgInitSsaccountResponse>
  ): MsgInitSsaccountResponse {
    const message = {
      ...baseMsgInitSsaccountResponse,
    } as MsgInitSsaccountResponse;
    return message;
  },
};

const baseMsgCreateNetworkAccount: object = {
  signerPublicKey: "",
  ssPublicKey: "",
  newNetworkAccount: "",
};

export const MsgCreateNetworkAccount = {
  encode(
    message: MsgCreateNetworkAccount,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.signerPublicKey !== "") {
      writer.uint32(10).string(message.signerPublicKey);
    }
    if (message.ssPublicKey !== "") {
      writer.uint32(18).string(message.ssPublicKey);
    }
    if (message.newNetworkAccount !== "") {
      writer.uint32(26).string(message.newNetworkAccount);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgCreateNetworkAccount {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgCreateNetworkAccount,
    } as MsgCreateNetworkAccount;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signerPublicKey = reader.string();
          break;
        case 2:
          message.ssPublicKey = reader.string();
          break;
        case 3:
          message.newNetworkAccount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateNetworkAccount {
    const message = {
      ...baseMsgCreateNetworkAccount,
    } as MsgCreateNetworkAccount;
    if (
      object.signerPublicKey !== undefined &&
      object.signerPublicKey !== null
    ) {
      message.signerPublicKey = String(object.signerPublicKey);
    } else {
      message.signerPublicKey = "";
    }
    if (object.ssPublicKey !== undefined && object.ssPublicKey !== null) {
      message.ssPublicKey = String(object.ssPublicKey);
    } else {
      message.ssPublicKey = "";
    }
    if (
      object.newNetworkAccount !== undefined &&
      object.newNetworkAccount !== null
    ) {
      message.newNetworkAccount = String(object.newNetworkAccount);
    } else {
      message.newNetworkAccount = "";
    }
    return message;
  },

  toJSON(message: MsgCreateNetworkAccount): unknown {
    const obj: any = {};
    message.signerPublicKey !== undefined &&
      (obj.signerPublicKey = message.signerPublicKey);
    message.ssPublicKey !== undefined &&
      (obj.ssPublicKey = message.ssPublicKey);
    message.newNetworkAccount !== undefined &&
      (obj.newNetworkAccount = message.newNetworkAccount);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgCreateNetworkAccount>
  ): MsgCreateNetworkAccount {
    const message = {
      ...baseMsgCreateNetworkAccount,
    } as MsgCreateNetworkAccount;
    if (
      object.signerPublicKey !== undefined &&
      object.signerPublicKey !== null
    ) {
      message.signerPublicKey = object.signerPublicKey;
    } else {
      message.signerPublicKey = "";
    }
    if (object.ssPublicKey !== undefined && object.ssPublicKey !== null) {
      message.ssPublicKey = object.ssPublicKey;
    } else {
      message.ssPublicKey = "";
    }
    if (
      object.newNetworkAccount !== undefined &&
      object.newNetworkAccount !== null
    ) {
      message.newNetworkAccount = object.newNetworkAccount;
    } else {
      message.newNetworkAccount = "";
    }
    return message;
  },
};

const baseMsgCreateNetworkAccountResponse: object = {};

export const MsgCreateNetworkAccountResponse = {
  encode(
    _: MsgCreateNetworkAccountResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgCreateNetworkAccountResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgCreateNetworkAccountResponse,
    } as MsgCreateNetworkAccountResponse;
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

  fromJSON(_: any): MsgCreateNetworkAccountResponse {
    const message = {
      ...baseMsgCreateNetworkAccountResponse,
    } as MsgCreateNetworkAccountResponse;
    return message;
  },

  toJSON(_: MsgCreateNetworkAccountResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgCreateNetworkAccountResponse>
  ): MsgCreateNetworkAccountResponse {
    const message = {
      ...baseMsgCreateNetworkAccountResponse,
    } as MsgCreateNetworkAccountResponse;
    return message;
  },
};

const baseMsgSetSigningKeys: object = {
  signerPublicKey: "",
  ssPublicKey: "",
  signingPublicKey1: "",
  signingPublicKey2: "",
};

export const MsgSetSigningKeys = {
  encode(message: MsgSetSigningKeys, writer: Writer = Writer.create()): Writer {
    if (message.signerPublicKey !== "") {
      writer.uint32(10).string(message.signerPublicKey);
    }
    if (message.ssPublicKey !== "") {
      writer.uint32(18).string(message.ssPublicKey);
    }
    if (message.signingPublicKey1 !== "") {
      writer.uint32(26).string(message.signingPublicKey1);
    }
    if (message.signingPublicKey2 !== "") {
      writer.uint32(34).string(message.signingPublicKey2);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgSetSigningKeys {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgSetSigningKeys } as MsgSetSigningKeys;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signerPublicKey = reader.string();
          break;
        case 2:
          message.ssPublicKey = reader.string();
          break;
        case 3:
          message.signingPublicKey1 = reader.string();
          break;
        case 4:
          message.signingPublicKey2 = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSetSigningKeys {
    const message = { ...baseMsgSetSigningKeys } as MsgSetSigningKeys;
    if (
      object.signerPublicKey !== undefined &&
      object.signerPublicKey !== null
    ) {
      message.signerPublicKey = String(object.signerPublicKey);
    } else {
      message.signerPublicKey = "";
    }
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
    return message;
  },

  toJSON(message: MsgSetSigningKeys): unknown {
    const obj: any = {};
    message.signerPublicKey !== undefined &&
      (obj.signerPublicKey = message.signerPublicKey);
    message.ssPublicKey !== undefined &&
      (obj.ssPublicKey = message.ssPublicKey);
    message.signingPublicKey1 !== undefined &&
      (obj.signingPublicKey1 = message.signingPublicKey1);
    message.signingPublicKey2 !== undefined &&
      (obj.signingPublicKey2 = message.signingPublicKey2);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgSetSigningKeys>): MsgSetSigningKeys {
    const message = { ...baseMsgSetSigningKeys } as MsgSetSigningKeys;
    if (
      object.signerPublicKey !== undefined &&
      object.signerPublicKey !== null
    ) {
      message.signerPublicKey = object.signerPublicKey;
    } else {
      message.signerPublicKey = "";
    }
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
    return message;
  },
};

const baseMsgSetSigningKeysResponse: object = {};

export const MsgSetSigningKeysResponse = {
  encode(
    _: MsgSetSigningKeysResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgSetSigningKeysResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgSetSigningKeysResponse,
    } as MsgSetSigningKeysResponse;
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

  fromJSON(_: any): MsgSetSigningKeysResponse {
    const message = {
      ...baseMsgSetSigningKeysResponse,
    } as MsgSetSigningKeysResponse;
    return message;
  },

  toJSON(_: MsgSetSigningKeysResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgSetSigningKeysResponse>
  ): MsgSetSigningKeysResponse {
    const message = {
      ...baseMsgSetSigningKeysResponse,
    } as MsgSetSigningKeysResponse;
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  InitSsaccount(request: MsgInitSsaccount): Promise<MsgInitSsaccountResponse>;
  CreateNetworkAccount(
    request: MsgCreateNetworkAccount
  ): Promise<MsgCreateNetworkAccountResponse>;
  /** this line is used by starport scaffolding # proto/tx/rpc */
  SetSigningKeys(
    request: MsgSetSigningKeys
  ): Promise<MsgSetSigningKeysResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  InitSsaccount(request: MsgInitSsaccount): Promise<MsgInitSsaccountResponse> {
    const data = MsgInitSsaccount.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.ssaccount.Msg",
      "InitSsaccount",
      data
    );
    return promise.then((data) =>
      MsgInitSsaccountResponse.decode(new Reader(data))
    );
  }

  CreateNetworkAccount(
    request: MsgCreateNetworkAccount
  ): Promise<MsgCreateNetworkAccountResponse> {
    const data = MsgCreateNetworkAccount.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.ssaccount.Msg",
      "CreateNetworkAccount",
      data
    );
    return promise.then((data) =>
      MsgCreateNetworkAccountResponse.decode(new Reader(data))
    );
  }

  SetSigningKeys(
    request: MsgSetSigningKeys
  ): Promise<MsgSetSigningKeysResponse> {
    const data = MsgSetSigningKeys.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.ssaccount.Msg",
      "SetSigningKeys",
      data
    );
    return promise.then((data) =>
      MsgSetSigningKeysResponse.decode(new Reader(data))
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
