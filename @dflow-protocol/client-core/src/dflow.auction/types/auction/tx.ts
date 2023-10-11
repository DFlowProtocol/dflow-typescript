/* eslint-disable */
import { Reader, util, configure, Writer } from "protobufjs/minimal";
import * as Long from "long";

export const protobufPackage = "dflow.auction";

export interface MsgCreateAuction {
  /** The bech32 public key of the order flow source */
  ofsPublicKey: string;
  /** The order flow source's identifier for the auction */
  clientAuctionId: string;
  /**
   * The base currency in the token pair. For unidirectional auctions, this is the currency that
   * retail sends.
   */
  baseCurrency: string;
  /**
   * The quote currency in the token pair. For unidirectional auctions, this is the currency that
   * retail receives.
   */
  quoteCurrency: string;
  /** The minimum notional size of the order in USD. Scaled integer with two decimals. */
  minimumOrderSize: number;
  /** The maximum notional size of the order in USD. Scaled integer with two decimals. */
  maximumOrderSize: number;
  /** The total notional size being delivered by the auction in USD. Scaled integer with two decimals. */
  notionalSize: number;
  /** The max delivery period in milliseconds */
  maxDeliveryPeriod: number;
  /** The fee payer mode for settlement transactions */
  feePayerMode: number;
  /** A boolean indicating whether the payment in lieu is enabled for the auction */
  isPaymentInLieuEnabled: boolean;
  /** A boolean indicating whether the auction is unidirectional */
  isUnidirectional: boolean;
  extensions: string;
  /** An identifier for the network */
  network: string;
}

export interface MsgCreateAuctionResponse {
  /** The generated auction ID */
  auctionId: number;
}

export interface MsgBlindBid {
  /** The bech32 DFlow public key of the market maker */
  mmPublicKey: string;
  /** The auction ID identifying the auction this blind bid belongs to */
  auctionId: number;
  /** The SHA256 checksum of the bid and random nonce */
  bidHash: string;
  /** The auction epoch for which the blind bid is being submitted */
  bidEpoch: number;
}

export interface MsgBlindBidResponse {}

export interface MsgReviseBlindBid {
  /** The bech32 DFlow public key of the market maker */
  mmPublicKey: string;
  /** The auction ID identifying the auction this blind bid belongs to */
  auctionId: number;
  /** The SHA256 checksum of the bid and random nonce */
  bidHash: string;
  /** The auction epoch for which the blind bid is being submitted */
  bidEpoch: number;
}

export interface MsgReviseBlindBidResponse {}

export interface MsgRevealBid {
  /** The bech32 DFlow public key of the market maker */
  mmPublicKey: string;
  /** The auction ID identifying the auction for which the blind bid is being revealed */
  auctionId: number;
  /** The raw value of the bid */
  bid: number;
  /** The random nonce used to generate the hash of the blind bid */
  nonce: number;
  /** The URL of the market maker's quoting endpoint */
  mmUrl: string;
  /** The auction epoch for which the blind bid was submitted */
  bidEpoch: number;
}

export interface MsgRevealBidResponse {}

export interface MsgDeliverNotional {
  /** The bech32 DFlow public key of the signatory server's signing key */
  signerPublicKey: string;
  /** The bech32 DFlow public key of the signatory server */
  ssPublicKey: string;
  /** The auction ID for which the notional clock is being updated */
  auctionId: number;
  /** The notional amount being delivered to an auction */
  notional: number;
  /** The auction epoch to which delivery is being made */
  auctionEpoch: number;
  endorsement: Endorsement | undefined;
  /** True if and only if this delivery is being made for payment in lieu */
  isForPaymentInLieu: boolean;
  /** Additional data used for indexing */
  extensions: string;
}

export interface Endorsement {
  /** Base58-encoded Ed25519 public key used to sign the endorsement message */
  endorser: string;
  /** Base64-encoded Ed25519 signature of `"{id},{expirationTime},{data}"` */
  signature: string;
  /** Base64-encoded uint64 endorsement ID */
  id: string;
  /** Expiration time as UTC. Number of seconds since Jan 1, 1970 00:00:00 UTC. */
  expirationTimeUTC: number;
  /** Data used in the endorsement message */
  data: string;
}

export interface MsgDeliverNotionalResponse {}

export interface MsgUpdateAuction {
  /** The bech32 public key of the order flow source */
  ofsPublicKey: string;
  /** The auction ID for which the auction parameters are being updated */
  auctionId: number;
  /** The new client auction ID */
  clientAuctionId: string;
}

export interface MsgUpdateAuctionResponse {}

export interface MsgDeleteAuction {
  ofsPublicKey: string;
  auctionId: number;
}

export interface MsgDeleteAuctionResponse {}

const baseMsgCreateAuction: object = {
  ofsPublicKey: "",
  clientAuctionId: "",
  baseCurrency: "",
  quoteCurrency: "",
  minimumOrderSize: 0,
  maximumOrderSize: 0,
  notionalSize: 0,
  maxDeliveryPeriod: 0,
  feePayerMode: 0,
  isPaymentInLieuEnabled: false,
  isUnidirectional: false,
  extensions: "",
  network: "",
};

export const MsgCreateAuction = {
  encode(message: MsgCreateAuction, writer: Writer = Writer.create()): Writer {
    if (message.ofsPublicKey !== "") {
      writer.uint32(10).string(message.ofsPublicKey);
    }
    if (message.clientAuctionId !== "") {
      writer.uint32(18).string(message.clientAuctionId);
    }
    if (message.baseCurrency !== "") {
      writer.uint32(26).string(message.baseCurrency);
    }
    if (message.quoteCurrency !== "") {
      writer.uint32(34).string(message.quoteCurrency);
    }
    if (message.minimumOrderSize !== 0) {
      writer.uint32(40).uint64(message.minimumOrderSize);
    }
    if (message.maximumOrderSize !== 0) {
      writer.uint32(48).uint64(message.maximumOrderSize);
    }
    if (message.notionalSize !== 0) {
      writer.uint32(56).uint64(message.notionalSize);
    }
    if (message.maxDeliveryPeriod !== 0) {
      writer.uint32(64).int64(message.maxDeliveryPeriod);
    }
    if (message.feePayerMode !== 0) {
      writer.uint32(72).uint32(message.feePayerMode);
    }
    if (message.isPaymentInLieuEnabled === true) {
      writer.uint32(80).bool(message.isPaymentInLieuEnabled);
    }
    if (message.isUnidirectional === true) {
      writer.uint32(88).bool(message.isUnidirectional);
    }
    if (message.extensions !== "") {
      writer.uint32(98).string(message.extensions);
    }
    if (message.network !== "") {
      writer.uint32(106).string(message.network);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgCreateAuction {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreateAuction } as MsgCreateAuction;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ofsPublicKey = reader.string();
          break;
        case 2:
          message.clientAuctionId = reader.string();
          break;
        case 3:
          message.baseCurrency = reader.string();
          break;
        case 4:
          message.quoteCurrency = reader.string();
          break;
        case 5:
          message.minimumOrderSize = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.maximumOrderSize = longToNumber(reader.uint64() as Long);
          break;
        case 7:
          message.notionalSize = longToNumber(reader.uint64() as Long);
          break;
        case 8:
          message.maxDeliveryPeriod = longToNumber(reader.int64() as Long);
          break;
        case 9:
          message.feePayerMode = reader.uint32();
          break;
        case 10:
          message.isPaymentInLieuEnabled = reader.bool();
          break;
        case 11:
          message.isUnidirectional = reader.bool();
          break;
        case 12:
          message.extensions = reader.string();
          break;
        case 13:
          message.network = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateAuction {
    const message = { ...baseMsgCreateAuction } as MsgCreateAuction;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = String(object.ofsPublicKey);
    } else {
      message.ofsPublicKey = "";
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
    return message;
  },

  toJSON(message: MsgCreateAuction): unknown {
    const obj: any = {};
    message.ofsPublicKey !== undefined &&
      (obj.ofsPublicKey = message.ofsPublicKey);
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
    message.feePayerMode !== undefined &&
      (obj.feePayerMode = message.feePayerMode);
    message.isPaymentInLieuEnabled !== undefined &&
      (obj.isPaymentInLieuEnabled = message.isPaymentInLieuEnabled);
    message.isUnidirectional !== undefined &&
      (obj.isUnidirectional = message.isUnidirectional);
    message.extensions !== undefined && (obj.extensions = message.extensions);
    message.network !== undefined && (obj.network = message.network);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgCreateAuction>): MsgCreateAuction {
    const message = { ...baseMsgCreateAuction } as MsgCreateAuction;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = object.ofsPublicKey;
    } else {
      message.ofsPublicKey = "";
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
    return message;
  },
};

const baseMsgCreateAuctionResponse: object = { auctionId: 0 };

export const MsgCreateAuctionResponse = {
  encode(
    message: MsgCreateAuctionResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.auctionId !== 0) {
      writer.uint32(8).uint64(message.auctionId);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgCreateAuctionResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgCreateAuctionResponse,
    } as MsgCreateAuctionResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.auctionId = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateAuctionResponse {
    const message = {
      ...baseMsgCreateAuctionResponse,
    } as MsgCreateAuctionResponse;
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = Number(object.auctionId);
    } else {
      message.auctionId = 0;
    }
    return message;
  },

  toJSON(message: MsgCreateAuctionResponse): unknown {
    const obj: any = {};
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgCreateAuctionResponse>
  ): MsgCreateAuctionResponse {
    const message = {
      ...baseMsgCreateAuctionResponse,
    } as MsgCreateAuctionResponse;
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = object.auctionId;
    } else {
      message.auctionId = 0;
    }
    return message;
  },
};

const baseMsgBlindBid: object = {
  mmPublicKey: "",
  auctionId: 0,
  bidHash: "",
  bidEpoch: 0,
};

export const MsgBlindBid = {
  encode(message: MsgBlindBid, writer: Writer = Writer.create()): Writer {
    if (message.mmPublicKey !== "") {
      writer.uint32(10).string(message.mmPublicKey);
    }
    if (message.auctionId !== 0) {
      writer.uint32(16).uint64(message.auctionId);
    }
    if (message.bidHash !== "") {
      writer.uint32(26).string(message.bidHash);
    }
    if (message.bidEpoch !== 0) {
      writer.uint32(32).uint64(message.bidEpoch);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgBlindBid {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgBlindBid } as MsgBlindBid;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mmPublicKey = reader.string();
          break;
        case 2:
          message.auctionId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.bidHash = reader.string();
          break;
        case 4:
          message.bidEpoch = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgBlindBid {
    const message = { ...baseMsgBlindBid } as MsgBlindBid;
    if (object.mmPublicKey !== undefined && object.mmPublicKey !== null) {
      message.mmPublicKey = String(object.mmPublicKey);
    } else {
      message.mmPublicKey = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = Number(object.auctionId);
    } else {
      message.auctionId = 0;
    }
    if (object.bidHash !== undefined && object.bidHash !== null) {
      message.bidHash = String(object.bidHash);
    } else {
      message.bidHash = "";
    }
    if (object.bidEpoch !== undefined && object.bidEpoch !== null) {
      message.bidEpoch = Number(object.bidEpoch);
    } else {
      message.bidEpoch = 0;
    }
    return message;
  },

  toJSON(message: MsgBlindBid): unknown {
    const obj: any = {};
    message.mmPublicKey !== undefined &&
      (obj.mmPublicKey = message.mmPublicKey);
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    message.bidHash !== undefined && (obj.bidHash = message.bidHash);
    message.bidEpoch !== undefined && (obj.bidEpoch = message.bidEpoch);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgBlindBid>): MsgBlindBid {
    const message = { ...baseMsgBlindBid } as MsgBlindBid;
    if (object.mmPublicKey !== undefined && object.mmPublicKey !== null) {
      message.mmPublicKey = object.mmPublicKey;
    } else {
      message.mmPublicKey = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = object.auctionId;
    } else {
      message.auctionId = 0;
    }
    if (object.bidHash !== undefined && object.bidHash !== null) {
      message.bidHash = object.bidHash;
    } else {
      message.bidHash = "";
    }
    if (object.bidEpoch !== undefined && object.bidEpoch !== null) {
      message.bidEpoch = object.bidEpoch;
    } else {
      message.bidEpoch = 0;
    }
    return message;
  },
};

const baseMsgBlindBidResponse: object = {};

export const MsgBlindBidResponse = {
  encode(_: MsgBlindBidResponse, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgBlindBidResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgBlindBidResponse } as MsgBlindBidResponse;
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

  fromJSON(_: any): MsgBlindBidResponse {
    const message = { ...baseMsgBlindBidResponse } as MsgBlindBidResponse;
    return message;
  },

  toJSON(_: MsgBlindBidResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgBlindBidResponse>): MsgBlindBidResponse {
    const message = { ...baseMsgBlindBidResponse } as MsgBlindBidResponse;
    return message;
  },
};

const baseMsgReviseBlindBid: object = {
  mmPublicKey: "",
  auctionId: 0,
  bidHash: "",
  bidEpoch: 0,
};

export const MsgReviseBlindBid = {
  encode(message: MsgReviseBlindBid, writer: Writer = Writer.create()): Writer {
    if (message.mmPublicKey !== "") {
      writer.uint32(10).string(message.mmPublicKey);
    }
    if (message.auctionId !== 0) {
      writer.uint32(16).uint64(message.auctionId);
    }
    if (message.bidHash !== "") {
      writer.uint32(26).string(message.bidHash);
    }
    if (message.bidEpoch !== 0) {
      writer.uint32(32).uint64(message.bidEpoch);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgReviseBlindBid {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgReviseBlindBid } as MsgReviseBlindBid;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mmPublicKey = reader.string();
          break;
        case 2:
          message.auctionId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.bidHash = reader.string();
          break;
        case 4:
          message.bidEpoch = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgReviseBlindBid {
    const message = { ...baseMsgReviseBlindBid } as MsgReviseBlindBid;
    if (object.mmPublicKey !== undefined && object.mmPublicKey !== null) {
      message.mmPublicKey = String(object.mmPublicKey);
    } else {
      message.mmPublicKey = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = Number(object.auctionId);
    } else {
      message.auctionId = 0;
    }
    if (object.bidHash !== undefined && object.bidHash !== null) {
      message.bidHash = String(object.bidHash);
    } else {
      message.bidHash = "";
    }
    if (object.bidEpoch !== undefined && object.bidEpoch !== null) {
      message.bidEpoch = Number(object.bidEpoch);
    } else {
      message.bidEpoch = 0;
    }
    return message;
  },

  toJSON(message: MsgReviseBlindBid): unknown {
    const obj: any = {};
    message.mmPublicKey !== undefined &&
      (obj.mmPublicKey = message.mmPublicKey);
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    message.bidHash !== undefined && (obj.bidHash = message.bidHash);
    message.bidEpoch !== undefined && (obj.bidEpoch = message.bidEpoch);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgReviseBlindBid>): MsgReviseBlindBid {
    const message = { ...baseMsgReviseBlindBid } as MsgReviseBlindBid;
    if (object.mmPublicKey !== undefined && object.mmPublicKey !== null) {
      message.mmPublicKey = object.mmPublicKey;
    } else {
      message.mmPublicKey = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = object.auctionId;
    } else {
      message.auctionId = 0;
    }
    if (object.bidHash !== undefined && object.bidHash !== null) {
      message.bidHash = object.bidHash;
    } else {
      message.bidHash = "";
    }
    if (object.bidEpoch !== undefined && object.bidEpoch !== null) {
      message.bidEpoch = object.bidEpoch;
    } else {
      message.bidEpoch = 0;
    }
    return message;
  },
};

const baseMsgReviseBlindBidResponse: object = {};

export const MsgReviseBlindBidResponse = {
  encode(
    _: MsgReviseBlindBidResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgReviseBlindBidResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgReviseBlindBidResponse,
    } as MsgReviseBlindBidResponse;
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

  fromJSON(_: any): MsgReviseBlindBidResponse {
    const message = {
      ...baseMsgReviseBlindBidResponse,
    } as MsgReviseBlindBidResponse;
    return message;
  },

  toJSON(_: MsgReviseBlindBidResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgReviseBlindBidResponse>
  ): MsgReviseBlindBidResponse {
    const message = {
      ...baseMsgReviseBlindBidResponse,
    } as MsgReviseBlindBidResponse;
    return message;
  },
};

const baseMsgRevealBid: object = {
  mmPublicKey: "",
  auctionId: 0,
  bid: 0,
  nonce: 0,
  mmUrl: "",
  bidEpoch: 0,
};

export const MsgRevealBid = {
  encode(message: MsgRevealBid, writer: Writer = Writer.create()): Writer {
    if (message.mmPublicKey !== "") {
      writer.uint32(10).string(message.mmPublicKey);
    }
    if (message.auctionId !== 0) {
      writer.uint32(16).uint64(message.auctionId);
    }
    if (message.bid !== 0) {
      writer.uint32(24).uint64(message.bid);
    }
    if (message.nonce !== 0) {
      writer.uint32(32).uint64(message.nonce);
    }
    if (message.mmUrl !== "") {
      writer.uint32(42).string(message.mmUrl);
    }
    if (message.bidEpoch !== 0) {
      writer.uint32(48).uint64(message.bidEpoch);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgRevealBid {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRevealBid } as MsgRevealBid;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mmPublicKey = reader.string();
          break;
        case 2:
          message.auctionId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.bid = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.nonce = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.mmUrl = reader.string();
          break;
        case 6:
          message.bidEpoch = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRevealBid {
    const message = { ...baseMsgRevealBid } as MsgRevealBid;
    if (object.mmPublicKey !== undefined && object.mmPublicKey !== null) {
      message.mmPublicKey = String(object.mmPublicKey);
    } else {
      message.mmPublicKey = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = Number(object.auctionId);
    } else {
      message.auctionId = 0;
    }
    if (object.bid !== undefined && object.bid !== null) {
      message.bid = Number(object.bid);
    } else {
      message.bid = 0;
    }
    if (object.nonce !== undefined && object.nonce !== null) {
      message.nonce = Number(object.nonce);
    } else {
      message.nonce = 0;
    }
    if (object.mmUrl !== undefined && object.mmUrl !== null) {
      message.mmUrl = String(object.mmUrl);
    } else {
      message.mmUrl = "";
    }
    if (object.bidEpoch !== undefined && object.bidEpoch !== null) {
      message.bidEpoch = Number(object.bidEpoch);
    } else {
      message.bidEpoch = 0;
    }
    return message;
  },

  toJSON(message: MsgRevealBid): unknown {
    const obj: any = {};
    message.mmPublicKey !== undefined &&
      (obj.mmPublicKey = message.mmPublicKey);
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    message.bid !== undefined && (obj.bid = message.bid);
    message.nonce !== undefined && (obj.nonce = message.nonce);
    message.mmUrl !== undefined && (obj.mmUrl = message.mmUrl);
    message.bidEpoch !== undefined && (obj.bidEpoch = message.bidEpoch);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgRevealBid>): MsgRevealBid {
    const message = { ...baseMsgRevealBid } as MsgRevealBid;
    if (object.mmPublicKey !== undefined && object.mmPublicKey !== null) {
      message.mmPublicKey = object.mmPublicKey;
    } else {
      message.mmPublicKey = "";
    }
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = object.auctionId;
    } else {
      message.auctionId = 0;
    }
    if (object.bid !== undefined && object.bid !== null) {
      message.bid = object.bid;
    } else {
      message.bid = 0;
    }
    if (object.nonce !== undefined && object.nonce !== null) {
      message.nonce = object.nonce;
    } else {
      message.nonce = 0;
    }
    if (object.mmUrl !== undefined && object.mmUrl !== null) {
      message.mmUrl = object.mmUrl;
    } else {
      message.mmUrl = "";
    }
    if (object.bidEpoch !== undefined && object.bidEpoch !== null) {
      message.bidEpoch = object.bidEpoch;
    } else {
      message.bidEpoch = 0;
    }
    return message;
  },
};

const baseMsgRevealBidResponse: object = {};

export const MsgRevealBidResponse = {
  encode(_: MsgRevealBidResponse, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgRevealBidResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRevealBidResponse } as MsgRevealBidResponse;
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

  fromJSON(_: any): MsgRevealBidResponse {
    const message = { ...baseMsgRevealBidResponse } as MsgRevealBidResponse;
    return message;
  },

  toJSON(_: MsgRevealBidResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgRevealBidResponse>): MsgRevealBidResponse {
    const message = { ...baseMsgRevealBidResponse } as MsgRevealBidResponse;
    return message;
  },
};

const baseMsgDeliverNotional: object = {
  signerPublicKey: "",
  ssPublicKey: "",
  auctionId: 0,
  notional: 0,
  auctionEpoch: 0,
  isForPaymentInLieu: false,
  extensions: "",
};

export const MsgDeliverNotional = {
  encode(
    message: MsgDeliverNotional,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.signerPublicKey !== "") {
      writer.uint32(10).string(message.signerPublicKey);
    }
    if (message.ssPublicKey !== "") {
      writer.uint32(18).string(message.ssPublicKey);
    }
    if (message.auctionId !== 0) {
      writer.uint32(24).uint64(message.auctionId);
    }
    if (message.notional !== 0) {
      writer.uint32(32).uint64(message.notional);
    }
    if (message.auctionEpoch !== 0) {
      writer.uint32(40).uint64(message.auctionEpoch);
    }
    if (message.endorsement !== undefined) {
      Endorsement.encode(
        message.endorsement,
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.isForPaymentInLieu === true) {
      writer.uint32(56).bool(message.isForPaymentInLieu);
    }
    if (message.extensions !== "") {
      writer.uint32(66).string(message.extensions);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgDeliverNotional {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgDeliverNotional } as MsgDeliverNotional;
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
          message.auctionId = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.notional = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.auctionEpoch = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.endorsement = Endorsement.decode(reader, reader.uint32());
          break;
        case 7:
          message.isForPaymentInLieu = reader.bool();
          break;
        case 8:
          message.extensions = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDeliverNotional {
    const message = { ...baseMsgDeliverNotional } as MsgDeliverNotional;
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
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = Number(object.auctionId);
    } else {
      message.auctionId = 0;
    }
    if (object.notional !== undefined && object.notional !== null) {
      message.notional = Number(object.notional);
    } else {
      message.notional = 0;
    }
    if (object.auctionEpoch !== undefined && object.auctionEpoch !== null) {
      message.auctionEpoch = Number(object.auctionEpoch);
    } else {
      message.auctionEpoch = 0;
    }
    if (object.endorsement !== undefined && object.endorsement !== null) {
      message.endorsement = Endorsement.fromJSON(object.endorsement);
    } else {
      message.endorsement = undefined;
    }
    if (
      object.isForPaymentInLieu !== undefined &&
      object.isForPaymentInLieu !== null
    ) {
      message.isForPaymentInLieu = Boolean(object.isForPaymentInLieu);
    } else {
      message.isForPaymentInLieu = false;
    }
    if (object.extensions !== undefined && object.extensions !== null) {
      message.extensions = String(object.extensions);
    } else {
      message.extensions = "";
    }
    return message;
  },

  toJSON(message: MsgDeliverNotional): unknown {
    const obj: any = {};
    message.signerPublicKey !== undefined &&
      (obj.signerPublicKey = message.signerPublicKey);
    message.ssPublicKey !== undefined &&
      (obj.ssPublicKey = message.ssPublicKey);
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    message.notional !== undefined && (obj.notional = message.notional);
    message.auctionEpoch !== undefined &&
      (obj.auctionEpoch = message.auctionEpoch);
    message.endorsement !== undefined &&
      (obj.endorsement = message.endorsement
        ? Endorsement.toJSON(message.endorsement)
        : undefined);
    message.isForPaymentInLieu !== undefined &&
      (obj.isForPaymentInLieu = message.isForPaymentInLieu);
    message.extensions !== undefined && (obj.extensions = message.extensions);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgDeliverNotional>): MsgDeliverNotional {
    const message = { ...baseMsgDeliverNotional } as MsgDeliverNotional;
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
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = object.auctionId;
    } else {
      message.auctionId = 0;
    }
    if (object.notional !== undefined && object.notional !== null) {
      message.notional = object.notional;
    } else {
      message.notional = 0;
    }
    if (object.auctionEpoch !== undefined && object.auctionEpoch !== null) {
      message.auctionEpoch = object.auctionEpoch;
    } else {
      message.auctionEpoch = 0;
    }
    if (object.endorsement !== undefined && object.endorsement !== null) {
      message.endorsement = Endorsement.fromPartial(object.endorsement);
    } else {
      message.endorsement = undefined;
    }
    if (
      object.isForPaymentInLieu !== undefined &&
      object.isForPaymentInLieu !== null
    ) {
      message.isForPaymentInLieu = object.isForPaymentInLieu;
    } else {
      message.isForPaymentInLieu = false;
    }
    if (object.extensions !== undefined && object.extensions !== null) {
      message.extensions = object.extensions;
    } else {
      message.extensions = "";
    }
    return message;
  },
};

const baseEndorsement: object = {
  endorser: "",
  signature: "",
  id: "",
  expirationTimeUTC: 0,
  data: "",
};

export const Endorsement = {
  encode(message: Endorsement, writer: Writer = Writer.create()): Writer {
    if (message.endorser !== "") {
      writer.uint32(10).string(message.endorser);
    }
    if (message.signature !== "") {
      writer.uint32(18).string(message.signature);
    }
    if (message.id !== "") {
      writer.uint32(26).string(message.id);
    }
    if (message.expirationTimeUTC !== 0) {
      writer.uint32(32).int64(message.expirationTimeUTC);
    }
    if (message.data !== "") {
      writer.uint32(42).string(message.data);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Endorsement {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEndorsement } as Endorsement;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.endorser = reader.string();
          break;
        case 2:
          message.signature = reader.string();
          break;
        case 3:
          message.id = reader.string();
          break;
        case 4:
          message.expirationTimeUTC = longToNumber(reader.int64() as Long);
          break;
        case 5:
          message.data = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Endorsement {
    const message = { ...baseEndorsement } as Endorsement;
    if (object.endorser !== undefined && object.endorser !== null) {
      message.endorser = String(object.endorser);
    } else {
      message.endorser = "";
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = String(object.signature);
    } else {
      message.signature = "";
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = "";
    }
    if (
      object.expirationTimeUTC !== undefined &&
      object.expirationTimeUTC !== null
    ) {
      message.expirationTimeUTC = Number(object.expirationTimeUTC);
    } else {
      message.expirationTimeUTC = 0;
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = String(object.data);
    } else {
      message.data = "";
    }
    return message;
  },

  toJSON(message: Endorsement): unknown {
    const obj: any = {};
    message.endorser !== undefined && (obj.endorser = message.endorser);
    message.signature !== undefined && (obj.signature = message.signature);
    message.id !== undefined && (obj.id = message.id);
    message.expirationTimeUTC !== undefined &&
      (obj.expirationTimeUTC = message.expirationTimeUTC);
    message.data !== undefined && (obj.data = message.data);
    return obj;
  },

  fromPartial(object: DeepPartial<Endorsement>): Endorsement {
    const message = { ...baseEndorsement } as Endorsement;
    if (object.endorser !== undefined && object.endorser !== null) {
      message.endorser = object.endorser;
    } else {
      message.endorser = "";
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = object.signature;
    } else {
      message.signature = "";
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = "";
    }
    if (
      object.expirationTimeUTC !== undefined &&
      object.expirationTimeUTC !== null
    ) {
      message.expirationTimeUTC = object.expirationTimeUTC;
    } else {
      message.expirationTimeUTC = 0;
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = object.data;
    } else {
      message.data = "";
    }
    return message;
  },
};

const baseMsgDeliverNotionalResponse: object = {};

export const MsgDeliverNotionalResponse = {
  encode(
    _: MsgDeliverNotionalResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgDeliverNotionalResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgDeliverNotionalResponse,
    } as MsgDeliverNotionalResponse;
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

  fromJSON(_: any): MsgDeliverNotionalResponse {
    const message = {
      ...baseMsgDeliverNotionalResponse,
    } as MsgDeliverNotionalResponse;
    return message;
  },

  toJSON(_: MsgDeliverNotionalResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgDeliverNotionalResponse>
  ): MsgDeliverNotionalResponse {
    const message = {
      ...baseMsgDeliverNotionalResponse,
    } as MsgDeliverNotionalResponse;
    return message;
  },
};

const baseMsgUpdateAuction: object = {
  ofsPublicKey: "",
  auctionId: 0,
  clientAuctionId: "",
};

export const MsgUpdateAuction = {
  encode(message: MsgUpdateAuction, writer: Writer = Writer.create()): Writer {
    if (message.ofsPublicKey !== "") {
      writer.uint32(10).string(message.ofsPublicKey);
    }
    if (message.auctionId !== 0) {
      writer.uint32(16).uint64(message.auctionId);
    }
    if (message.clientAuctionId !== "") {
      writer.uint32(26).string(message.clientAuctionId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgUpdateAuction {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgUpdateAuction } as MsgUpdateAuction;
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
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateAuction {
    const message = { ...baseMsgUpdateAuction } as MsgUpdateAuction;
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
    return message;
  },

  toJSON(message: MsgUpdateAuction): unknown {
    const obj: any = {};
    message.ofsPublicKey !== undefined &&
      (obj.ofsPublicKey = message.ofsPublicKey);
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    message.clientAuctionId !== undefined &&
      (obj.clientAuctionId = message.clientAuctionId);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgUpdateAuction>): MsgUpdateAuction {
    const message = { ...baseMsgUpdateAuction } as MsgUpdateAuction;
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
    return message;
  },
};

const baseMsgUpdateAuctionResponse: object = {};

export const MsgUpdateAuctionResponse = {
  encode(
    _: MsgUpdateAuctionResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgUpdateAuctionResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgUpdateAuctionResponse,
    } as MsgUpdateAuctionResponse;
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

  fromJSON(_: any): MsgUpdateAuctionResponse {
    const message = {
      ...baseMsgUpdateAuctionResponse,
    } as MsgUpdateAuctionResponse;
    return message;
  },

  toJSON(_: MsgUpdateAuctionResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgUpdateAuctionResponse>
  ): MsgUpdateAuctionResponse {
    const message = {
      ...baseMsgUpdateAuctionResponse,
    } as MsgUpdateAuctionResponse;
    return message;
  },
};

const baseMsgDeleteAuction: object = { ofsPublicKey: "", auctionId: 0 };

export const MsgDeleteAuction = {
  encode(message: MsgDeleteAuction, writer: Writer = Writer.create()): Writer {
    if (message.ofsPublicKey !== "") {
      writer.uint32(10).string(message.ofsPublicKey);
    }
    if (message.auctionId !== 0) {
      writer.uint32(16).uint64(message.auctionId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgDeleteAuction {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgDeleteAuction } as MsgDeleteAuction;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ofsPublicKey = reader.string();
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

  fromJSON(object: any): MsgDeleteAuction {
    const message = { ...baseMsgDeleteAuction } as MsgDeleteAuction;
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
    return message;
  },

  toJSON(message: MsgDeleteAuction): unknown {
    const obj: any = {};
    message.ofsPublicKey !== undefined &&
      (obj.ofsPublicKey = message.ofsPublicKey);
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgDeleteAuction>): MsgDeleteAuction {
    const message = { ...baseMsgDeleteAuction } as MsgDeleteAuction;
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
    return message;
  },
};

const baseMsgDeleteAuctionResponse: object = {};

export const MsgDeleteAuctionResponse = {
  encode(
    _: MsgDeleteAuctionResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgDeleteAuctionResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgDeleteAuctionResponse,
    } as MsgDeleteAuctionResponse;
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

  fromJSON(_: any): MsgDeleteAuctionResponse {
    const message = {
      ...baseMsgDeleteAuctionResponse,
    } as MsgDeleteAuctionResponse;
    return message;
  },

  toJSON(_: MsgDeleteAuctionResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgDeleteAuctionResponse>
  ): MsgDeleteAuctionResponse {
    const message = {
      ...baseMsgDeleteAuctionResponse,
    } as MsgDeleteAuctionResponse;
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  CreateAuction(request: MsgCreateAuction): Promise<MsgCreateAuctionResponse>;
  /**
   * Submits a blind bid. A bid can be revised after it is submitted by sending a ReviseBlindBid
   * message. A market maker can submit blind bids for different auctions simultaneously but must
   * send each blind bid message in a single-message transaction if doing so.
   */
  BlindBid(request: MsgBlindBid): Promise<MsgBlindBidResponse>;
  /** Revises the sender's blind bid. A bid cannot be revised after it is revealed. */
  ReviseBlindBid(
    request: MsgReviseBlindBid
  ): Promise<MsgReviseBlindBidResponse>;
  /**
   * Reveals a blind bid. A market maker can reveal bids for multiple different auctions
   * simultaneously but must send each reveal bid message in a single-message transaction if doing
   * so.
   */
  RevealBid(request: MsgRevealBid): Promise<MsgRevealBidResponse>;
  DeliverNotional(
    request: MsgDeliverNotional
  ): Promise<MsgDeliverNotionalResponse>;
  UpdateAuction(request: MsgUpdateAuction): Promise<MsgUpdateAuctionResponse>;
  /** this line is used by starport scaffolding # proto/tx/rpc */
  DeleteAuction(request: MsgDeleteAuction): Promise<MsgDeleteAuctionResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  CreateAuction(request: MsgCreateAuction): Promise<MsgCreateAuctionResponse> {
    const data = MsgCreateAuction.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.auction.Msg",
      "CreateAuction",
      data
    );
    return promise.then((data) =>
      MsgCreateAuctionResponse.decode(new Reader(data))
    );
  }

  BlindBid(request: MsgBlindBid): Promise<MsgBlindBidResponse> {
    const data = MsgBlindBid.encode(request).finish();
    const promise = this.rpc.request("dflow.auction.Msg", "BlindBid", data);
    return promise.then((data) => MsgBlindBidResponse.decode(new Reader(data)));
  }

  ReviseBlindBid(
    request: MsgReviseBlindBid
  ): Promise<MsgReviseBlindBidResponse> {
    const data = MsgReviseBlindBid.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.auction.Msg",
      "ReviseBlindBid",
      data
    );
    return promise.then((data) =>
      MsgReviseBlindBidResponse.decode(new Reader(data))
    );
  }

  RevealBid(request: MsgRevealBid): Promise<MsgRevealBidResponse> {
    const data = MsgRevealBid.encode(request).finish();
    const promise = this.rpc.request("dflow.auction.Msg", "RevealBid", data);
    return promise.then((data) =>
      MsgRevealBidResponse.decode(new Reader(data))
    );
  }

  DeliverNotional(
    request: MsgDeliverNotional
  ): Promise<MsgDeliverNotionalResponse> {
    const data = MsgDeliverNotional.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.auction.Msg",
      "DeliverNotional",
      data
    );
    return promise.then((data) =>
      MsgDeliverNotionalResponse.decode(new Reader(data))
    );
  }

  UpdateAuction(request: MsgUpdateAuction): Promise<MsgUpdateAuctionResponse> {
    const data = MsgUpdateAuction.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.auction.Msg",
      "UpdateAuction",
      data
    );
    return promise.then((data) =>
      MsgUpdateAuctionResponse.decode(new Reader(data))
    );
  }

  DeleteAuction(request: MsgDeleteAuction): Promise<MsgDeleteAuctionResponse> {
    const data = MsgDeleteAuction.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.auction.Msg",
      "DeleteAuction",
      data
    );
    return promise.then((data) =>
      MsgDeleteAuctionResponse.decode(new Reader(data))
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
