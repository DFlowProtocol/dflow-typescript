/* eslint-disable */
import { Params } from "../auction/params";
import { GlobalAuctionState } from "../auction/global_auction_state";
import { OrderFlowAuction } from "../auction/order_flow_auction";
import { EncodedExpiringAuctions } from "../auction/encoded_expiring_auctions";
import { Endorsements } from "../auction/endorsements";
import { Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.auction";

/** GenesisState defines the auction module's genesis state. */
export interface GenesisState {
  params: Params | undefined;
  globalAuctionState: GlobalAuctionState | undefined;
  orderFlowAuctionList: OrderFlowAuction[];
  encodedExpiringAuctions: EncodedExpiringAuctions | undefined;
  /** this line is used by starport scaffolding # genesis/proto/state */
  endorsementsList: Endorsements[];
}

const baseGenesisState: object = {};

export const GenesisState = {
  encode(message: GenesisState, writer: Writer = Writer.create()): Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    if (message.globalAuctionState !== undefined) {
      GlobalAuctionState.encode(
        message.globalAuctionState,
        writer.uint32(18).fork()
      ).ldelim();
    }
    for (const v of message.orderFlowAuctionList) {
      OrderFlowAuction.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.encodedExpiringAuctions !== undefined) {
      EncodedExpiringAuctions.encode(
        message.encodedExpiringAuctions,
        writer.uint32(34).fork()
      ).ldelim();
    }
    for (const v of message.endorsementsList) {
      Endorsements.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGenesisState } as GenesisState;
    message.orderFlowAuctionList = [];
    message.endorsementsList = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.globalAuctionState = GlobalAuctionState.decode(
            reader,
            reader.uint32()
          );
          break;
        case 3:
          message.orderFlowAuctionList.push(
            OrderFlowAuction.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.encodedExpiringAuctions = EncodedExpiringAuctions.decode(
            reader,
            reader.uint32()
          );
          break;
        case 5:
          message.endorsementsList.push(
            Endorsements.decode(reader, reader.uint32())
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
    message.orderFlowAuctionList = [];
    message.endorsementsList = [];
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromJSON(object.params);
    } else {
      message.params = undefined;
    }
    if (
      object.globalAuctionState !== undefined &&
      object.globalAuctionState !== null
    ) {
      message.globalAuctionState = GlobalAuctionState.fromJSON(
        object.globalAuctionState
      );
    } else {
      message.globalAuctionState = undefined;
    }
    if (
      object.orderFlowAuctionList !== undefined &&
      object.orderFlowAuctionList !== null
    ) {
      for (const e of object.orderFlowAuctionList) {
        message.orderFlowAuctionList.push(OrderFlowAuction.fromJSON(e));
      }
    }
    if (
      object.encodedExpiringAuctions !== undefined &&
      object.encodedExpiringAuctions !== null
    ) {
      message.encodedExpiringAuctions = EncodedExpiringAuctions.fromJSON(
        object.encodedExpiringAuctions
      );
    } else {
      message.encodedExpiringAuctions = undefined;
    }
    if (
      object.endorsementsList !== undefined &&
      object.endorsementsList !== null
    ) {
      for (const e of object.endorsementsList) {
        message.endorsementsList.push(Endorsements.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    message.globalAuctionState !== undefined &&
      (obj.globalAuctionState = message.globalAuctionState
        ? GlobalAuctionState.toJSON(message.globalAuctionState)
        : undefined);
    if (message.orderFlowAuctionList) {
      obj.orderFlowAuctionList = message.orderFlowAuctionList.map((e) =>
        e ? OrderFlowAuction.toJSON(e) : undefined
      );
    } else {
      obj.orderFlowAuctionList = [];
    }
    message.encodedExpiringAuctions !== undefined &&
      (obj.encodedExpiringAuctions = message.encodedExpiringAuctions
        ? EncodedExpiringAuctions.toJSON(message.encodedExpiringAuctions)
        : undefined);
    if (message.endorsementsList) {
      obj.endorsementsList = message.endorsementsList.map((e) =>
        e ? Endorsements.toJSON(e) : undefined
      );
    } else {
      obj.endorsementsList = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<GenesisState>): GenesisState {
    const message = { ...baseGenesisState } as GenesisState;
    message.orderFlowAuctionList = [];
    message.endorsementsList = [];
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromPartial(object.params);
    } else {
      message.params = undefined;
    }
    if (
      object.globalAuctionState !== undefined &&
      object.globalAuctionState !== null
    ) {
      message.globalAuctionState = GlobalAuctionState.fromPartial(
        object.globalAuctionState
      );
    } else {
      message.globalAuctionState = undefined;
    }
    if (
      object.orderFlowAuctionList !== undefined &&
      object.orderFlowAuctionList !== null
    ) {
      for (const e of object.orderFlowAuctionList) {
        message.orderFlowAuctionList.push(OrderFlowAuction.fromPartial(e));
      }
    }
    if (
      object.encodedExpiringAuctions !== undefined &&
      object.encodedExpiringAuctions !== null
    ) {
      message.encodedExpiringAuctions = EncodedExpiringAuctions.fromPartial(
        object.encodedExpiringAuctions
      );
    } else {
      message.encodedExpiringAuctions = undefined;
    }
    if (
      object.endorsementsList !== undefined &&
      object.endorsementsList !== null
    ) {
      for (const e of object.endorsementsList) {
        message.endorsementsList.push(Endorsements.fromPartial(e));
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
