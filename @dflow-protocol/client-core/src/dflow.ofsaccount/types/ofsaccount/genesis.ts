/* eslint-disable */
import { Params } from "../ofsaccount/params";
import { OrderFlowSource } from "../ofsaccount/order_flow_source";
import { Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.ofsaccount";

/** GenesisState defines the ofsaccount module's genesis state. */
export interface GenesisState {
  params: Params | undefined;
  /** this line is used by starport scaffolding # genesis/proto/state */
  orderFlowSourceList: OrderFlowSource[];
}

const baseGenesisState: object = {};

export const GenesisState = {
  encode(message: GenesisState, writer: Writer = Writer.create()): Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.orderFlowSourceList) {
      OrderFlowSource.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGenesisState } as GenesisState;
    message.orderFlowSourceList = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.orderFlowSourceList.push(
            OrderFlowSource.decode(reader, reader.uint32())
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
    message.orderFlowSourceList = [];
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromJSON(object.params);
    } else {
      message.params = undefined;
    }
    if (
      object.orderFlowSourceList !== undefined &&
      object.orderFlowSourceList !== null
    ) {
      for (const e of object.orderFlowSourceList) {
        message.orderFlowSourceList.push(OrderFlowSource.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    if (message.orderFlowSourceList) {
      obj.orderFlowSourceList = message.orderFlowSourceList.map((e) =>
        e ? OrderFlowSource.toJSON(e) : undefined
      );
    } else {
      obj.orderFlowSourceList = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<GenesisState>): GenesisState {
    const message = { ...baseGenesisState } as GenesisState;
    message.orderFlowSourceList = [];
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromPartial(object.params);
    } else {
      message.params = undefined;
    }
    if (
      object.orderFlowSourceList !== undefined &&
      object.orderFlowSourceList !== null
    ) {
      for (const e of object.orderFlowSourceList) {
        message.orderFlowSourceList.push(OrderFlowSource.fromPartial(e));
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
