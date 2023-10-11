/* eslint-disable */
import * as Long from "long";
import { util, configure, Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.auction";

export interface AuctionCreatedEvent {
  /** The type of event */
  type: string;
  /** The auction ID */
  auctionId: number;
}

/** Auction epoch was incremented due to complete delivery */
export interface AuctionEpochCompletedEvent {
  /** The type of event */
  type: string;
  /** The auction ID */
  auctionId: number;
  /** The new epoch of the auction */
  newEpoch: number;
  /** The Unix time in milliseconds at which this auction will roll over */
  expiryTimestamp: number;
  /** The size of the winning bid in the new epoch */
  winningBid: number;
  /** The market maker in the new epoch */
  newMarketMaker: string;
  /** Amount of additional payment to the order flow source */
  ofsAdditionalPayment: number;
}

/** Auction epoch was incremented due to expiry */
export interface AuctionEpochExpiredEvent {
  /** The type of event */
  type: string;
  /** The auction ID */
  auctionId: number;
  /** The new epoch of the auction */
  newEpoch: number;
  /** The Unix time in milliseconds at which this auction will roll over */
  expiryTimestamp: number;
  /** The size of the winning bid in the new epoch */
  winningBid: number;
  /** The market maker in the new epoch */
  newMarketMaker: string;
  /** Amount of additional payment to the order flow source */
  ofsAdditionalPayment: number;
  /** Amount refunded to the market maker in the old epoch */
  mmRefund: number;
}

export interface AuctionDeletedEvent {
  /** The type of event */
  type: string;
  /** The auction ID */
  auctionId: number;
  /** The epoch at which the auction was deleted */
  epoch: number;
  /** Amount of additional payment to the order flow source */
  ofsAdditionalPayment: number;
  /** Amount refunded to the winning market maker */
  winnerRefund: number;
  /** Amount refunded to the leading market maker for the next epoch */
  leaderRefund: number;
}

export interface DeliverNotionalPaymentEvent {
  /** The type of event */
  type: string;
  /** The auction ID */
  auctionId: number;
  /** The epoch in which payment is being made */
  epoch: number;
  /** True iff delivery is for payment in lieu */
  isForPaymentInLieu: boolean;
  /** Payment made to the order flow source */
  ofsPayment: number;
}

const baseAuctionCreatedEvent: object = { type: "", auctionId: 0 };

export const AuctionCreatedEvent = {
  encode(
    message: AuctionCreatedEvent,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.auctionId !== 0) {
      writer.uint32(16).uint64(message.auctionId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): AuctionCreatedEvent {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAuctionCreatedEvent } as AuctionCreatedEvent;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.string();
          break;
        case 2:
          message.auctionId = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AuctionCreatedEvent {
    const message = { ...baseAuctionCreatedEvent } as AuctionCreatedEvent;
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = Number(object.auctionId);
    } else {
      message.auctionId = 0;
    }
    return message;
  },

  toJSON(message: AuctionCreatedEvent): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    return obj;
  },

  fromPartial(object: DeepPartial<AuctionCreatedEvent>): AuctionCreatedEvent {
    const message = { ...baseAuctionCreatedEvent } as AuctionCreatedEvent;
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = object.auctionId;
    } else {
      message.auctionId = 0;
    }
    return message;
  },
};

const baseAuctionEpochCompletedEvent: object = {
  type: "",
  auctionId: 0,
  newEpoch: 0,
  expiryTimestamp: 0,
  winningBid: 0,
  newMarketMaker: "",
  ofsAdditionalPayment: 0,
};

export const AuctionEpochCompletedEvent = {
  encode(
    message: AuctionEpochCompletedEvent,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.auctionId !== 0) {
      writer.uint32(16).uint64(message.auctionId);
    }
    if (message.newEpoch !== 0) {
      writer.uint32(24).uint64(message.newEpoch);
    }
    if (message.expiryTimestamp !== 0) {
      writer.uint32(32).int64(message.expiryTimestamp);
    }
    if (message.winningBid !== 0) {
      writer.uint32(40).uint64(message.winningBid);
    }
    if (message.newMarketMaker !== "") {
      writer.uint32(50).string(message.newMarketMaker);
    }
    if (message.ofsAdditionalPayment !== 0) {
      writer.uint32(56).uint64(message.ofsAdditionalPayment);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): AuctionEpochCompletedEvent {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseAuctionEpochCompletedEvent,
    } as AuctionEpochCompletedEvent;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.string();
          break;
        case 2:
          message.auctionId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.newEpoch = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.expiryTimestamp = longToNumber(reader.int64() as Long);
          break;
        case 5:
          message.winningBid = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.newMarketMaker = reader.string();
          break;
        case 7:
          message.ofsAdditionalPayment = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AuctionEpochCompletedEvent {
    const message = {
      ...baseAuctionEpochCompletedEvent,
    } as AuctionEpochCompletedEvent;
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = Number(object.auctionId);
    } else {
      message.auctionId = 0;
    }
    if (object.newEpoch !== undefined && object.newEpoch !== null) {
      message.newEpoch = Number(object.newEpoch);
    } else {
      message.newEpoch = 0;
    }
    if (
      object.expiryTimestamp !== undefined &&
      object.expiryTimestamp !== null
    ) {
      message.expiryTimestamp = Number(object.expiryTimestamp);
    } else {
      message.expiryTimestamp = 0;
    }
    if (object.winningBid !== undefined && object.winningBid !== null) {
      message.winningBid = Number(object.winningBid);
    } else {
      message.winningBid = 0;
    }
    if (object.newMarketMaker !== undefined && object.newMarketMaker !== null) {
      message.newMarketMaker = String(object.newMarketMaker);
    } else {
      message.newMarketMaker = "";
    }
    if (
      object.ofsAdditionalPayment !== undefined &&
      object.ofsAdditionalPayment !== null
    ) {
      message.ofsAdditionalPayment = Number(object.ofsAdditionalPayment);
    } else {
      message.ofsAdditionalPayment = 0;
    }
    return message;
  },

  toJSON(message: AuctionEpochCompletedEvent): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    message.newEpoch !== undefined && (obj.newEpoch = message.newEpoch);
    message.expiryTimestamp !== undefined &&
      (obj.expiryTimestamp = message.expiryTimestamp);
    message.winningBid !== undefined && (obj.winningBid = message.winningBid);
    message.newMarketMaker !== undefined &&
      (obj.newMarketMaker = message.newMarketMaker);
    message.ofsAdditionalPayment !== undefined &&
      (obj.ofsAdditionalPayment = message.ofsAdditionalPayment);
    return obj;
  },

  fromPartial(
    object: DeepPartial<AuctionEpochCompletedEvent>
  ): AuctionEpochCompletedEvent {
    const message = {
      ...baseAuctionEpochCompletedEvent,
    } as AuctionEpochCompletedEvent;
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = object.auctionId;
    } else {
      message.auctionId = 0;
    }
    if (object.newEpoch !== undefined && object.newEpoch !== null) {
      message.newEpoch = object.newEpoch;
    } else {
      message.newEpoch = 0;
    }
    if (
      object.expiryTimestamp !== undefined &&
      object.expiryTimestamp !== null
    ) {
      message.expiryTimestamp = object.expiryTimestamp;
    } else {
      message.expiryTimestamp = 0;
    }
    if (object.winningBid !== undefined && object.winningBid !== null) {
      message.winningBid = object.winningBid;
    } else {
      message.winningBid = 0;
    }
    if (object.newMarketMaker !== undefined && object.newMarketMaker !== null) {
      message.newMarketMaker = object.newMarketMaker;
    } else {
      message.newMarketMaker = "";
    }
    if (
      object.ofsAdditionalPayment !== undefined &&
      object.ofsAdditionalPayment !== null
    ) {
      message.ofsAdditionalPayment = object.ofsAdditionalPayment;
    } else {
      message.ofsAdditionalPayment = 0;
    }
    return message;
  },
};

const baseAuctionEpochExpiredEvent: object = {
  type: "",
  auctionId: 0,
  newEpoch: 0,
  expiryTimestamp: 0,
  winningBid: 0,
  newMarketMaker: "",
  ofsAdditionalPayment: 0,
  mmRefund: 0,
};

export const AuctionEpochExpiredEvent = {
  encode(
    message: AuctionEpochExpiredEvent,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.auctionId !== 0) {
      writer.uint32(16).uint64(message.auctionId);
    }
    if (message.newEpoch !== 0) {
      writer.uint32(24).uint64(message.newEpoch);
    }
    if (message.expiryTimestamp !== 0) {
      writer.uint32(32).int64(message.expiryTimestamp);
    }
    if (message.winningBid !== 0) {
      writer.uint32(40).uint64(message.winningBid);
    }
    if (message.newMarketMaker !== "") {
      writer.uint32(50).string(message.newMarketMaker);
    }
    if (message.ofsAdditionalPayment !== 0) {
      writer.uint32(56).uint64(message.ofsAdditionalPayment);
    }
    if (message.mmRefund !== 0) {
      writer.uint32(64).uint64(message.mmRefund);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): AuctionEpochExpiredEvent {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseAuctionEpochExpiredEvent,
    } as AuctionEpochExpiredEvent;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.string();
          break;
        case 2:
          message.auctionId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.newEpoch = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.expiryTimestamp = longToNumber(reader.int64() as Long);
          break;
        case 5:
          message.winningBid = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.newMarketMaker = reader.string();
          break;
        case 7:
          message.ofsAdditionalPayment = longToNumber(reader.uint64() as Long);
          break;
        case 8:
          message.mmRefund = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AuctionEpochExpiredEvent {
    const message = {
      ...baseAuctionEpochExpiredEvent,
    } as AuctionEpochExpiredEvent;
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = Number(object.auctionId);
    } else {
      message.auctionId = 0;
    }
    if (object.newEpoch !== undefined && object.newEpoch !== null) {
      message.newEpoch = Number(object.newEpoch);
    } else {
      message.newEpoch = 0;
    }
    if (
      object.expiryTimestamp !== undefined &&
      object.expiryTimestamp !== null
    ) {
      message.expiryTimestamp = Number(object.expiryTimestamp);
    } else {
      message.expiryTimestamp = 0;
    }
    if (object.winningBid !== undefined && object.winningBid !== null) {
      message.winningBid = Number(object.winningBid);
    } else {
      message.winningBid = 0;
    }
    if (object.newMarketMaker !== undefined && object.newMarketMaker !== null) {
      message.newMarketMaker = String(object.newMarketMaker);
    } else {
      message.newMarketMaker = "";
    }
    if (
      object.ofsAdditionalPayment !== undefined &&
      object.ofsAdditionalPayment !== null
    ) {
      message.ofsAdditionalPayment = Number(object.ofsAdditionalPayment);
    } else {
      message.ofsAdditionalPayment = 0;
    }
    if (object.mmRefund !== undefined && object.mmRefund !== null) {
      message.mmRefund = Number(object.mmRefund);
    } else {
      message.mmRefund = 0;
    }
    return message;
  },

  toJSON(message: AuctionEpochExpiredEvent): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    message.newEpoch !== undefined && (obj.newEpoch = message.newEpoch);
    message.expiryTimestamp !== undefined &&
      (obj.expiryTimestamp = message.expiryTimestamp);
    message.winningBid !== undefined && (obj.winningBid = message.winningBid);
    message.newMarketMaker !== undefined &&
      (obj.newMarketMaker = message.newMarketMaker);
    message.ofsAdditionalPayment !== undefined &&
      (obj.ofsAdditionalPayment = message.ofsAdditionalPayment);
    message.mmRefund !== undefined && (obj.mmRefund = message.mmRefund);
    return obj;
  },

  fromPartial(
    object: DeepPartial<AuctionEpochExpiredEvent>
  ): AuctionEpochExpiredEvent {
    const message = {
      ...baseAuctionEpochExpiredEvent,
    } as AuctionEpochExpiredEvent;
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = object.auctionId;
    } else {
      message.auctionId = 0;
    }
    if (object.newEpoch !== undefined && object.newEpoch !== null) {
      message.newEpoch = object.newEpoch;
    } else {
      message.newEpoch = 0;
    }
    if (
      object.expiryTimestamp !== undefined &&
      object.expiryTimestamp !== null
    ) {
      message.expiryTimestamp = object.expiryTimestamp;
    } else {
      message.expiryTimestamp = 0;
    }
    if (object.winningBid !== undefined && object.winningBid !== null) {
      message.winningBid = object.winningBid;
    } else {
      message.winningBid = 0;
    }
    if (object.newMarketMaker !== undefined && object.newMarketMaker !== null) {
      message.newMarketMaker = object.newMarketMaker;
    } else {
      message.newMarketMaker = "";
    }
    if (
      object.ofsAdditionalPayment !== undefined &&
      object.ofsAdditionalPayment !== null
    ) {
      message.ofsAdditionalPayment = object.ofsAdditionalPayment;
    } else {
      message.ofsAdditionalPayment = 0;
    }
    if (object.mmRefund !== undefined && object.mmRefund !== null) {
      message.mmRefund = object.mmRefund;
    } else {
      message.mmRefund = 0;
    }
    return message;
  },
};

const baseAuctionDeletedEvent: object = {
  type: "",
  auctionId: 0,
  epoch: 0,
  ofsAdditionalPayment: 0,
  winnerRefund: 0,
  leaderRefund: 0,
};

export const AuctionDeletedEvent = {
  encode(
    message: AuctionDeletedEvent,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.auctionId !== 0) {
      writer.uint32(16).uint64(message.auctionId);
    }
    if (message.epoch !== 0) {
      writer.uint32(24).uint64(message.epoch);
    }
    if (message.ofsAdditionalPayment !== 0) {
      writer.uint32(32).uint64(message.ofsAdditionalPayment);
    }
    if (message.winnerRefund !== 0) {
      writer.uint32(40).uint64(message.winnerRefund);
    }
    if (message.leaderRefund !== 0) {
      writer.uint32(48).uint64(message.leaderRefund);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): AuctionDeletedEvent {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAuctionDeletedEvent } as AuctionDeletedEvent;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.string();
          break;
        case 2:
          message.auctionId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.epoch = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.ofsAdditionalPayment = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.winnerRefund = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.leaderRefund = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AuctionDeletedEvent {
    const message = { ...baseAuctionDeletedEvent } as AuctionDeletedEvent;
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = Number(object.auctionId);
    } else {
      message.auctionId = 0;
    }
    if (object.epoch !== undefined && object.epoch !== null) {
      message.epoch = Number(object.epoch);
    } else {
      message.epoch = 0;
    }
    if (
      object.ofsAdditionalPayment !== undefined &&
      object.ofsAdditionalPayment !== null
    ) {
      message.ofsAdditionalPayment = Number(object.ofsAdditionalPayment);
    } else {
      message.ofsAdditionalPayment = 0;
    }
    if (object.winnerRefund !== undefined && object.winnerRefund !== null) {
      message.winnerRefund = Number(object.winnerRefund);
    } else {
      message.winnerRefund = 0;
    }
    if (object.leaderRefund !== undefined && object.leaderRefund !== null) {
      message.leaderRefund = Number(object.leaderRefund);
    } else {
      message.leaderRefund = 0;
    }
    return message;
  },

  toJSON(message: AuctionDeletedEvent): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    message.epoch !== undefined && (obj.epoch = message.epoch);
    message.ofsAdditionalPayment !== undefined &&
      (obj.ofsAdditionalPayment = message.ofsAdditionalPayment);
    message.winnerRefund !== undefined &&
      (obj.winnerRefund = message.winnerRefund);
    message.leaderRefund !== undefined &&
      (obj.leaderRefund = message.leaderRefund);
    return obj;
  },

  fromPartial(object: DeepPartial<AuctionDeletedEvent>): AuctionDeletedEvent {
    const message = { ...baseAuctionDeletedEvent } as AuctionDeletedEvent;
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = object.auctionId;
    } else {
      message.auctionId = 0;
    }
    if (object.epoch !== undefined && object.epoch !== null) {
      message.epoch = object.epoch;
    } else {
      message.epoch = 0;
    }
    if (
      object.ofsAdditionalPayment !== undefined &&
      object.ofsAdditionalPayment !== null
    ) {
      message.ofsAdditionalPayment = object.ofsAdditionalPayment;
    } else {
      message.ofsAdditionalPayment = 0;
    }
    if (object.winnerRefund !== undefined && object.winnerRefund !== null) {
      message.winnerRefund = object.winnerRefund;
    } else {
      message.winnerRefund = 0;
    }
    if (object.leaderRefund !== undefined && object.leaderRefund !== null) {
      message.leaderRefund = object.leaderRefund;
    } else {
      message.leaderRefund = 0;
    }
    return message;
  },
};

const baseDeliverNotionalPaymentEvent: object = {
  type: "",
  auctionId: 0,
  epoch: 0,
  isForPaymentInLieu: false,
  ofsPayment: 0,
};

export const DeliverNotionalPaymentEvent = {
  encode(
    message: DeliverNotionalPaymentEvent,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.auctionId !== 0) {
      writer.uint32(16).uint64(message.auctionId);
    }
    if (message.epoch !== 0) {
      writer.uint32(24).uint64(message.epoch);
    }
    if (message.isForPaymentInLieu === true) {
      writer.uint32(32).bool(message.isForPaymentInLieu);
    }
    if (message.ofsPayment !== 0) {
      writer.uint32(40).uint64(message.ofsPayment);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeliverNotionalPaymentEvent {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeliverNotionalPaymentEvent,
    } as DeliverNotionalPaymentEvent;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.string();
          break;
        case 2:
          message.auctionId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.epoch = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.isForPaymentInLieu = reader.bool();
          break;
        case 5:
          message.ofsPayment = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeliverNotionalPaymentEvent {
    const message = {
      ...baseDeliverNotionalPaymentEvent,
    } as DeliverNotionalPaymentEvent;
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = Number(object.auctionId);
    } else {
      message.auctionId = 0;
    }
    if (object.epoch !== undefined && object.epoch !== null) {
      message.epoch = Number(object.epoch);
    } else {
      message.epoch = 0;
    }
    if (
      object.isForPaymentInLieu !== undefined &&
      object.isForPaymentInLieu !== null
    ) {
      message.isForPaymentInLieu = Boolean(object.isForPaymentInLieu);
    } else {
      message.isForPaymentInLieu = false;
    }
    if (object.ofsPayment !== undefined && object.ofsPayment !== null) {
      message.ofsPayment = Number(object.ofsPayment);
    } else {
      message.ofsPayment = 0;
    }
    return message;
  },

  toJSON(message: DeliverNotionalPaymentEvent): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    message.epoch !== undefined && (obj.epoch = message.epoch);
    message.isForPaymentInLieu !== undefined &&
      (obj.isForPaymentInLieu = message.isForPaymentInLieu);
    message.ofsPayment !== undefined && (obj.ofsPayment = message.ofsPayment);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DeliverNotionalPaymentEvent>
  ): DeliverNotionalPaymentEvent {
    const message = {
      ...baseDeliverNotionalPaymentEvent,
    } as DeliverNotionalPaymentEvent;
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = object.auctionId;
    } else {
      message.auctionId = 0;
    }
    if (object.epoch !== undefined && object.epoch !== null) {
      message.epoch = object.epoch;
    } else {
      message.epoch = 0;
    }
    if (
      object.isForPaymentInLieu !== undefined &&
      object.isForPaymentInLieu !== null
    ) {
      message.isForPaymentInLieu = object.isForPaymentInLieu;
    } else {
      message.isForPaymentInLieu = false;
    }
    if (object.ofsPayment !== undefined && object.ofsPayment !== null) {
      message.ofsPayment = object.ofsPayment;
    } else {
      message.ofsPayment = 0;
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
