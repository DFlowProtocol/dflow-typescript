/* eslint-disable */
import * as Long from "long";
import { util, configure, Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.bridge";

export enum TransferType {
  DEPOSIT = 0,
  WITHDRAWAL = 1,
  UNRECOGNIZED = -1,
}

export function transferTypeFromJSON(object: any): TransferType {
  switch (object) {
    case 0:
    case "DEPOSIT":
      return TransferType.DEPOSIT;
    case 1:
    case "WITHDRAWAL":
      return TransferType.WITHDRAWAL;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TransferType.UNRECOGNIZED;
  }
}

export function transferTypeToJSON(object: TransferType): string {
  switch (object) {
    case TransferType.DEPOSIT:
      return "DEPOSIT";
    case TransferType.WITHDRAWAL:
      return "WITHDRAWAL";
    default:
      return "UNKNOWN";
  }
}

export interface Transfer {
  /** An enum indicating whether this transfer is a deposit or withdrawal */
  transferType: TransferType;
  /** Either a bech32 encoded address if depositing or a Base58 encoded Solana public key if withdrawing */
  dst: string;
  /** Amount of tokens being transferred */
  amount: number;
  /** The nonce of the transfer to be committed on DFlow */
  nonce: number;
  /** A withdraw ID only used if this transfer is a withdrawal */
  withdrawId: number;
}

export interface EndorsedTransfer {
  /** The bech32 public key of the validator associated with the endorsing signatory server */
  validatorPublicKey: string;
  /** The transfer being endorsed by the validator */
  transfer: Transfer | undefined;
}

export interface NoncedProposedTransfers {
  /** The nonce associated with the list of proposed transfers in this message */
  nonce: number;
  /** A list of endorsed transfers at a given nonce */
  proposed: EndorsedTransfer[];
}

const baseTransfer: object = {
  transferType: 0,
  dst: "",
  amount: 0,
  nonce: 0,
  withdrawId: 0,
};

export const Transfer = {
  encode(message: Transfer, writer: Writer = Writer.create()): Writer {
    if (message.transferType !== 0) {
      writer.uint32(8).int32(message.transferType);
    }
    if (message.dst !== "") {
      writer.uint32(18).string(message.dst);
    }
    if (message.amount !== 0) {
      writer.uint32(24).uint64(message.amount);
    }
    if (message.nonce !== 0) {
      writer.uint32(32).uint64(message.nonce);
    }
    if (message.withdrawId !== 0) {
      writer.uint32(40).uint64(message.withdrawId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Transfer {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseTransfer } as Transfer;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transferType = reader.int32() as any;
          break;
        case 2:
          message.dst = reader.string();
          break;
        case 3:
          message.amount = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.nonce = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.withdrawId = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Transfer {
    const message = { ...baseTransfer } as Transfer;
    if (object.transferType !== undefined && object.transferType !== null) {
      message.transferType = transferTypeFromJSON(object.transferType);
    } else {
      message.transferType = 0;
    }
    if (object.dst !== undefined && object.dst !== null) {
      message.dst = String(object.dst);
    } else {
      message.dst = "";
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = Number(object.amount);
    } else {
      message.amount = 0;
    }
    if (object.nonce !== undefined && object.nonce !== null) {
      message.nonce = Number(object.nonce);
    } else {
      message.nonce = 0;
    }
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = Number(object.withdrawId);
    } else {
      message.withdrawId = 0;
    }
    return message;
  },

  toJSON(message: Transfer): unknown {
    const obj: any = {};
    message.transferType !== undefined &&
      (obj.transferType = transferTypeToJSON(message.transferType));
    message.dst !== undefined && (obj.dst = message.dst);
    message.amount !== undefined && (obj.amount = message.amount);
    message.nonce !== undefined && (obj.nonce = message.nonce);
    message.withdrawId !== undefined && (obj.withdrawId = message.withdrawId);
    return obj;
  },

  fromPartial(object: DeepPartial<Transfer>): Transfer {
    const message = { ...baseTransfer } as Transfer;
    if (object.transferType !== undefined && object.transferType !== null) {
      message.transferType = object.transferType;
    } else {
      message.transferType = 0;
    }
    if (object.dst !== undefined && object.dst !== null) {
      message.dst = object.dst;
    } else {
      message.dst = "";
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    } else {
      message.amount = 0;
    }
    if (object.nonce !== undefined && object.nonce !== null) {
      message.nonce = object.nonce;
    } else {
      message.nonce = 0;
    }
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = object.withdrawId;
    } else {
      message.withdrawId = 0;
    }
    return message;
  },
};

const baseEndorsedTransfer: object = { validatorPublicKey: "" };

export const EndorsedTransfer = {
  encode(message: EndorsedTransfer, writer: Writer = Writer.create()): Writer {
    if (message.validatorPublicKey !== "") {
      writer.uint32(10).string(message.validatorPublicKey);
    }
    if (message.transfer !== undefined) {
      Transfer.encode(message.transfer, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): EndorsedTransfer {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEndorsedTransfer } as EndorsedTransfer;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorPublicKey = reader.string();
          break;
        case 2:
          message.transfer = Transfer.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EndorsedTransfer {
    const message = { ...baseEndorsedTransfer } as EndorsedTransfer;
    if (
      object.validatorPublicKey !== undefined &&
      object.validatorPublicKey !== null
    ) {
      message.validatorPublicKey = String(object.validatorPublicKey);
    } else {
      message.validatorPublicKey = "";
    }
    if (object.transfer !== undefined && object.transfer !== null) {
      message.transfer = Transfer.fromJSON(object.transfer);
    } else {
      message.transfer = undefined;
    }
    return message;
  },

  toJSON(message: EndorsedTransfer): unknown {
    const obj: any = {};
    message.validatorPublicKey !== undefined &&
      (obj.validatorPublicKey = message.validatorPublicKey);
    message.transfer !== undefined &&
      (obj.transfer = message.transfer
        ? Transfer.toJSON(message.transfer)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<EndorsedTransfer>): EndorsedTransfer {
    const message = { ...baseEndorsedTransfer } as EndorsedTransfer;
    if (
      object.validatorPublicKey !== undefined &&
      object.validatorPublicKey !== null
    ) {
      message.validatorPublicKey = object.validatorPublicKey;
    } else {
      message.validatorPublicKey = "";
    }
    if (object.transfer !== undefined && object.transfer !== null) {
      message.transfer = Transfer.fromPartial(object.transfer);
    } else {
      message.transfer = undefined;
    }
    return message;
  },
};

const baseNoncedProposedTransfers: object = { nonce: 0 };

export const NoncedProposedTransfers = {
  encode(
    message: NoncedProposedTransfers,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.nonce !== 0) {
      writer.uint32(8).uint64(message.nonce);
    }
    for (const v of message.proposed) {
      EndorsedTransfer.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): NoncedProposedTransfers {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseNoncedProposedTransfers,
    } as NoncedProposedTransfers;
    message.proposed = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nonce = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.proposed.push(
            EndorsedTransfer.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NoncedProposedTransfers {
    const message = {
      ...baseNoncedProposedTransfers,
    } as NoncedProposedTransfers;
    message.proposed = [];
    if (object.nonce !== undefined && object.nonce !== null) {
      message.nonce = Number(object.nonce);
    } else {
      message.nonce = 0;
    }
    if (object.proposed !== undefined && object.proposed !== null) {
      for (const e of object.proposed) {
        message.proposed.push(EndorsedTransfer.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: NoncedProposedTransfers): unknown {
    const obj: any = {};
    message.nonce !== undefined && (obj.nonce = message.nonce);
    if (message.proposed) {
      obj.proposed = message.proposed.map((e) =>
        e ? EndorsedTransfer.toJSON(e) : undefined
      );
    } else {
      obj.proposed = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<NoncedProposedTransfers>
  ): NoncedProposedTransfers {
    const message = {
      ...baseNoncedProposedTransfers,
    } as NoncedProposedTransfers;
    message.proposed = [];
    if (object.nonce !== undefined && object.nonce !== null) {
      message.nonce = object.nonce;
    } else {
      message.nonce = 0;
    }
    if (object.proposed !== undefined && object.proposed !== null) {
      for (const e of object.proposed) {
        message.proposed.push(EndorsedTransfer.fromPartial(e));
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
