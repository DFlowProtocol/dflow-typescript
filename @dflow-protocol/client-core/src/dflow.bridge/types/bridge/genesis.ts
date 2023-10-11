/* eslint-disable */
import { Params } from "../bridge/params";
import { NoncedProposedTransfers } from "../bridge/nonced_proposed_transfers";
import { WithdrawTxMap } from "../bridge/withdraw_tx_map";
import { PendingWithdrawal } from "../bridge/pending_withdrawal";
import { Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.bridge";

/** GenesisState defines the bridge module's genesis state. */
export interface GenesisState {
  params: Params | undefined;
  noncedProposedTransfersList: NoncedProposedTransfers[];
  withdrawTxMapList: WithdrawTxMap[];
  /** this line is used by starport scaffolding # genesis/proto/state */
  pendingWithdrawalList: PendingWithdrawal[];
}

const baseGenesisState: object = {};

export const GenesisState = {
  encode(message: GenesisState, writer: Writer = Writer.create()): Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.noncedProposedTransfersList) {
      NoncedProposedTransfers.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.withdrawTxMapList) {
      WithdrawTxMap.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.pendingWithdrawalList) {
      PendingWithdrawal.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGenesisState } as GenesisState;
    message.noncedProposedTransfersList = [];
    message.withdrawTxMapList = [];
    message.pendingWithdrawalList = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.noncedProposedTransfersList.push(
            NoncedProposedTransfers.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.withdrawTxMapList.push(
            WithdrawTxMap.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.pendingWithdrawalList.push(
            PendingWithdrawal.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GenesisState {
    const message = { ...baseGenesisState } as GenesisState;
    message.noncedProposedTransfersList = [];
    message.withdrawTxMapList = [];
    message.pendingWithdrawalList = [];
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromJSON(object.params);
    } else {
      message.params = undefined;
    }
    if (
      object.noncedProposedTransfersList !== undefined &&
      object.noncedProposedTransfersList !== null
    ) {
      for (const e of object.noncedProposedTransfersList) {
        message.noncedProposedTransfersList.push(
          NoncedProposedTransfers.fromJSON(e)
        );
      }
    }
    if (
      object.withdrawTxMapList !== undefined &&
      object.withdrawTxMapList !== null
    ) {
      for (const e of object.withdrawTxMapList) {
        message.withdrawTxMapList.push(WithdrawTxMap.fromJSON(e));
      }
    }
    if (
      object.pendingWithdrawalList !== undefined &&
      object.pendingWithdrawalList !== null
    ) {
      for (const e of object.pendingWithdrawalList) {
        message.pendingWithdrawalList.push(PendingWithdrawal.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    if (message.noncedProposedTransfersList) {
      obj.noncedProposedTransfersList = message.noncedProposedTransfersList.map(
        (e) => (e ? NoncedProposedTransfers.toJSON(e) : undefined)
      );
    } else {
      obj.noncedProposedTransfersList = [];
    }
    if (message.withdrawTxMapList) {
      obj.withdrawTxMapList = message.withdrawTxMapList.map((e) =>
        e ? WithdrawTxMap.toJSON(e) : undefined
      );
    } else {
      obj.withdrawTxMapList = [];
    }
    if (message.pendingWithdrawalList) {
      obj.pendingWithdrawalList = message.pendingWithdrawalList.map((e) =>
        e ? PendingWithdrawal.toJSON(e) : undefined
      );
    } else {
      obj.pendingWithdrawalList = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<GenesisState>): GenesisState {
    const message = { ...baseGenesisState } as GenesisState;
    message.noncedProposedTransfersList = [];
    message.withdrawTxMapList = [];
    message.pendingWithdrawalList = [];
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromPartial(object.params);
    } else {
      message.params = undefined;
    }
    if (
      object.noncedProposedTransfersList !== undefined &&
      object.noncedProposedTransfersList !== null
    ) {
      for (const e of object.noncedProposedTransfersList) {
        message.noncedProposedTransfersList.push(
          NoncedProposedTransfers.fromPartial(e)
        );
      }
    }
    if (
      object.withdrawTxMapList !== undefined &&
      object.withdrawTxMapList !== null
    ) {
      for (const e of object.withdrawTxMapList) {
        message.withdrawTxMapList.push(WithdrawTxMap.fromPartial(e));
      }
    }
    if (
      object.pendingWithdrawalList !== undefined &&
      object.pendingWithdrawalList !== null
    ) {
      for (const e of object.pendingWithdrawalList) {
        message.pendingWithdrawalList.push(PendingWithdrawal.fromPartial(e));
      }
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
