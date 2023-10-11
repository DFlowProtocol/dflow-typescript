/* eslint-disable */
import * as Long from "long";
import { util, configure, Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "dflow.auction";

export interface BlindBid {
  hash: string;
  marketMakerPublicKey: string;
  revealedValue: number;
  isRevealed: boolean;
}

export interface BidInfo {
  marketMakerPublicKey: string;
  marketMakerUrl: string;
  bid: number;
}

export interface OrderFlowAuction {
  ofsPublicKey: string;
  auctionId: number;
  clientAuctionId: string;
  baseCurrency: string;
  quoteCurrency: string;
  minimumOrderSize: number;
  maximumOrderSize: number;
  notionalSize: number;
  maxDeliveryPeriod: number;
  /** Total notional value of order flow delivered during the current epoch. Includes notional delivered for payment in lieu. */
  deliveredNotionalSize: number;
  /** Total notional value of order flow delivered over the lifetime of the auction. Includes notional delivered for payment in lieu. */
  lifetimeDeliveredNotionalSize: number;
  /** Total notional value of deliveries for payment in lieu during the current epoch */
  paymentInLieuDeliveredNotionalSize: number;
  /** Total notional value of deliveries for payment in lieu over the lifetime of the auction */
  paymentInLieuLifetimeDeliveredNotionalSize: number;
  feePayerMode: number;
  /** A boolean indicating whether the payment in lieu is enabled for the auction */
  isPaymentInLieuEnabled: boolean;
  /** A boolean indicating whether the auction is unidirectional */
  isUnidirectional: boolean;
  extensions: string;
  network: string;
  epoch: number;
  /** The Unix timestamp at and after which blind bids for the current epoch will be rejected, given in milliseconds since January 1, 1970 UTC */
  blindBidEndTimestamp: number;
  /** The notional time at and after which blind bids for the current epoch will be rejected */
  blindBidEndNotionalTime: number;
  leader: BidInfo | undefined;
  winner: BidInfo | undefined;
  blindBids: BlindBid[];
}

export interface AuctionGridDataRow {
  ofsPublicKey: string;
  auctionId: number;
  clientAuctionId: string;
  baseCurrency: string;
  quoteCurrency: string;
  minimumOrderSize: number;
  maximumOrderSize: number;
  notionalSize: number;
  maxDeliveryPeriod: number;
  deliveredNotionalSize: number;
  lifetimeDeliveredNotionalSize: number;
  paymentInLieuDeliveredNotionalSize: number;
  paymentInLieuLifetimeDeliveredNotionalSize: number;
  feePayerMode: number;
  isPaymentInLieuEnabled: boolean;
  isUnidirectional: boolean;
  extensions: string;
  network: string;
  epoch: number;
  epochCutoffTimestamp: number;
  /** The Unix timestamp at and after which blind bids for the current epoch will be rejected, given in milliseconds since January 1, 1970 UTC */
  blindBidEndTimestamp: number;
  /** The notional time at and after which blind bids for the current epoch will be rejected */
  blindBidEndNotionalTime: number;
  leader: BidInfo | undefined;
  winner: BidInfo | undefined;
  blindBids: BlindBid[];
  payment: AuctionGridDataRow_OFSPayment | undefined;
  overlap: AuctionGridDataRow_Overlap | undefined;
}

export interface AuctionGridDataRow_OFSPayment {
  /** Amount already paid to the OFS during the current epoch */
  paid: number;
  /**
   * Total amount that the OFS deserves based on current delivered notional. This may be different
   * than `currentPaymentToOfs` in the event of underflow.
   */
  realized: number;
  /** Winning bid less realized */
  unrealized: number;
}

export interface AuctionGridDataRow_Overlap {
  hasOverlap: boolean;
}

const baseBlindBid: object = {
  hash: "",
  marketMakerPublicKey: "",
  revealedValue: 0,
  isRevealed: false,
};

export const BlindBid = {
  encode(message: BlindBid, writer: Writer = Writer.create()): Writer {
    if (message.hash !== "") {
      writer.uint32(10).string(message.hash);
    }
    if (message.marketMakerPublicKey !== "") {
      writer.uint32(18).string(message.marketMakerPublicKey);
    }
    if (message.revealedValue !== 0) {
      writer.uint32(24).uint64(message.revealedValue);
    }
    if (message.isRevealed === true) {
      writer.uint32(32).bool(message.isRevealed);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): BlindBid {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseBlindBid } as BlindBid;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hash = reader.string();
          break;
        case 2:
          message.marketMakerPublicKey = reader.string();
          break;
        case 3:
          message.revealedValue = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.isRevealed = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BlindBid {
    const message = { ...baseBlindBid } as BlindBid;
    if (object.hash !== undefined && object.hash !== null) {
      message.hash = String(object.hash);
    } else {
      message.hash = "";
    }
    if (
      object.marketMakerPublicKey !== undefined &&
      object.marketMakerPublicKey !== null
    ) {
      message.marketMakerPublicKey = String(object.marketMakerPublicKey);
    } else {
      message.marketMakerPublicKey = "";
    }
    if (object.revealedValue !== undefined && object.revealedValue !== null) {
      message.revealedValue = Number(object.revealedValue);
    } else {
      message.revealedValue = 0;
    }
    if (object.isRevealed !== undefined && object.isRevealed !== null) {
      message.isRevealed = Boolean(object.isRevealed);
    } else {
      message.isRevealed = false;
    }
    return message;
  },

  toJSON(message: BlindBid): unknown {
    const obj: any = {};
    message.hash !== undefined && (obj.hash = message.hash);
    message.marketMakerPublicKey !== undefined &&
      (obj.marketMakerPublicKey = message.marketMakerPublicKey);
    message.revealedValue !== undefined &&
      (obj.revealedValue = message.revealedValue);
    message.isRevealed !== undefined && (obj.isRevealed = message.isRevealed);
    return obj;
  },

  fromPartial(object: DeepPartial<BlindBid>): BlindBid {
    const message = { ...baseBlindBid } as BlindBid;
    if (object.hash !== undefined && object.hash !== null) {
      message.hash = object.hash;
    } else {
      message.hash = "";
    }
    if (
      object.marketMakerPublicKey !== undefined &&
      object.marketMakerPublicKey !== null
    ) {
      message.marketMakerPublicKey = object.marketMakerPublicKey;
    } else {
      message.marketMakerPublicKey = "";
    }
    if (object.revealedValue !== undefined && object.revealedValue !== null) {
      message.revealedValue = object.revealedValue;
    } else {
      message.revealedValue = 0;
    }
    if (object.isRevealed !== undefined && object.isRevealed !== null) {
      message.isRevealed = object.isRevealed;
    } else {
      message.isRevealed = false;
    }
    return message;
  },
};

const baseBidInfo: object = {
  marketMakerPublicKey: "",
  marketMakerUrl: "",
  bid: 0,
};

export const BidInfo = {
  encode(message: BidInfo, writer: Writer = Writer.create()): Writer {
    if (message.marketMakerPublicKey !== "") {
      writer.uint32(10).string(message.marketMakerPublicKey);
    }
    if (message.marketMakerUrl !== "") {
      writer.uint32(18).string(message.marketMakerUrl);
    }
    if (message.bid !== 0) {
      writer.uint32(24).uint64(message.bid);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): BidInfo {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseBidInfo } as BidInfo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.marketMakerPublicKey = reader.string();
          break;
        case 2:
          message.marketMakerUrl = reader.string();
          break;
        case 3:
          message.bid = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BidInfo {
    const message = { ...baseBidInfo } as BidInfo;
    if (
      object.marketMakerPublicKey !== undefined &&
      object.marketMakerPublicKey !== null
    ) {
      message.marketMakerPublicKey = String(object.marketMakerPublicKey);
    } else {
      message.marketMakerPublicKey = "";
    }
    if (object.marketMakerUrl !== undefined && object.marketMakerUrl !== null) {
      message.marketMakerUrl = String(object.marketMakerUrl);
    } else {
      message.marketMakerUrl = "";
    }
    if (object.bid !== undefined && object.bid !== null) {
      message.bid = Number(object.bid);
    } else {
      message.bid = 0;
    }
    return message;
  },

  toJSON(message: BidInfo): unknown {
    const obj: any = {};
    message.marketMakerPublicKey !== undefined &&
      (obj.marketMakerPublicKey = message.marketMakerPublicKey);
    message.marketMakerUrl !== undefined &&
      (obj.marketMakerUrl = message.marketMakerUrl);
    message.bid !== undefined && (obj.bid = message.bid);
    return obj;
  },

  fromPartial(object: DeepPartial<BidInfo>): BidInfo {
    const message = { ...baseBidInfo } as BidInfo;
    if (
      object.marketMakerPublicKey !== undefined &&
      object.marketMakerPublicKey !== null
    ) {
      message.marketMakerPublicKey = object.marketMakerPublicKey;
    } else {
      message.marketMakerPublicKey = "";
    }
    if (object.marketMakerUrl !== undefined && object.marketMakerUrl !== null) {
      message.marketMakerUrl = object.marketMakerUrl;
    } else {
      message.marketMakerUrl = "";
    }
    if (object.bid !== undefined && object.bid !== null) {
      message.bid = object.bid;
    } else {
      message.bid = 0;
    }
    return message;
  },
};

const baseOrderFlowAuction: object = {
  ofsPublicKey: "",
  auctionId: 0,
  clientAuctionId: "",
  baseCurrency: "",
  quoteCurrency: "",
  minimumOrderSize: 0,
  maximumOrderSize: 0,
  notionalSize: 0,
  maxDeliveryPeriod: 0,
  deliveredNotionalSize: 0,
  lifetimeDeliveredNotionalSize: 0,
  paymentInLieuDeliveredNotionalSize: 0,
  paymentInLieuLifetimeDeliveredNotionalSize: 0,
  feePayerMode: 0,
  isPaymentInLieuEnabled: false,
  isUnidirectional: false,
  extensions: "",
  network: "",
  epoch: 0,
  blindBidEndTimestamp: 0,
  blindBidEndNotionalTime: 0,
};

export const OrderFlowAuction = {
  encode(message: OrderFlowAuction, writer: Writer = Writer.create()): Writer {
    if (message.ofsPublicKey !== "") {
      writer.uint32(10).string(message.ofsPublicKey);
    }
    if (message.auctionId !== 0) {
      writer.uint32(16).uint64(message.auctionId);
    }
    if (message.clientAuctionId !== "") {
      writer.uint32(26).string(message.clientAuctionId);
    }
    if (message.baseCurrency !== "") {
      writer.uint32(34).string(message.baseCurrency);
    }
    if (message.quoteCurrency !== "") {
      writer.uint32(42).string(message.quoteCurrency);
    }
    if (message.minimumOrderSize !== 0) {
      writer.uint32(48).uint64(message.minimumOrderSize);
    }
    if (message.maximumOrderSize !== 0) {
      writer.uint32(56).uint64(message.maximumOrderSize);
    }
    if (message.notionalSize !== 0) {
      writer.uint32(64).uint64(message.notionalSize);
    }
    if (message.maxDeliveryPeriod !== 0) {
      writer.uint32(72).int64(message.maxDeliveryPeriod);
    }
    if (message.deliveredNotionalSize !== 0) {
      writer.uint32(80).uint64(message.deliveredNotionalSize);
    }
    if (message.lifetimeDeliveredNotionalSize !== 0) {
      writer.uint32(88).uint64(message.lifetimeDeliveredNotionalSize);
    }
    if (message.paymentInLieuDeliveredNotionalSize !== 0) {
      writer.uint32(96).uint64(message.paymentInLieuDeliveredNotionalSize);
    }
    if (message.paymentInLieuLifetimeDeliveredNotionalSize !== 0) {
      writer
        .uint32(104)
        .uint64(message.paymentInLieuLifetimeDeliveredNotionalSize);
    }
    if (message.feePayerMode !== 0) {
      writer.uint32(112).uint32(message.feePayerMode);
    }
    if (message.isPaymentInLieuEnabled === true) {
      writer.uint32(120).bool(message.isPaymentInLieuEnabled);
    }
    if (message.isUnidirectional === true) {
      writer.uint32(128).bool(message.isUnidirectional);
    }
    if (message.extensions !== "") {
      writer.uint32(138).string(message.extensions);
    }
    if (message.network !== "") {
      writer.uint32(146).string(message.network);
    }
    if (message.epoch !== 0) {
      writer.uint32(152).uint64(message.epoch);
    }
    if (message.blindBidEndTimestamp !== 0) {
      writer.uint32(160).int64(message.blindBidEndTimestamp);
    }
    if (message.blindBidEndNotionalTime !== 0) {
      writer.uint32(168).uint64(message.blindBidEndNotionalTime);
    }
    if (message.leader !== undefined) {
      BidInfo.encode(message.leader, writer.uint32(178).fork()).ldelim();
    }
    if (message.winner !== undefined) {
      BidInfo.encode(message.winner, writer.uint32(186).fork()).ldelim();
    }
    for (const v of message.blindBids) {
      BlindBid.encode(v!, writer.uint32(194).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): OrderFlowAuction {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseOrderFlowAuction } as OrderFlowAuction;
    message.blindBids = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ofsPublicKey = reader.string();
          break;
        case 2:
          message.auctionId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.clientAuctionId = reader.string();
          break;
        case 4:
          message.baseCurrency = reader.string();
          break;
        case 5:
          message.quoteCurrency = reader.string();
          break;
        case 6:
          message.minimumOrderSize = longToNumber(reader.uint64() as Long);
          break;
        case 7:
          message.maximumOrderSize = longToNumber(reader.uint64() as Long);
          break;
        case 8:
          message.notionalSize = longToNumber(reader.uint64() as Long);
          break;
        case 9:
          message.maxDeliveryPeriod = longToNumber(reader.int64() as Long);
          break;
        case 10:
          message.deliveredNotionalSize = longToNumber(reader.uint64() as Long);
          break;
        case 11:
          message.lifetimeDeliveredNotionalSize = longToNumber(
            reader.uint64() as Long
          );
          break;
        case 12:
          message.paymentInLieuDeliveredNotionalSize = longToNumber(
            reader.uint64() as Long
          );
          break;
        case 13:
          message.paymentInLieuLifetimeDeliveredNotionalSize = longToNumber(
            reader.uint64() as Long
          );
          break;
        case 14:
          message.feePayerMode = reader.uint32();
          break;
        case 15:
          message.isPaymentInLieuEnabled = reader.bool();
          break;
        case 16:
          message.isUnidirectional = reader.bool();
          break;
        case 17:
          message.extensions = reader.string();
          break;
        case 18:
          message.network = reader.string();
          break;
        case 19:
          message.epoch = longToNumber(reader.uint64() as Long);
          break;
        case 20:
          message.blindBidEndTimestamp = longToNumber(reader.int64() as Long);
          break;
        case 21:
          message.blindBidEndNotionalTime = longToNumber(
            reader.uint64() as Long
          );
          break;
        case 22:
          message.leader = BidInfo.decode(reader, reader.uint32());
          break;
        case 23:
          message.winner = BidInfo.decode(reader, reader.uint32());
          break;
        case 24:
          message.blindBids.push(BlindBid.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OrderFlowAuction {
    const message = { ...baseOrderFlowAuction } as OrderFlowAuction;
    message.blindBids = [];
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = String(object.ofsPublicKey);
    } else {
      message.ofsPublicKey = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = Number(object.auctionId);
    } else {
      message.auctionId = 0;
    }
    if (
      object.clientAuctionId !== undefined &&
      object.clientAuctionId !== null
    ) {
      message.clientAuctionId = String(object.clientAuctionId);
    } else {
      message.clientAuctionId = "";
    }
    if (object.baseCurrency !== undefined && object.baseCurrency !== null) {
      message.baseCurrency = String(object.baseCurrency);
    } else {
      message.baseCurrency = "";
    }
    if (object.quoteCurrency !== undefined && object.quoteCurrency !== null) {
      message.quoteCurrency = String(object.quoteCurrency);
    } else {
      message.quoteCurrency = "";
    }
    if (
      object.minimumOrderSize !== undefined &&
      object.minimumOrderSize !== null
    ) {
      message.minimumOrderSize = Number(object.minimumOrderSize);
    } else {
      message.minimumOrderSize = 0;
    }
    if (
      object.maximumOrderSize !== undefined &&
      object.maximumOrderSize !== null
    ) {
      message.maximumOrderSize = Number(object.maximumOrderSize);
    } else {
      message.maximumOrderSize = 0;
    }
    if (object.notionalSize !== undefined && object.notionalSize !== null) {
      message.notionalSize = Number(object.notionalSize);
    } else {
      message.notionalSize = 0;
    }
    if (
      object.maxDeliveryPeriod !== undefined &&
      object.maxDeliveryPeriod !== null
    ) {
      message.maxDeliveryPeriod = Number(object.maxDeliveryPeriod);
    } else {
      message.maxDeliveryPeriod = 0;
    }
    if (
      object.deliveredNotionalSize !== undefined &&
      object.deliveredNotionalSize !== null
    ) {
      message.deliveredNotionalSize = Number(object.deliveredNotionalSize);
    } else {
      message.deliveredNotionalSize = 0;
    }
    if (
      object.lifetimeDeliveredNotionalSize !== undefined &&
      object.lifetimeDeliveredNotionalSize !== null
    ) {
      message.lifetimeDeliveredNotionalSize = Number(
        object.lifetimeDeliveredNotionalSize
      );
    } else {
      message.lifetimeDeliveredNotionalSize = 0;
    }
    if (
      object.paymentInLieuDeliveredNotionalSize !== undefined &&
      object.paymentInLieuDeliveredNotionalSize !== null
    ) {
      message.paymentInLieuDeliveredNotionalSize = Number(
        object.paymentInLieuDeliveredNotionalSize
      );
    } else {
      message.paymentInLieuDeliveredNotionalSize = 0;
    }
    if (
      object.paymentInLieuLifetimeDeliveredNotionalSize !== undefined &&
      object.paymentInLieuLifetimeDeliveredNotionalSize !== null
    ) {
      message.paymentInLieuLifetimeDeliveredNotionalSize = Number(
        object.paymentInLieuLifetimeDeliveredNotionalSize
      );
    } else {
      message.paymentInLieuLifetimeDeliveredNotionalSize = 0;
    }
    if (object.feePayerMode !== undefined && object.feePayerMode !== null) {
      message.feePayerMode = Number(object.feePayerMode);
    } else {
      message.feePayerMode = 0;
    }
    if (
      object.isPaymentInLieuEnabled !== undefined &&
      object.isPaymentInLieuEnabled !== null
    ) {
      message.isPaymentInLieuEnabled = Boolean(object.isPaymentInLieuEnabled);
    } else {
      message.isPaymentInLieuEnabled = false;
    }
    if (
      object.isUnidirectional !== undefined &&
      object.isUnidirectional !== null
    ) {
      message.isUnidirectional = Boolean(object.isUnidirectional);
    } else {
      message.isUnidirectional = false;
    }
    if (object.extensions !== undefined && object.extensions !== null) {
      message.extensions = String(object.extensions);
    } else {
      message.extensions = "";
    }
    if (object.network !== undefined && object.network !== null) {
      message.network = String(object.network);
    } else {
      message.network = "";
    }
    if (object.epoch !== undefined && object.epoch !== null) {
      message.epoch = Number(object.epoch);
    } else {
      message.epoch = 0;
    }
    if (
      object.blindBidEndTimestamp !== undefined &&
      object.blindBidEndTimestamp !== null
    ) {
      message.blindBidEndTimestamp = Number(object.blindBidEndTimestamp);
    } else {
      message.blindBidEndTimestamp = 0;
    }
    if (
      object.blindBidEndNotionalTime !== undefined &&
      object.blindBidEndNotionalTime !== null
    ) {
      message.blindBidEndNotionalTime = Number(object.blindBidEndNotionalTime);
    } else {
      message.blindBidEndNotionalTime = 0;
    }
    if (object.leader !== undefined && object.leader !== null) {
      message.leader = BidInfo.fromJSON(object.leader);
    } else {
      message.leader = undefined;
    }
    if (object.winner !== undefined && object.winner !== null) {
      message.winner = BidInfo.fromJSON(object.winner);
    } else {
      message.winner = undefined;
    }
    if (object.blindBids !== undefined && object.blindBids !== null) {
      for (const e of object.blindBids) {
        message.blindBids.push(BlindBid.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: OrderFlowAuction): unknown {
    const obj: any = {};
    message.ofsPublicKey !== undefined &&
      (obj.ofsPublicKey = message.ofsPublicKey);
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    message.clientAuctionId !== undefined &&
      (obj.clientAuctionId = message.clientAuctionId);
    message.baseCurrency !== undefined &&
      (obj.baseCurrency = message.baseCurrency);
    message.quoteCurrency !== undefined &&
      (obj.quoteCurrency = message.quoteCurrency);
    message.minimumOrderSize !== undefined &&
      (obj.minimumOrderSize = message.minimumOrderSize);
    message.maximumOrderSize !== undefined &&
      (obj.maximumOrderSize = message.maximumOrderSize);
    message.notionalSize !== undefined &&
      (obj.notionalSize = message.notionalSize);
    message.maxDeliveryPeriod !== undefined &&
      (obj.maxDeliveryPeriod = message.maxDeliveryPeriod);
    message.deliveredNotionalSize !== undefined &&
      (obj.deliveredNotionalSize = message.deliveredNotionalSize);
    message.lifetimeDeliveredNotionalSize !== undefined &&
      (obj.lifetimeDeliveredNotionalSize =
        message.lifetimeDeliveredNotionalSize);
    message.paymentInLieuDeliveredNotionalSize !== undefined &&
      (obj.paymentInLieuDeliveredNotionalSize =
        message.paymentInLieuDeliveredNotionalSize);
    message.paymentInLieuLifetimeDeliveredNotionalSize !== undefined &&
      (obj.paymentInLieuLifetimeDeliveredNotionalSize =
        message.paymentInLieuLifetimeDeliveredNotionalSize);
    message.feePayerMode !== undefined &&
      (obj.feePayerMode = message.feePayerMode);
    message.isPaymentInLieuEnabled !== undefined &&
      (obj.isPaymentInLieuEnabled = message.isPaymentInLieuEnabled);
    message.isUnidirectional !== undefined &&
      (obj.isUnidirectional = message.isUnidirectional);
    message.extensions !== undefined && (obj.extensions = message.extensions);
    message.network !== undefined && (obj.network = message.network);
    message.epoch !== undefined && (obj.epoch = message.epoch);
    message.blindBidEndTimestamp !== undefined &&
      (obj.blindBidEndTimestamp = message.blindBidEndTimestamp);
    message.blindBidEndNotionalTime !== undefined &&
      (obj.blindBidEndNotionalTime = message.blindBidEndNotionalTime);
    message.leader !== undefined &&
      (obj.leader = message.leader
        ? BidInfo.toJSON(message.leader)
        : undefined);
    message.winner !== undefined &&
      (obj.winner = message.winner
        ? BidInfo.toJSON(message.winner)
        : undefined);
    if (message.blindBids) {
      obj.blindBids = message.blindBids.map((e) =>
        e ? BlindBid.toJSON(e) : undefined
      );
    } else {
      obj.blindBids = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<OrderFlowAuction>): OrderFlowAuction {
    const message = { ...baseOrderFlowAuction } as OrderFlowAuction;
    message.blindBids = [];
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = object.ofsPublicKey;
    } else {
      message.ofsPublicKey = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = object.auctionId;
    } else {
      message.auctionId = 0;
    }
    if (
      object.clientAuctionId !== undefined &&
      object.clientAuctionId !== null
    ) {
      message.clientAuctionId = object.clientAuctionId;
    } else {
      message.clientAuctionId = "";
    }
    if (object.baseCurrency !== undefined && object.baseCurrency !== null) {
      message.baseCurrency = object.baseCurrency;
    } else {
      message.baseCurrency = "";
    }
    if (object.quoteCurrency !== undefined && object.quoteCurrency !== null) {
      message.quoteCurrency = object.quoteCurrency;
    } else {
      message.quoteCurrency = "";
    }
    if (
      object.minimumOrderSize !== undefined &&
      object.minimumOrderSize !== null
    ) {
      message.minimumOrderSize = object.minimumOrderSize;
    } else {
      message.minimumOrderSize = 0;
    }
    if (
      object.maximumOrderSize !== undefined &&
      object.maximumOrderSize !== null
    ) {
      message.maximumOrderSize = object.maximumOrderSize;
    } else {
      message.maximumOrderSize = 0;
    }
    if (object.notionalSize !== undefined && object.notionalSize !== null) {
      message.notionalSize = object.notionalSize;
    } else {
      message.notionalSize = 0;
    }
    if (
      object.maxDeliveryPeriod !== undefined &&
      object.maxDeliveryPeriod !== null
    ) {
      message.maxDeliveryPeriod = object.maxDeliveryPeriod;
    } else {
      message.maxDeliveryPeriod = 0;
    }
    if (
      object.deliveredNotionalSize !== undefined &&
      object.deliveredNotionalSize !== null
    ) {
      message.deliveredNotionalSize = object.deliveredNotionalSize;
    } else {
      message.deliveredNotionalSize = 0;
    }
    if (
      object.lifetimeDeliveredNotionalSize !== undefined &&
      object.lifetimeDeliveredNotionalSize !== null
    ) {
      message.lifetimeDeliveredNotionalSize =
        object.lifetimeDeliveredNotionalSize;
    } else {
      message.lifetimeDeliveredNotionalSize = 0;
    }
    if (
      object.paymentInLieuDeliveredNotionalSize !== undefined &&
      object.paymentInLieuDeliveredNotionalSize !== null
    ) {
      message.paymentInLieuDeliveredNotionalSize =
        object.paymentInLieuDeliveredNotionalSize;
    } else {
      message.paymentInLieuDeliveredNotionalSize = 0;
    }
    if (
      object.paymentInLieuLifetimeDeliveredNotionalSize !== undefined &&
      object.paymentInLieuLifetimeDeliveredNotionalSize !== null
    ) {
      message.paymentInLieuLifetimeDeliveredNotionalSize =
        object.paymentInLieuLifetimeDeliveredNotionalSize;
    } else {
      message.paymentInLieuLifetimeDeliveredNotionalSize = 0;
    }
    if (object.feePayerMode !== undefined && object.feePayerMode !== null) {
      message.feePayerMode = object.feePayerMode;
    } else {
      message.feePayerMode = 0;
    }
    if (
      object.isPaymentInLieuEnabled !== undefined &&
      object.isPaymentInLieuEnabled !== null
    ) {
      message.isPaymentInLieuEnabled = object.isPaymentInLieuEnabled;
    } else {
      message.isPaymentInLieuEnabled = false;
    }
    if (
      object.isUnidirectional !== undefined &&
      object.isUnidirectional !== null
    ) {
      message.isUnidirectional = object.isUnidirectional;
    } else {
      message.isUnidirectional = false;
    }
    if (object.extensions !== undefined && object.extensions !== null) {
      message.extensions = object.extensions;
    } else {
      message.extensions = "";
    }
    if (object.network !== undefined && object.network !== null) {
      message.network = object.network;
    } else {
      message.network = "";
    }
    if (object.epoch !== undefined && object.epoch !== null) {
      message.epoch = object.epoch;
    } else {
      message.epoch = 0;
    }
    if (
      object.blindBidEndTimestamp !== undefined &&
      object.blindBidEndTimestamp !== null
    ) {
      message.blindBidEndTimestamp = object.blindBidEndTimestamp;
    } else {
      message.blindBidEndTimestamp = 0;
    }
    if (
      object.blindBidEndNotionalTime !== undefined &&
      object.blindBidEndNotionalTime !== null
    ) {
      message.blindBidEndNotionalTime = object.blindBidEndNotionalTime;
    } else {
      message.blindBidEndNotionalTime = 0;
    }
    if (object.leader !== undefined && object.leader !== null) {
      message.leader = BidInfo.fromPartial(object.leader);
    } else {
      message.leader = undefined;
    }
    if (object.winner !== undefined && object.winner !== null) {
      message.winner = BidInfo.fromPartial(object.winner);
    } else {
      message.winner = undefined;
    }
    if (object.blindBids !== undefined && object.blindBids !== null) {
      for (const e of object.blindBids) {
        message.blindBids.push(BlindBid.fromPartial(e));
      }
    }
    return message;
  },
};

const baseAuctionGridDataRow: object = {
  ofsPublicKey: "",
  auctionId: 0,
  clientAuctionId: "",
  baseCurrency: "",
  quoteCurrency: "",
  minimumOrderSize: 0,
  maximumOrderSize: 0,
  notionalSize: 0,
  maxDeliveryPeriod: 0,
  deliveredNotionalSize: 0,
  lifetimeDeliveredNotionalSize: 0,
  paymentInLieuDeliveredNotionalSize: 0,
  paymentInLieuLifetimeDeliveredNotionalSize: 0,
  feePayerMode: 0,
  isPaymentInLieuEnabled: false,
  isUnidirectional: false,
  extensions: "",
  network: "",
  epoch: 0,
  epochCutoffTimestamp: 0,
  blindBidEndTimestamp: 0,
  blindBidEndNotionalTime: 0,
};

export const AuctionGridDataRow = {
  encode(
    message: AuctionGridDataRow,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.ofsPublicKey !== "") {
      writer.uint32(10).string(message.ofsPublicKey);
    }
    if (message.auctionId !== 0) {
      writer.uint32(16).uint64(message.auctionId);
    }
    if (message.clientAuctionId !== "") {
      writer.uint32(26).string(message.clientAuctionId);
    }
    if (message.baseCurrency !== "") {
      writer.uint32(34).string(message.baseCurrency);
    }
    if (message.quoteCurrency !== "") {
      writer.uint32(42).string(message.quoteCurrency);
    }
    if (message.minimumOrderSize !== 0) {
      writer.uint32(48).uint64(message.minimumOrderSize);
    }
    if (message.maximumOrderSize !== 0) {
      writer.uint32(56).uint64(message.maximumOrderSize);
    }
    if (message.notionalSize !== 0) {
      writer.uint32(64).uint64(message.notionalSize);
    }
    if (message.maxDeliveryPeriod !== 0) {
      writer.uint32(72).int64(message.maxDeliveryPeriod);
    }
    if (message.deliveredNotionalSize !== 0) {
      writer.uint32(80).uint64(message.deliveredNotionalSize);
    }
    if (message.lifetimeDeliveredNotionalSize !== 0) {
      writer.uint32(88).uint64(message.lifetimeDeliveredNotionalSize);
    }
    if (message.paymentInLieuDeliveredNotionalSize !== 0) {
      writer.uint32(96).uint64(message.paymentInLieuDeliveredNotionalSize);
    }
    if (message.paymentInLieuLifetimeDeliveredNotionalSize !== 0) {
      writer
        .uint32(104)
        .uint64(message.paymentInLieuLifetimeDeliveredNotionalSize);
    }
    if (message.feePayerMode !== 0) {
      writer.uint32(112).uint32(message.feePayerMode);
    }
    if (message.isPaymentInLieuEnabled === true) {
      writer.uint32(120).bool(message.isPaymentInLieuEnabled);
    }
    if (message.isUnidirectional === true) {
      writer.uint32(128).bool(message.isUnidirectional);
    }
    if (message.extensions !== "") {
      writer.uint32(138).string(message.extensions);
    }
    if (message.network !== "") {
      writer.uint32(146).string(message.network);
    }
    if (message.epoch !== 0) {
      writer.uint32(152).uint64(message.epoch);
    }
    if (message.epochCutoffTimestamp !== 0) {
      writer.uint32(160).int64(message.epochCutoffTimestamp);
    }
    if (message.blindBidEndTimestamp !== 0) {
      writer.uint32(168).int64(message.blindBidEndTimestamp);
    }
    if (message.blindBidEndNotionalTime !== 0) {
      writer.uint32(176).uint64(message.blindBidEndNotionalTime);
    }
    if (message.leader !== undefined) {
      BidInfo.encode(message.leader, writer.uint32(186).fork()).ldelim();
    }
    if (message.winner !== undefined) {
      BidInfo.encode(message.winner, writer.uint32(194).fork()).ldelim();
    }
    for (const v of message.blindBids) {
      BlindBid.encode(v!, writer.uint32(202).fork()).ldelim();
    }
    if (message.payment !== undefined) {
      AuctionGridDataRow_OFSPayment.encode(
        message.payment,
        writer.uint32(210).fork()
      ).ldelim();
    }
    if (message.overlap !== undefined) {
      AuctionGridDataRow_Overlap.encode(
        message.overlap,
        writer.uint32(218).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): AuctionGridDataRow {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAuctionGridDataRow } as AuctionGridDataRow;
    message.blindBids = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ofsPublicKey = reader.string();
          break;
        case 2:
          message.auctionId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.clientAuctionId = reader.string();
          break;
        case 4:
          message.baseCurrency = reader.string();
          break;
        case 5:
          message.quoteCurrency = reader.string();
          break;
        case 6:
          message.minimumOrderSize = longToNumber(reader.uint64() as Long);
          break;
        case 7:
          message.maximumOrderSize = longToNumber(reader.uint64() as Long);
          break;
        case 8:
          message.notionalSize = longToNumber(reader.uint64() as Long);
          break;
        case 9:
          message.maxDeliveryPeriod = longToNumber(reader.int64() as Long);
          break;
        case 10:
          message.deliveredNotionalSize = longToNumber(reader.uint64() as Long);
          break;
        case 11:
          message.lifetimeDeliveredNotionalSize = longToNumber(
            reader.uint64() as Long
          );
          break;
        case 12:
          message.paymentInLieuDeliveredNotionalSize = longToNumber(
            reader.uint64() as Long
          );
          break;
        case 13:
          message.paymentInLieuLifetimeDeliveredNotionalSize = longToNumber(
            reader.uint64() as Long
          );
          break;
        case 14:
          message.feePayerMode = reader.uint32();
          break;
        case 15:
          message.isPaymentInLieuEnabled = reader.bool();
          break;
        case 16:
          message.isUnidirectional = reader.bool();
          break;
        case 17:
          message.extensions = reader.string();
          break;
        case 18:
          message.network = reader.string();
          break;
        case 19:
          message.epoch = longToNumber(reader.uint64() as Long);
          break;
        case 20:
          message.epochCutoffTimestamp = longToNumber(reader.int64() as Long);
          break;
        case 21:
          message.blindBidEndTimestamp = longToNumber(reader.int64() as Long);
          break;
        case 22:
          message.blindBidEndNotionalTime = longToNumber(
            reader.uint64() as Long
          );
          break;
        case 23:
          message.leader = BidInfo.decode(reader, reader.uint32());
          break;
        case 24:
          message.winner = BidInfo.decode(reader, reader.uint32());
          break;
        case 25:
          message.blindBids.push(BlindBid.decode(reader, reader.uint32()));
          break;
        case 26:
          message.payment = AuctionGridDataRow_OFSPayment.decode(
            reader,
            reader.uint32()
          );
          break;
        case 27:
          message.overlap = AuctionGridDataRow_Overlap.decode(
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

  fromJSON(object: any): AuctionGridDataRow {
    const message = { ...baseAuctionGridDataRow } as AuctionGridDataRow;
    message.blindBids = [];
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = String(object.ofsPublicKey);
    } else {
      message.ofsPublicKey = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = Number(object.auctionId);
    } else {
      message.auctionId = 0;
    }
    if (
      object.clientAuctionId !== undefined &&
      object.clientAuctionId !== null
    ) {
      message.clientAuctionId = String(object.clientAuctionId);
    } else {
      message.clientAuctionId = "";
    }
    if (object.baseCurrency !== undefined && object.baseCurrency !== null) {
      message.baseCurrency = String(object.baseCurrency);
    } else {
      message.baseCurrency = "";
    }
    if (object.quoteCurrency !== undefined && object.quoteCurrency !== null) {
      message.quoteCurrency = String(object.quoteCurrency);
    } else {
      message.quoteCurrency = "";
    }
    if (
      object.minimumOrderSize !== undefined &&
      object.minimumOrderSize !== null
    ) {
      message.minimumOrderSize = Number(object.minimumOrderSize);
    } else {
      message.minimumOrderSize = 0;
    }
    if (
      object.maximumOrderSize !== undefined &&
      object.maximumOrderSize !== null
    ) {
      message.maximumOrderSize = Number(object.maximumOrderSize);
    } else {
      message.maximumOrderSize = 0;
    }
    if (object.notionalSize !== undefined && object.notionalSize !== null) {
      message.notionalSize = Number(object.notionalSize);
    } else {
      message.notionalSize = 0;
    }
    if (
      object.maxDeliveryPeriod !== undefined &&
      object.maxDeliveryPeriod !== null
    ) {
      message.maxDeliveryPeriod = Number(object.maxDeliveryPeriod);
    } else {
      message.maxDeliveryPeriod = 0;
    }
    if (
      object.deliveredNotionalSize !== undefined &&
      object.deliveredNotionalSize !== null
    ) {
      message.deliveredNotionalSize = Number(object.deliveredNotionalSize);
    } else {
      message.deliveredNotionalSize = 0;
    }
    if (
      object.lifetimeDeliveredNotionalSize !== undefined &&
      object.lifetimeDeliveredNotionalSize !== null
    ) {
      message.lifetimeDeliveredNotionalSize = Number(
        object.lifetimeDeliveredNotionalSize
      );
    } else {
      message.lifetimeDeliveredNotionalSize = 0;
    }
    if (
      object.paymentInLieuDeliveredNotionalSize !== undefined &&
      object.paymentInLieuDeliveredNotionalSize !== null
    ) {
      message.paymentInLieuDeliveredNotionalSize = Number(
        object.paymentInLieuDeliveredNotionalSize
      );
    } else {
      message.paymentInLieuDeliveredNotionalSize = 0;
    }
    if (
      object.paymentInLieuLifetimeDeliveredNotionalSize !== undefined &&
      object.paymentInLieuLifetimeDeliveredNotionalSize !== null
    ) {
      message.paymentInLieuLifetimeDeliveredNotionalSize = Number(
        object.paymentInLieuLifetimeDeliveredNotionalSize
      );
    } else {
      message.paymentInLieuLifetimeDeliveredNotionalSize = 0;
    }
    if (object.feePayerMode !== undefined && object.feePayerMode !== null) {
      message.feePayerMode = Number(object.feePayerMode);
    } else {
      message.feePayerMode = 0;
    }
    if (
      object.isPaymentInLieuEnabled !== undefined &&
      object.isPaymentInLieuEnabled !== null
    ) {
      message.isPaymentInLieuEnabled = Boolean(object.isPaymentInLieuEnabled);
    } else {
      message.isPaymentInLieuEnabled = false;
    }
    if (
      object.isUnidirectional !== undefined &&
      object.isUnidirectional !== null
    ) {
      message.isUnidirectional = Boolean(object.isUnidirectional);
    } else {
      message.isUnidirectional = false;
    }
    if (object.extensions !== undefined && object.extensions !== null) {
      message.extensions = String(object.extensions);
    } else {
      message.extensions = "";
    }
    if (object.network !== undefined && object.network !== null) {
      message.network = String(object.network);
    } else {
      message.network = "";
    }
    if (object.epoch !== undefined && object.epoch !== null) {
      message.epoch = Number(object.epoch);
    } else {
      message.epoch = 0;
    }
    if (
      object.epochCutoffTimestamp !== undefined &&
      object.epochCutoffTimestamp !== null
    ) {
      message.epochCutoffTimestamp = Number(object.epochCutoffTimestamp);
    } else {
      message.epochCutoffTimestamp = 0;
    }
    if (
      object.blindBidEndTimestamp !== undefined &&
      object.blindBidEndTimestamp !== null
    ) {
      message.blindBidEndTimestamp = Number(object.blindBidEndTimestamp);
    } else {
      message.blindBidEndTimestamp = 0;
    }
    if (
      object.blindBidEndNotionalTime !== undefined &&
      object.blindBidEndNotionalTime !== null
    ) {
      message.blindBidEndNotionalTime = Number(object.blindBidEndNotionalTime);
    } else {
      message.blindBidEndNotionalTime = 0;
    }
    if (object.leader !== undefined && object.leader !== null) {
      message.leader = BidInfo.fromJSON(object.leader);
    } else {
      message.leader = undefined;
    }
    if (object.winner !== undefined && object.winner !== null) {
      message.winner = BidInfo.fromJSON(object.winner);
    } else {
      message.winner = undefined;
    }
    if (object.blindBids !== undefined && object.blindBids !== null) {
      for (const e of object.blindBids) {
        message.blindBids.push(BlindBid.fromJSON(e));
      }
    }
    if (object.payment !== undefined && object.payment !== null) {
      message.payment = AuctionGridDataRow_OFSPayment.fromJSON(object.payment);
    } else {
      message.payment = undefined;
    }
    if (object.overlap !== undefined && object.overlap !== null) {
      message.overlap = AuctionGridDataRow_Overlap.fromJSON(object.overlap);
    } else {
      message.overlap = undefined;
    }
    return message;
  },

  toJSON(message: AuctionGridDataRow): unknown {
    const obj: any = {};
    message.ofsPublicKey !== undefined &&
      (obj.ofsPublicKey = message.ofsPublicKey);
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    message.clientAuctionId !== undefined &&
      (obj.clientAuctionId = message.clientAuctionId);
    message.baseCurrency !== undefined &&
      (obj.baseCurrency = message.baseCurrency);
    message.quoteCurrency !== undefined &&
      (obj.quoteCurrency = message.quoteCurrency);
    message.minimumOrderSize !== undefined &&
      (obj.minimumOrderSize = message.minimumOrderSize);
    message.maximumOrderSize !== undefined &&
      (obj.maximumOrderSize = message.maximumOrderSize);
    message.notionalSize !== undefined &&
      (obj.notionalSize = message.notionalSize);
    message.maxDeliveryPeriod !== undefined &&
      (obj.maxDeliveryPeriod = message.maxDeliveryPeriod);
    message.deliveredNotionalSize !== undefined &&
      (obj.deliveredNotionalSize = message.deliveredNotionalSize);
    message.lifetimeDeliveredNotionalSize !== undefined &&
      (obj.lifetimeDeliveredNotionalSize =
        message.lifetimeDeliveredNotionalSize);
    message.paymentInLieuDeliveredNotionalSize !== undefined &&
      (obj.paymentInLieuDeliveredNotionalSize =
        message.paymentInLieuDeliveredNotionalSize);
    message.paymentInLieuLifetimeDeliveredNotionalSize !== undefined &&
      (obj.paymentInLieuLifetimeDeliveredNotionalSize =
        message.paymentInLieuLifetimeDeliveredNotionalSize);
    message.feePayerMode !== undefined &&
      (obj.feePayerMode = message.feePayerMode);
    message.isPaymentInLieuEnabled !== undefined &&
      (obj.isPaymentInLieuEnabled = message.isPaymentInLieuEnabled);
    message.isUnidirectional !== undefined &&
      (obj.isUnidirectional = message.isUnidirectional);
    message.extensions !== undefined && (obj.extensions = message.extensions);
    message.network !== undefined && (obj.network = message.network);
    message.epoch !== undefined && (obj.epoch = message.epoch);
    message.epochCutoffTimestamp !== undefined &&
      (obj.epochCutoffTimestamp = message.epochCutoffTimestamp);
    message.blindBidEndTimestamp !== undefined &&
      (obj.blindBidEndTimestamp = message.blindBidEndTimestamp);
    message.blindBidEndNotionalTime !== undefined &&
      (obj.blindBidEndNotionalTime = message.blindBidEndNotionalTime);
    message.leader !== undefined &&
      (obj.leader = message.leader
        ? BidInfo.toJSON(message.leader)
        : undefined);
    message.winner !== undefined &&
      (obj.winner = message.winner
        ? BidInfo.toJSON(message.winner)
        : undefined);
    if (message.blindBids) {
      obj.blindBids = message.blindBids.map((e) =>
        e ? BlindBid.toJSON(e) : undefined
      );
    } else {
      obj.blindBids = [];
    }
    message.payment !== undefined &&
      (obj.payment = message.payment
        ? AuctionGridDataRow_OFSPayment.toJSON(message.payment)
        : undefined);
    message.overlap !== undefined &&
      (obj.overlap = message.overlap
        ? AuctionGridDataRow_Overlap.toJSON(message.overlap)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<AuctionGridDataRow>): AuctionGridDataRow {
    const message = { ...baseAuctionGridDataRow } as AuctionGridDataRow;
    message.blindBids = [];
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = object.ofsPublicKey;
    } else {
      message.ofsPublicKey = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = object.auctionId;
    } else {
      message.auctionId = 0;
    }
    if (
      object.clientAuctionId !== undefined &&
      object.clientAuctionId !== null
    ) {
      message.clientAuctionId = object.clientAuctionId;
    } else {
      message.clientAuctionId = "";
    }
    if (object.baseCurrency !== undefined && object.baseCurrency !== null) {
      message.baseCurrency = object.baseCurrency;
    } else {
      message.baseCurrency = "";
    }
    if (object.quoteCurrency !== undefined && object.quoteCurrency !== null) {
      message.quoteCurrency = object.quoteCurrency;
    } else {
      message.quoteCurrency = "";
    }
    if (
      object.minimumOrderSize !== undefined &&
      object.minimumOrderSize !== null
    ) {
      message.minimumOrderSize = object.minimumOrderSize;
    } else {
      message.minimumOrderSize = 0;
    }
    if (
      object.maximumOrderSize !== undefined &&
      object.maximumOrderSize !== null
    ) {
      message.maximumOrderSize = object.maximumOrderSize;
    } else {
      message.maximumOrderSize = 0;
    }
    if (object.notionalSize !== undefined && object.notionalSize !== null) {
      message.notionalSize = object.notionalSize;
    } else {
      message.notionalSize = 0;
    }
    if (
      object.maxDeliveryPeriod !== undefined &&
      object.maxDeliveryPeriod !== null
    ) {
      message.maxDeliveryPeriod = object.maxDeliveryPeriod;
    } else {
      message.maxDeliveryPeriod = 0;
    }
    if (
      object.deliveredNotionalSize !== undefined &&
      object.deliveredNotionalSize !== null
    ) {
      message.deliveredNotionalSize = object.deliveredNotionalSize;
    } else {
      message.deliveredNotionalSize = 0;
    }
    if (
      object.lifetimeDeliveredNotionalSize !== undefined &&
      object.lifetimeDeliveredNotionalSize !== null
    ) {
      message.lifetimeDeliveredNotionalSize =
        object.lifetimeDeliveredNotionalSize;
    } else {
      message.lifetimeDeliveredNotionalSize = 0;
    }
    if (
      object.paymentInLieuDeliveredNotionalSize !== undefined &&
      object.paymentInLieuDeliveredNotionalSize !== null
    ) {
      message.paymentInLieuDeliveredNotionalSize =
        object.paymentInLieuDeliveredNotionalSize;
    } else {
      message.paymentInLieuDeliveredNotionalSize = 0;
    }
    if (
      object.paymentInLieuLifetimeDeliveredNotionalSize !== undefined &&
      object.paymentInLieuLifetimeDeliveredNotionalSize !== null
    ) {
      message.paymentInLieuLifetimeDeliveredNotionalSize =
        object.paymentInLieuLifetimeDeliveredNotionalSize;
    } else {
      message.paymentInLieuLifetimeDeliveredNotionalSize = 0;
    }
    if (object.feePayerMode !== undefined && object.feePayerMode !== null) {
      message.feePayerMode = object.feePayerMode;
    } else {
      message.feePayerMode = 0;
    }
    if (
      object.isPaymentInLieuEnabled !== undefined &&
      object.isPaymentInLieuEnabled !== null
    ) {
      message.isPaymentInLieuEnabled = object.isPaymentInLieuEnabled;
    } else {
      message.isPaymentInLieuEnabled = false;
    }
    if (
      object.isUnidirectional !== undefined &&
      object.isUnidirectional !== null
    ) {
      message.isUnidirectional = object.isUnidirectional;
    } else {
      message.isUnidirectional = false;
    }
    if (object.extensions !== undefined && object.extensions !== null) {
      message.extensions = object.extensions;
    } else {
      message.extensions = "";
    }
    if (object.network !== undefined && object.network !== null) {
      message.network = object.network;
    } else {
      message.network = "";
    }
    if (object.epoch !== undefined && object.epoch !== null) {
      message.epoch = object.epoch;
    } else {
      message.epoch = 0;
    }
    if (
      object.epochCutoffTimestamp !== undefined &&
      object.epochCutoffTimestamp !== null
    ) {
      message.epochCutoffTimestamp = object.epochCutoffTimestamp;
    } else {
      message.epochCutoffTimestamp = 0;
    }
    if (
      object.blindBidEndTimestamp !== undefined &&
      object.blindBidEndTimestamp !== null
    ) {
      message.blindBidEndTimestamp = object.blindBidEndTimestamp;
    } else {
      message.blindBidEndTimestamp = 0;
    }
    if (
      object.blindBidEndNotionalTime !== undefined &&
      object.blindBidEndNotionalTime !== null
    ) {
      message.blindBidEndNotionalTime = object.blindBidEndNotionalTime;
    } else {
      message.blindBidEndNotionalTime = 0;
    }
    if (object.leader !== undefined && object.leader !== null) {
      message.leader = BidInfo.fromPartial(object.leader);
    } else {
      message.leader = undefined;
    }
    if (object.winner !== undefined && object.winner !== null) {
      message.winner = BidInfo.fromPartial(object.winner);
    } else {
      message.winner = undefined;
    }
    if (object.blindBids !== undefined && object.blindBids !== null) {
      for (const e of object.blindBids) {
        message.blindBids.push(BlindBid.fromPartial(e));
      }
    }
    if (object.payment !== undefined && object.payment !== null) {
      message.payment = AuctionGridDataRow_OFSPayment.fromPartial(
        object.payment
      );
    } else {
      message.payment = undefined;
    }
    if (object.overlap !== undefined && object.overlap !== null) {
      message.overlap = AuctionGridDataRow_Overlap.fromPartial(object.overlap);
    } else {
      message.overlap = undefined;
    }
    return message;
  },
};

const baseAuctionGridDataRow_OFSPayment: object = {
  paid: 0,
  realized: 0,
  unrealized: 0,
};

export const AuctionGridDataRow_OFSPayment = {
  encode(
    message: AuctionGridDataRow_OFSPayment,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.paid !== 0) {
      writer.uint32(8).uint64(message.paid);
    }
    if (message.realized !== 0) {
      writer.uint32(16).uint64(message.realized);
    }
    if (message.unrealized !== 0) {
      writer.uint32(24).uint64(message.unrealized);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): AuctionGridDataRow_OFSPayment {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseAuctionGridDataRow_OFSPayment,
    } as AuctionGridDataRow_OFSPayment;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.paid = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.realized = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.unrealized = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AuctionGridDataRow_OFSPayment {
    const message = {
      ...baseAuctionGridDataRow_OFSPayment,
    } as AuctionGridDataRow_OFSPayment;
    if (object.paid !== undefined && object.paid !== null) {
      message.paid = Number(object.paid);
    } else {
      message.paid = 0;
    }
    if (object.realized !== undefined && object.realized !== null) {
      message.realized = Number(object.realized);
    } else {
      message.realized = 0;
    }
    if (object.unrealized !== undefined && object.unrealized !== null) {
      message.unrealized = Number(object.unrealized);
    } else {
      message.unrealized = 0;
    }
    return message;
  },

  toJSON(message: AuctionGridDataRow_OFSPayment): unknown {
    const obj: any = {};
    message.paid !== undefined && (obj.paid = message.paid);
    message.realized !== undefined && (obj.realized = message.realized);
    message.unrealized !== undefined && (obj.unrealized = message.unrealized);
    return obj;
  },

  fromPartial(
    object: DeepPartial<AuctionGridDataRow_OFSPayment>
  ): AuctionGridDataRow_OFSPayment {
    const message = {
      ...baseAuctionGridDataRow_OFSPayment,
    } as AuctionGridDataRow_OFSPayment;
    if (object.paid !== undefined && object.paid !== null) {
      message.paid = object.paid;
    } else {
      message.paid = 0;
    }
    if (object.realized !== undefined && object.realized !== null) {
      message.realized = object.realized;
    } else {
      message.realized = 0;
    }
    if (object.unrealized !== undefined && object.unrealized !== null) {
      message.unrealized = object.unrealized;
    } else {
      message.unrealized = 0;
    }
    return message;
  },
};

const baseAuctionGridDataRow_Overlap: object = { hasOverlap: false };

export const AuctionGridDataRow_Overlap = {
  encode(
    message: AuctionGridDataRow_Overlap,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.hasOverlap === true) {
      writer.uint32(8).bool(message.hasOverlap);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): AuctionGridDataRow_Overlap {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseAuctionGridDataRow_Overlap,
    } as AuctionGridDataRow_Overlap;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hasOverlap = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AuctionGridDataRow_Overlap {
    const message = {
      ...baseAuctionGridDataRow_Overlap,
    } as AuctionGridDataRow_Overlap;
    if (object.hasOverlap !== undefined && object.hasOverlap !== null) {
      message.hasOverlap = Boolean(object.hasOverlap);
    } else {
      message.hasOverlap = false;
    }
    return message;
  },

  toJSON(message: AuctionGridDataRow_Overlap): unknown {
    const obj: any = {};
    message.hasOverlap !== undefined && (obj.hasOverlap = message.hasOverlap);
    return obj;
  },

  fromPartial(
    object: DeepPartial<AuctionGridDataRow_Overlap>
  ): AuctionGridDataRow_Overlap {
    const message = {
      ...baseAuctionGridDataRow_Overlap,
    } as AuctionGridDataRow_Overlap;
    if (object.hasOverlap !== undefined && object.hasOverlap !== null) {
      message.hasOverlap = object.hasOverlap;
    } else {
      message.hasOverlap = false;
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
