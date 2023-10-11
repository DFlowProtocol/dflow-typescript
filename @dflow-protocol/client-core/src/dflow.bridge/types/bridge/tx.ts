/* eslint-disable */
import { Reader, util, configure, Writer } from "protobufjs/minimal";
import * as Long from "long";
import { Transfer } from "../bridge/nonced_proposed_transfers";

export const protobufPackage = "dflow.bridge";

export interface MsgAttestTransfer {
  /** The bech32 public key of the signatory server's signing key */
  signerPublicKey: string;
  /** The bech32 public key of the signatory server */
  ssPublicKey: string;
  /** The transfer being attested by the signatory server */
  transfer: Transfer | undefined;
}

export interface MsgAttestTransferResponse {
  /** The latest committed nonce on the DFlow network after attesting the transfer */
  currentCommittedNonce: number;
}

export interface MsgRequestWithdraw {
  /** The bech32 public key associated with the withdrawer of funds */
  withdrawerPublicKey: string;
  /** The Base58-encoded SPL token account receiving the funds */
  dst: string;
  /** The Base58-encoded Solana wallet that owns the dst account */
  dstOwner: string;
  /** The amount of tokens being withdrawn from the DFlow network */
  amount: number;
}

export interface MsgRequestWithdrawResponse {
  /** The generated withdraw ID */
  withdrawId: number;
}

export interface MsgSignWithdrawal {
  /** The bech32 encoded DFlow public key of the signatory server's signing key */
  signerPublicKey: string;
  /** The bech32 encoded DFlow public key of the signatory server */
  ssPublicKey: string;
  /** The withdraw ID that the signatory server is attesting to */
  withdrawId: number;
  /** A base58 encoded signature from the Solana private key of the signatory server */
  signature: string;
  /** The base58 encoded Solana public key of the signatory server */
  ssEd25519PublicKey: string;
}

export interface MsgSignWithdrawalResponse {}

export interface MsgReviseWithdrawal {
  /** The bech32 public key associated with the withdrawer of funds */
  withdrawerPublicKey: string;
  /** The ID of the withdrawal that will be revised */
  withdrawId: number;
  /** The Base58-encoded SPL token account receiving the funds */
  dst: string;
  /** The Base58-encoded Solana wallet that owns the dst account */
  dstOwner: string;
}

export interface MsgReviseWithdrawalResponse {}

const baseMsgAttestTransfer: object = { signerPublicKey: "", ssPublicKey: "" };

export const MsgAttestTransfer = {
  encode(message: MsgAttestTransfer, writer: Writer = Writer.create()): Writer {
    if (message.signerPublicKey !== "") {
      writer.uint32(10).string(message.signerPublicKey);
    }
    if (message.ssPublicKey !== "") {
      writer.uint32(18).string(message.ssPublicKey);
    }
    if (message.transfer !== undefined) {
      Transfer.encode(message.transfer, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgAttestTransfer {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgAttestTransfer } as MsgAttestTransfer;
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
          message.transfer = Transfer.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgAttestTransfer {
    const message = { ...baseMsgAttestTransfer } as MsgAttestTransfer;
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
    if (object.transfer !== undefined && object.transfer !== null) {
      message.transfer = Transfer.fromJSON(object.transfer);
    } else {
      message.transfer = undefined;
    }
    return message;
  },

  toJSON(message: MsgAttestTransfer): unknown {
    const obj: any = {};
    message.signerPublicKey !== undefined &&
      (obj.signerPublicKey = message.signerPublicKey);
    message.ssPublicKey !== undefined &&
      (obj.ssPublicKey = message.ssPublicKey);
    message.transfer !== undefined &&
      (obj.transfer = message.transfer
        ? Transfer.toJSON(message.transfer)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgAttestTransfer>): MsgAttestTransfer {
    const message = { ...baseMsgAttestTransfer } as MsgAttestTransfer;
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
    if (object.transfer !== undefined && object.transfer !== null) {
      message.transfer = Transfer.fromPartial(object.transfer);
    } else {
      message.transfer = undefined;
    }
    return message;
  },
};

const baseMsgAttestTransferResponse: object = { currentCommittedNonce: 0 };

export const MsgAttestTransferResponse = {
  encode(
    message: MsgAttestTransferResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.currentCommittedNonce !== 0) {
      writer.uint32(8).uint64(message.currentCommittedNonce);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgAttestTransferResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgAttestTransferResponse,
    } as MsgAttestTransferResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.currentCommittedNonce = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgAttestTransferResponse {
    const message = {
      ...baseMsgAttestTransferResponse,
    } as MsgAttestTransferResponse;
    if (
      object.currentCommittedNonce !== undefined &&
      object.currentCommittedNonce !== null
    ) {
      message.currentCommittedNonce = Number(object.currentCommittedNonce);
    } else {
      message.currentCommittedNonce = 0;
    }
    return message;
  },

  toJSON(message: MsgAttestTransferResponse): unknown {
    const obj: any = {};
    message.currentCommittedNonce !== undefined &&
      (obj.currentCommittedNonce = message.currentCommittedNonce);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgAttestTransferResponse>
  ): MsgAttestTransferResponse {
    const message = {
      ...baseMsgAttestTransferResponse,
    } as MsgAttestTransferResponse;
    if (
      object.currentCommittedNonce !== undefined &&
      object.currentCommittedNonce !== null
    ) {
      message.currentCommittedNonce = object.currentCommittedNonce;
    } else {
      message.currentCommittedNonce = 0;
    }
    return message;
  },
};

const baseMsgRequestWithdraw: object = {
  withdrawerPublicKey: "",
  dst: "",
  dstOwner: "",
  amount: 0,
};

export const MsgRequestWithdraw = {
  encode(
    message: MsgRequestWithdraw,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.withdrawerPublicKey !== "") {
      writer.uint32(10).string(message.withdrawerPublicKey);
    }
    if (message.dst !== "") {
      writer.uint32(18).string(message.dst);
    }
    if (message.dstOwner !== "") {
      writer.uint32(26).string(message.dstOwner);
    }
    if (message.amount !== 0) {
      writer.uint32(32).uint64(message.amount);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgRequestWithdraw {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRequestWithdraw } as MsgRequestWithdraw;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdrawerPublicKey = reader.string();
          break;
        case 2:
          message.dst = reader.string();
          break;
        case 3:
          message.dstOwner = reader.string();
          break;
        case 4:
          message.amount = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRequestWithdraw {
    const message = { ...baseMsgRequestWithdraw } as MsgRequestWithdraw;
    if (
      object.withdrawerPublicKey !== undefined &&
      object.withdrawerPublicKey !== null
    ) {
      message.withdrawerPublicKey = String(object.withdrawerPublicKey);
    } else {
      message.withdrawerPublicKey = "";
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
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = Number(object.amount);
    } else {
      message.amount = 0;
    }
    return message;
  },

  toJSON(message: MsgRequestWithdraw): unknown {
    const obj: any = {};
    message.withdrawerPublicKey !== undefined &&
      (obj.withdrawerPublicKey = message.withdrawerPublicKey);
    message.dst !== undefined && (obj.dst = message.dst);
    message.dstOwner !== undefined && (obj.dstOwner = message.dstOwner);
    message.amount !== undefined && (obj.amount = message.amount);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgRequestWithdraw>): MsgRequestWithdraw {
    const message = { ...baseMsgRequestWithdraw } as MsgRequestWithdraw;
    if (
      object.withdrawerPublicKey !== undefined &&
      object.withdrawerPublicKey !== null
    ) {
      message.withdrawerPublicKey = object.withdrawerPublicKey;
    } else {
      message.withdrawerPublicKey = "";
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
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    } else {
      message.amount = 0;
    }
    return message;
  },
};

const baseMsgRequestWithdrawResponse: object = { withdrawId: 0 };

export const MsgRequestWithdrawResponse = {
  encode(
    message: MsgRequestWithdrawResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.withdrawId !== 0) {
      writer.uint32(8).uint64(message.withdrawId);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgRequestWithdrawResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgRequestWithdrawResponse,
    } as MsgRequestWithdrawResponse;
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

  fromJSON(object: any): MsgRequestWithdrawResponse {
    const message = {
      ...baseMsgRequestWithdrawResponse,
    } as MsgRequestWithdrawResponse;
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = Number(object.withdrawId);
    } else {
      message.withdrawId = 0;
    }
    return message;
  },

  toJSON(message: MsgRequestWithdrawResponse): unknown {
    const obj: any = {};
    message.withdrawId !== undefined && (obj.withdrawId = message.withdrawId);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgRequestWithdrawResponse>
  ): MsgRequestWithdrawResponse {
    const message = {
      ...baseMsgRequestWithdrawResponse,
    } as MsgRequestWithdrawResponse;
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = object.withdrawId;
    } else {
      message.withdrawId = 0;
    }
    return message;
  },
};

const baseMsgSignWithdrawal: object = {
  signerPublicKey: "",
  ssPublicKey: "",
  withdrawId: 0,
  signature: "",
  ssEd25519PublicKey: "",
};

export const MsgSignWithdrawal = {
  encode(message: MsgSignWithdrawal, writer: Writer = Writer.create()): Writer {
    if (message.signerPublicKey !== "") {
      writer.uint32(10).string(message.signerPublicKey);
    }
    if (message.ssPublicKey !== "") {
      writer.uint32(18).string(message.ssPublicKey);
    }
    if (message.withdrawId !== 0) {
      writer.uint32(24).uint64(message.withdrawId);
    }
    if (message.signature !== "") {
      writer.uint32(34).string(message.signature);
    }
    if (message.ssEd25519PublicKey !== "") {
      writer.uint32(42).string(message.ssEd25519PublicKey);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgSignWithdrawal {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgSignWithdrawal } as MsgSignWithdrawal;
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
          message.withdrawId = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.signature = reader.string();
          break;
        case 5:
          message.ssEd25519PublicKey = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSignWithdrawal {
    const message = { ...baseMsgSignWithdrawal } as MsgSignWithdrawal;
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
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = Number(object.withdrawId);
    } else {
      message.withdrawId = 0;
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = String(object.signature);
    } else {
      message.signature = "";
    }
    if (
      object.ssEd25519PublicKey !== undefined &&
      object.ssEd25519PublicKey !== null
    ) {
      message.ssEd25519PublicKey = String(object.ssEd25519PublicKey);
    } else {
      message.ssEd25519PublicKey = "";
    }
    return message;
  },

  toJSON(message: MsgSignWithdrawal): unknown {
    const obj: any = {};
    message.signerPublicKey !== undefined &&
      (obj.signerPublicKey = message.signerPublicKey);
    message.ssPublicKey !== undefined &&
      (obj.ssPublicKey = message.ssPublicKey);
    message.withdrawId !== undefined && (obj.withdrawId = message.withdrawId);
    message.signature !== undefined && (obj.signature = message.signature);
    message.ssEd25519PublicKey !== undefined &&
      (obj.ssEd25519PublicKey = message.ssEd25519PublicKey);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgSignWithdrawal>): MsgSignWithdrawal {
    const message = { ...baseMsgSignWithdrawal } as MsgSignWithdrawal;
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
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = object.withdrawId;
    } else {
      message.withdrawId = 0;
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = object.signature;
    } else {
      message.signature = "";
    }
    if (
      object.ssEd25519PublicKey !== undefined &&
      object.ssEd25519PublicKey !== null
    ) {
      message.ssEd25519PublicKey = object.ssEd25519PublicKey;
    } else {
      message.ssEd25519PublicKey = "";
    }
    return message;
  },
};

const baseMsgSignWithdrawalResponse: object = {};

export const MsgSignWithdrawalResponse = {
  encode(
    _: MsgSignWithdrawalResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgSignWithdrawalResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgSignWithdrawalResponse,
    } as MsgSignWithdrawalResponse;
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

  fromJSON(_: any): MsgSignWithdrawalResponse {
    const message = {
      ...baseMsgSignWithdrawalResponse,
    } as MsgSignWithdrawalResponse;
    return message;
  },

  toJSON(_: MsgSignWithdrawalResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgSignWithdrawalResponse>
  ): MsgSignWithdrawalResponse {
    const message = {
      ...baseMsgSignWithdrawalResponse,
    } as MsgSignWithdrawalResponse;
    return message;
  },
};

const baseMsgReviseWithdrawal: object = {
  withdrawerPublicKey: "",
  withdrawId: 0,
  dst: "",
  dstOwner: "",
};

export const MsgReviseWithdrawal = {
  encode(
    message: MsgReviseWithdrawal,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.withdrawerPublicKey !== "") {
      writer.uint32(10).string(message.withdrawerPublicKey);
    }
    if (message.withdrawId !== 0) {
      writer.uint32(16).uint64(message.withdrawId);
    }
    if (message.dst !== "") {
      writer.uint32(26).string(message.dst);
    }
    if (message.dstOwner !== "") {
      writer.uint32(34).string(message.dstOwner);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgReviseWithdrawal {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgReviseWithdrawal } as MsgReviseWithdrawal;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdrawerPublicKey = reader.string();
          break;
        case 2:
          message.withdrawId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.dst = reader.string();
          break;
        case 4:
          message.dstOwner = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgReviseWithdrawal {
    const message = { ...baseMsgReviseWithdrawal } as MsgReviseWithdrawal;
    if (
      object.withdrawerPublicKey !== undefined &&
      object.withdrawerPublicKey !== null
    ) {
      message.withdrawerPublicKey = String(object.withdrawerPublicKey);
    } else {
      message.withdrawerPublicKey = "";
    }
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = Number(object.withdrawId);
    } else {
      message.withdrawId = 0;
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
    return message;
  },

  toJSON(message: MsgReviseWithdrawal): unknown {
    const obj: any = {};
    message.withdrawerPublicKey !== undefined &&
      (obj.withdrawerPublicKey = message.withdrawerPublicKey);
    message.withdrawId !== undefined && (obj.withdrawId = message.withdrawId);
    message.dst !== undefined && (obj.dst = message.dst);
    message.dstOwner !== undefined && (obj.dstOwner = message.dstOwner);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgReviseWithdrawal>): MsgReviseWithdrawal {
    const message = { ...baseMsgReviseWithdrawal } as MsgReviseWithdrawal;
    if (
      object.withdrawerPublicKey !== undefined &&
      object.withdrawerPublicKey !== null
    ) {
      message.withdrawerPublicKey = object.withdrawerPublicKey;
    } else {
      message.withdrawerPublicKey = "";
    }
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = object.withdrawId;
    } else {
      message.withdrawId = 0;
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
    return message;
  },
};

const baseMsgReviseWithdrawalResponse: object = {};

export const MsgReviseWithdrawalResponse = {
  encode(
    _: MsgReviseWithdrawalResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgReviseWithdrawalResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgReviseWithdrawalResponse,
    } as MsgReviseWithdrawalResponse;
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

  fromJSON(_: any): MsgReviseWithdrawalResponse {
    const message = {
      ...baseMsgReviseWithdrawalResponse,
    } as MsgReviseWithdrawalResponse;
    return message;
  },

  toJSON(_: MsgReviseWithdrawalResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgReviseWithdrawalResponse>
  ): MsgReviseWithdrawalResponse {
    const message = {
      ...baseMsgReviseWithdrawalResponse,
    } as MsgReviseWithdrawalResponse;
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  AttestTransfer(
    request: MsgAttestTransfer
  ): Promise<MsgAttestTransferResponse>;
  RequestWithdraw(
    request: MsgRequestWithdraw
  ): Promise<MsgRequestWithdrawResponse>;
  SignWithdrawal(
    request: MsgSignWithdrawal
  ): Promise<MsgSignWithdrawalResponse>;
  /** this line is used by starport scaffolding # proto/tx/rpc */
  ReviseWithdrawal(
    request: MsgReviseWithdrawal
  ): Promise<MsgReviseWithdrawalResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  AttestTransfer(
    request: MsgAttestTransfer
  ): Promise<MsgAttestTransferResponse> {
    const data = MsgAttestTransfer.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.bridge.Msg",
      "AttestTransfer",
      data
    );
    return promise.then((data) =>
      MsgAttestTransferResponse.decode(new Reader(data))
    );
  }

  RequestWithdraw(
    request: MsgRequestWithdraw
  ): Promise<MsgRequestWithdrawResponse> {
    const data = MsgRequestWithdraw.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.bridge.Msg",
      "RequestWithdraw",
      data
    );
    return promise.then((data) =>
      MsgRequestWithdrawResponse.decode(new Reader(data))
    );
  }

  SignWithdrawal(
    request: MsgSignWithdrawal
  ): Promise<MsgSignWithdrawalResponse> {
    const data = MsgSignWithdrawal.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.bridge.Msg",
      "SignWithdrawal",
      data
    );
    return promise.then((data) =>
      MsgSignWithdrawalResponse.decode(new Reader(data))
    );
  }

  ReviseWithdrawal(
    request: MsgReviseWithdrawal
  ): Promise<MsgReviseWithdrawalResponse> {
    const data = MsgReviseWithdrawal.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.bridge.Msg",
      "ReviseWithdrawal",
      data
    );
    return promise.then((data) =>
      MsgReviseWithdrawalResponse.decode(new Reader(data))
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
