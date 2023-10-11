/* eslint-disable */
import { Params } from "../noncedbank/params";
import { NoncedBridgeState } from "../noncedbank/nonced_bridge_state";
import { Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.noncedbank";

/** GenesisState defines the noncedbank module's genesis state. */
export interface GenesisState {
  params: Params | undefined;
  /** this line is used by starport scaffolding # genesis/proto/state */
  noncedBridgeState: NoncedBridgeState | undefined;
}

const baseGenesisState: object = {};

export const GenesisState = {
  encode(message: GenesisState, writer: Writer = Writer.create()): Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    if (message.noncedBridgeState !== undefined) {
      NoncedBridgeState.encode(
        message.noncedBridgeState,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGenesisState } as GenesisState;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.noncedBridgeState = NoncedBridgeState.decode(
            reader,
            reader.uint32()
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
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromJSON(object.params);
    } else {
      message.params = undefined;
    }
    if (
      object.noncedBridgeState !== undefined &&
      object.noncedBridgeState !== null
    ) {
      message.noncedBridgeState = NoncedBridgeState.fromJSON(
        object.noncedBridgeState
      );
    } else {
      message.noncedBridgeState = undefined;
    }
    return message;
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    message.noncedBridgeState !== undefined &&
      (obj.noncedBridgeState = message.noncedBridgeState
        ? NoncedBridgeState.toJSON(message.noncedBridgeState)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<GenesisState>): GenesisState {
    const message = { ...baseGenesisState } as GenesisState;
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromPartial(object.params);
    } else {
      message.params = undefined;
    }
    if (
      object.noncedBridgeState !== undefined &&
      object.noncedBridgeState !== null
    ) {
      message.noncedBridgeState = NoncedBridgeState.fromPartial(
        object.noncedBridgeState
      );
    } else {
      message.noncedBridgeState = undefined;
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
