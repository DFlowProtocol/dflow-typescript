/* eslint-disable */
import { Reader, util, configure, Writer } from "protobufjs/minimal";
import * as Long from "long";
import { Params } from "../auction/params";
import { GlobalAuctionState } from "../auction/global_auction_state";
import {
  OrderFlowAuction,
  AuctionGridDataRow,
} from "../auction/order_flow_auction";
import {
  PageRequest,
  PageResponse,
} from "../cosmos/base/query/v1beta1/pagination";
import { EncodedExpiringAuctions } from "../auction/encoded_expiring_auctions";
import { Endorsements } from "../auction/endorsements";

export const protobufPackage = "dflow.auction";

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {}

/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params: Params | undefined;
}

export interface QueryGetGlobalAuctionStateRequest {}

export interface QueryGetGlobalAuctionStateResponse {
  GlobalAuctionState: GlobalAuctionState | undefined;
}

export interface QueryGetOrderFlowAuctionRequest {
  auctionId: number;
}

export interface QueryGetOrderFlowAuctionResponse {
  orderFlowAuction: OrderFlowAuction | undefined;
}

export interface QueryAllOrderFlowAuctionRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllOrderFlowAuctionResponse {
  orderFlowAuction: OrderFlowAuction[];
  pagination: PageResponse | undefined;
}

export interface QueryOrderFlowAuctionsRequest {
  ofsPublicKey: string;
  /** Specify an empty string to match any network */
  network: string;
  /** Specify an empty string to match any currency */
  currency1: string;
  /** Specify an empty string to match any currency */
  currency2: string;
  /** Scaled notional size of the order. Specify an empty string to match any notional size. */
  orderSize: string;
}

export interface QueryOrderFlowAuctionsResponse {
  orderFlowAuctions: OrderFlowAuction[];
}

/**
 * message Filter {
 * 	message CurrencyPairFilter {
 * 		// Auction is included if its currency pair matches. If only currency1 is specified,
 * 		// then all auctions for currency1 are included.
 * 		string currency1 = 1;
 * 		string currency2 = 2;
 * 	}
 * 	message OrderSizeRangeFilter {
 * 		// Auction is included if its order size range intersects with [min, max].
 * 		// Scaled integer with two decimals.
 * 		uint64 min = 1;
 * 		// Auction is included if its order size range intersects with [min, max].
 * 		// Scaled integer with two decimals.
 * 		uint64 max = 2;
 * 	}
 * 	message NotionalSizeFilter {
 * 		// Minimum notional size to include. Scaled integer with two decimals.
 * 		uint64 min = 1;
 * 		// Maximum notional size to include. Scaled integer with two decimals.
 * 		uint64 max = 2;
 * 	}
 * 	message DeliveryPeriodFilter {
 * 		// Minimum delivery period to include
 * 		int64 min = 1;
 * 		// Maximum delivery period to include
 * 		int64 max = 2;
 * 	}
 * 	message FeePayerModeFilter {
 * 		uint32 value = 1;
 * 	}
 * 	repeated uint64 auctionIds = 1;
 * 	repeated string ofsPublicKeys = 2;
 * 	repeated string networks = 3;
 *  // TODO: Probably need to use a JSON string here
 * 	repeated CurrencyPairFilter currencyPairs = 4;
 *  // TODO: Probably need to use a JSON string here
 * 	repeated OrderSizeRangeFilter orderSizeRangeFilters = 5;
 *  // TODO: Probably need to use a JSON string here
 * 	repeated NotionalSizeFilter notionalSizeFilters = 6;
 *  // TODO: Probably need to use a JSON string here
 * 	repeated DeliveryPeriodFilter deliveryPeriodFilters = 7;
 * 	FeePayerModeFilter feePayerMode = 8;
 * }
 */
export interface QueryGridRequest {
  /**
   * Filter filter = 1;
   * Sort sort = 2;
   */
  pagination: PageRequest | undefined;
}

export interface QueryGridResponse {
  rows: AuctionGridDataRow[];
  pagination: PageResponse | undefined;
}

export interface QueryGridRowsRequest {
  /** Comma-separated auction IDs */
  auctionIds: string;
}

export interface QueryGridRowsResponse {
  rows: AuctionGridDataRow[];
}

export interface QueryPricingInfoRequest {
  ofsPublicKey: string;
  network: string;
  currency1: string;
  currency2: string;
}

export interface QueryPricingInfoResponse {
  /** Unspecified if the OFS account doesn't exist */
  pricingInfo: QueryPricingInfoResponse_PricingInfo | undefined;
}

export interface QueryPricingInfoResponse_PricingInfo {
  /** Boolean indicating whether an auction exists for the currency pair */
  auctionExistsForPair: boolean;
  flowEndorsementKey1: string;
  flowEndorsementKey2: string;
  /**
   * TODO: Return pricing source for currency1
   * TODO: Return pricing source for currency2
   */
  ofsAccountExtensions: string;
}

export interface QueryOverlapRequest {
  ofsPublicKey: string;
  /**
   * List of nonexistent auctions to check for overlap. Each auction is JSON of the form
   * {
   *   "network": string,
   *   "currency1": string,
   *   "currency2": string,
   *   "minimumOrderSize": string,
   *   "maximumOrderSize": string,
   *   "isUnidirectional": bool (optional),
   *   "feePayerMode": uint32 (optional),
   * }
   *
   * For unidirectional auctions, currency1 is the currency that the retail trader sends and
   * currency2 is the currency that the retail trader receives.
   */
  auctions: string[];
}

export interface QueryOverlapResponse {
  overlapInfos: QueryOverlapResponse_OverlapInfo[];
}

export interface QueryOverlapResponse_OverlapInfo {
  hasOverlap: boolean;
}

export interface QueryGetEncodedExpiringAuctionsRequest {}

export interface QueryGetEncodedExpiringAuctionsResponse {
  EncodedExpiringAuctions: EncodedExpiringAuctions | undefined;
}

export interface QueryGetEndorsementsRequest {
  ofsPublicKey: string;
}

export interface QueryGetEndorsementsResponse {
  endorsements: Endorsements | undefined;
}

export interface QueryAllEndorsementsRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllEndorsementsResponse {
  endorsements: Endorsements[];
  pagination: PageResponse | undefined;
}

const baseQueryParamsRequest: object = {};

export const QueryParamsRequest = {
  encode(_: QueryParamsRequest, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
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

  fromJSON(_: any): QueryParamsRequest {
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
    return message;
  },

  toJSON(_: QueryParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<QueryParamsRequest>): QueryParamsRequest {
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
    return message;
  },
};

const baseQueryParamsResponse: object = {};

export const QueryParamsResponse = {
  encode(
    message: QueryParamsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryParamsResponse {
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromJSON(object.params);
    } else {
      message.params = undefined;
    }
    return message;
  },

  toJSON(message: QueryParamsResponse): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryParamsResponse>): QueryParamsResponse {
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromPartial(object.params);
    } else {
      message.params = undefined;
    }
    return message;
  },
};

const baseQueryGetGlobalAuctionStateRequest: object = {};

export const QueryGetGlobalAuctionStateRequest = {
  encode(
    _: QueryGetGlobalAuctionStateRequest,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetGlobalAuctionStateRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetGlobalAuctionStateRequest,
    } as QueryGetGlobalAuctionStateRequest;
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

  fromJSON(_: any): QueryGetGlobalAuctionStateRequest {
    const message = {
      ...baseQueryGetGlobalAuctionStateRequest,
    } as QueryGetGlobalAuctionStateRequest;
    return message;
  },

  toJSON(_: QueryGetGlobalAuctionStateRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<QueryGetGlobalAuctionStateRequest>
  ): QueryGetGlobalAuctionStateRequest {
    const message = {
      ...baseQueryGetGlobalAuctionStateRequest,
    } as QueryGetGlobalAuctionStateRequest;
    return message;
  },
};

const baseQueryGetGlobalAuctionStateResponse: object = {};

export const QueryGetGlobalAuctionStateResponse = {
  encode(
    message: QueryGetGlobalAuctionStateResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.GlobalAuctionState !== undefined) {
      GlobalAuctionState.encode(
        message.GlobalAuctionState,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetGlobalAuctionStateResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetGlobalAuctionStateResponse,
    } as QueryGetGlobalAuctionStateResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.GlobalAuctionState = GlobalAuctionState.decode(
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

  fromJSON(object: any): QueryGetGlobalAuctionStateResponse {
    const message = {
      ...baseQueryGetGlobalAuctionStateResponse,
    } as QueryGetGlobalAuctionStateResponse;
    if (
      object.GlobalAuctionState !== undefined &&
      object.GlobalAuctionState !== null
    ) {
      message.GlobalAuctionState = GlobalAuctionState.fromJSON(
        object.GlobalAuctionState
      );
    } else {
      message.GlobalAuctionState = undefined;
    }
    return message;
  },

  toJSON(message: QueryGetGlobalAuctionStateResponse): unknown {
    const obj: any = {};
    message.GlobalAuctionState !== undefined &&
      (obj.GlobalAuctionState = message.GlobalAuctionState
        ? GlobalAuctionState.toJSON(message.GlobalAuctionState)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetGlobalAuctionStateResponse>
  ): QueryGetGlobalAuctionStateResponse {
    const message = {
      ...baseQueryGetGlobalAuctionStateResponse,
    } as QueryGetGlobalAuctionStateResponse;
    if (
      object.GlobalAuctionState !== undefined &&
      object.GlobalAuctionState !== null
    ) {
      message.GlobalAuctionState = GlobalAuctionState.fromPartial(
        object.GlobalAuctionState
      );
    } else {
      message.GlobalAuctionState = undefined;
    }
    return message;
  },
};

const baseQueryGetOrderFlowAuctionRequest: object = { auctionId: 0 };

export const QueryGetOrderFlowAuctionRequest = {
  encode(
    message: QueryGetOrderFlowAuctionRequest,
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
  ): QueryGetOrderFlowAuctionRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetOrderFlowAuctionRequest,
    } as QueryGetOrderFlowAuctionRequest;
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

  fromJSON(object: any): QueryGetOrderFlowAuctionRequest {
    const message = {
      ...baseQueryGetOrderFlowAuctionRequest,
    } as QueryGetOrderFlowAuctionRequest;
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = Number(object.auctionId);
    } else {
      message.auctionId = 0;
    }
    return message;
  },

  toJSON(message: QueryGetOrderFlowAuctionRequest): unknown {
    const obj: any = {};
    message.auctionId !== undefined && (obj.auctionId = message.auctionId);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetOrderFlowAuctionRequest>
  ): QueryGetOrderFlowAuctionRequest {
    const message = {
      ...baseQueryGetOrderFlowAuctionRequest,
    } as QueryGetOrderFlowAuctionRequest;
    if (object.auctionId !== undefined && object.auctionId !== null) {
      message.auctionId = object.auctionId;
    } else {
      message.auctionId = 0;
    }
    return message;
  },
};

const baseQueryGetOrderFlowAuctionResponse: object = {};

export const QueryGetOrderFlowAuctionResponse = {
  encode(
    message: QueryGetOrderFlowAuctionResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.orderFlowAuction !== undefined) {
      OrderFlowAuction.encode(
        message.orderFlowAuction,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetOrderFlowAuctionResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetOrderFlowAuctionResponse,
    } as QueryGetOrderFlowAuctionResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderFlowAuction = OrderFlowAuction.decode(
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

  fromJSON(object: any): QueryGetOrderFlowAuctionResponse {
    const message = {
      ...baseQueryGetOrderFlowAuctionResponse,
    } as QueryGetOrderFlowAuctionResponse;
    if (
      object.orderFlowAuction !== undefined &&
      object.orderFlowAuction !== null
    ) {
      message.orderFlowAuction = OrderFlowAuction.fromJSON(
        object.orderFlowAuction
      );
    } else {
      message.orderFlowAuction = undefined;
    }
    return message;
  },

  toJSON(message: QueryGetOrderFlowAuctionResponse): unknown {
    const obj: any = {};
    message.orderFlowAuction !== undefined &&
      (obj.orderFlowAuction = message.orderFlowAuction
        ? OrderFlowAuction.toJSON(message.orderFlowAuction)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetOrderFlowAuctionResponse>
  ): QueryGetOrderFlowAuctionResponse {
    const message = {
      ...baseQueryGetOrderFlowAuctionResponse,
    } as QueryGetOrderFlowAuctionResponse;
    if (
      object.orderFlowAuction !== undefined &&
      object.orderFlowAuction !== null
    ) {
      message.orderFlowAuction = OrderFlowAuction.fromPartial(
        object.orderFlowAuction
      );
    } else {
      message.orderFlowAuction = undefined;
    }
    return message;
  },
};

const baseQueryAllOrderFlowAuctionRequest: object = {};

export const QueryAllOrderFlowAuctionRequest = {
  encode(
    message: QueryAllOrderFlowAuctionRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryAllOrderFlowAuctionRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllOrderFlowAuctionRequest,
    } as QueryAllOrderFlowAuctionRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllOrderFlowAuctionRequest {
    const message = {
      ...baseQueryAllOrderFlowAuctionRequest,
    } as QueryAllOrderFlowAuctionRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllOrderFlowAuctionRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllOrderFlowAuctionRequest>
  ): QueryAllOrderFlowAuctionRequest {
    const message = {
      ...baseQueryAllOrderFlowAuctionRequest,
    } as QueryAllOrderFlowAuctionRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryAllOrderFlowAuctionResponse: object = {};

export const QueryAllOrderFlowAuctionResponse = {
  encode(
    message: QueryAllOrderFlowAuctionResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.orderFlowAuction) {
      OrderFlowAuction.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryAllOrderFlowAuctionResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllOrderFlowAuctionResponse,
    } as QueryAllOrderFlowAuctionResponse;
    message.orderFlowAuction = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderFlowAuction.push(
            OrderFlowAuction.decode(reader, reader.uint32())
          );
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllOrderFlowAuctionResponse {
    const message = {
      ...baseQueryAllOrderFlowAuctionResponse,
    } as QueryAllOrderFlowAuctionResponse;
    message.orderFlowAuction = [];
    if (
      object.orderFlowAuction !== undefined &&
      object.orderFlowAuction !== null
    ) {
      for (const e of object.orderFlowAuction) {
        message.orderFlowAuction.push(OrderFlowAuction.fromJSON(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllOrderFlowAuctionResponse): unknown {
    const obj: any = {};
    if (message.orderFlowAuction) {
      obj.orderFlowAuction = message.orderFlowAuction.map((e) =>
        e ? OrderFlowAuction.toJSON(e) : undefined
      );
    } else {
      obj.orderFlowAuction = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllOrderFlowAuctionResponse>
  ): QueryAllOrderFlowAuctionResponse {
    const message = {
      ...baseQueryAllOrderFlowAuctionResponse,
    } as QueryAllOrderFlowAuctionResponse;
    message.orderFlowAuction = [];
    if (
      object.orderFlowAuction !== undefined &&
      object.orderFlowAuction !== null
    ) {
      for (const e of object.orderFlowAuction) {
        message.orderFlowAuction.push(OrderFlowAuction.fromPartial(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryOrderFlowAuctionsRequest: object = {
  ofsPublicKey: "",
  network: "",
  currency1: "",
  currency2: "",
  orderSize: "",
};

export const QueryOrderFlowAuctionsRequest = {
  encode(
    message: QueryOrderFlowAuctionsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.ofsPublicKey !== "") {
      writer.uint32(10).string(message.ofsPublicKey);
    }
    if (message.network !== "") {
      writer.uint32(18).string(message.network);
    }
    if (message.currency1 !== "") {
      writer.uint32(26).string(message.currency1);
    }
    if (message.currency2 !== "") {
      writer.uint32(34).string(message.currency2);
    }
    if (message.orderSize !== "") {
      writer.uint32(42).string(message.orderSize);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryOrderFlowAuctionsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryOrderFlowAuctionsRequest,
    } as QueryOrderFlowAuctionsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ofsPublicKey = reader.string();
          break;
        case 2:
          message.network = reader.string();
          break;
        case 3:
          message.currency1 = reader.string();
          break;
        case 4:
          message.currency2 = reader.string();
          break;
        case 5:
          message.orderSize = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryOrderFlowAuctionsRequest {
    const message = {
      ...baseQueryOrderFlowAuctionsRequest,
    } as QueryOrderFlowAuctionsRequest;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = String(object.ofsPublicKey);
    } else {
      message.ofsPublicKey = "";
    }
    if (object.network !== undefined && object.network !== null) {
      message.network = String(object.network);
    } else {
      message.network = "";
    }
    if (object.currency1 !== undefined && object.currency1 !== null) {
      message.currency1 = String(object.currency1);
    } else {
      message.currency1 = "";
    }
    if (object.currency2 !== undefined && object.currency2 !== null) {
      message.currency2 = String(object.currency2);
    } else {
      message.currency2 = "";
    }
    if (object.orderSize !== undefined && object.orderSize !== null) {
      message.orderSize = String(object.orderSize);
    } else {
      message.orderSize = "";
    }
    return message;
  },

  toJSON(message: QueryOrderFlowAuctionsRequest): unknown {
    const obj: any = {};
    message.ofsPublicKey !== undefined &&
      (obj.ofsPublicKey = message.ofsPublicKey);
    message.network !== undefined && (obj.network = message.network);
    message.currency1 !== undefined && (obj.currency1 = message.currency1);
    message.currency2 !== undefined && (obj.currency2 = message.currency2);
    message.orderSize !== undefined && (obj.orderSize = message.orderSize);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryOrderFlowAuctionsRequest>
  ): QueryOrderFlowAuctionsRequest {
    const message = {
      ...baseQueryOrderFlowAuctionsRequest,
    } as QueryOrderFlowAuctionsRequest;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = object.ofsPublicKey;
    } else {
      message.ofsPublicKey = "";
    }
    if (object.network !== undefined && object.network !== null) {
      message.network = object.network;
    } else {
      message.network = "";
    }
    if (object.currency1 !== undefined && object.currency1 !== null) {
      message.currency1 = object.currency1;
    } else {
      message.currency1 = "";
    }
    if (object.currency2 !== undefined && object.currency2 !== null) {
      message.currency2 = object.currency2;
    } else {
      message.currency2 = "";
    }
    if (object.orderSize !== undefined && object.orderSize !== null) {
      message.orderSize = object.orderSize;
    } else {
      message.orderSize = "";
    }
    return message;
  },
};

const baseQueryOrderFlowAuctionsResponse: object = {};

export const QueryOrderFlowAuctionsResponse = {
  encode(
    message: QueryOrderFlowAuctionsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.orderFlowAuctions) {
      OrderFlowAuction.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryOrderFlowAuctionsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryOrderFlowAuctionsResponse,
    } as QueryOrderFlowAuctionsResponse;
    message.orderFlowAuctions = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderFlowAuctions.push(
            OrderFlowAuction.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryOrderFlowAuctionsResponse {
    const message = {
      ...baseQueryOrderFlowAuctionsResponse,
    } as QueryOrderFlowAuctionsResponse;
    message.orderFlowAuctions = [];
    if (
      object.orderFlowAuctions !== undefined &&
      object.orderFlowAuctions !== null
    ) {
      for (const e of object.orderFlowAuctions) {
        message.orderFlowAuctions.push(OrderFlowAuction.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: QueryOrderFlowAuctionsResponse): unknown {
    const obj: any = {};
    if (message.orderFlowAuctions) {
      obj.orderFlowAuctions = message.orderFlowAuctions.map((e) =>
        e ? OrderFlowAuction.toJSON(e) : undefined
      );
    } else {
      obj.orderFlowAuctions = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryOrderFlowAuctionsResponse>
  ): QueryOrderFlowAuctionsResponse {
    const message = {
      ...baseQueryOrderFlowAuctionsResponse,
    } as QueryOrderFlowAuctionsResponse;
    message.orderFlowAuctions = [];
    if (
      object.orderFlowAuctions !== undefined &&
      object.orderFlowAuctions !== null
    ) {
      for (const e of object.orderFlowAuctions) {
        message.orderFlowAuctions.push(OrderFlowAuction.fromPartial(e));
      }
    }
    return message;
  },
};

const baseQueryGridRequest: object = {};

export const QueryGridRequest = {
  encode(message: QueryGridRequest, writer: Writer = Writer.create()): Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGridRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGridRequest } as QueryGridRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGridRequest {
    const message = { ...baseQueryGridRequest } as QueryGridRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryGridRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryGridRequest>): QueryGridRequest {
    const message = { ...baseQueryGridRequest } as QueryGridRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryGridResponse: object = {};

export const QueryGridResponse = {
  encode(message: QueryGridResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.rows) {
      AuctionGridDataRow.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGridResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGridResponse } as QueryGridResponse;
    message.rows = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rows.push(AuctionGridDataRow.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGridResponse {
    const message = { ...baseQueryGridResponse } as QueryGridResponse;
    message.rows = [];
    if (object.rows !== undefined && object.rows !== null) {
      for (const e of object.rows) {
        message.rows.push(AuctionGridDataRow.fromJSON(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryGridResponse): unknown {
    const obj: any = {};
    if (message.rows) {
      obj.rows = message.rows.map((e) =>
        e ? AuctionGridDataRow.toJSON(e) : undefined
      );
    } else {
      obj.rows = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryGridResponse>): QueryGridResponse {
    const message = { ...baseQueryGridResponse } as QueryGridResponse;
    message.rows = [];
    if (object.rows !== undefined && object.rows !== null) {
      for (const e of object.rows) {
        message.rows.push(AuctionGridDataRow.fromPartial(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryGridRowsRequest: object = { auctionIds: "" };

export const QueryGridRowsRequest = {
  encode(
    message: QueryGridRowsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.auctionIds !== "") {
      writer.uint32(10).string(message.auctionIds);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGridRowsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGridRowsRequest } as QueryGridRowsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.auctionIds = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGridRowsRequest {
    const message = { ...baseQueryGridRowsRequest } as QueryGridRowsRequest;
    if (object.auctionIds !== undefined && object.auctionIds !== null) {
      message.auctionIds = String(object.auctionIds);
    } else {
      message.auctionIds = "";
    }
    return message;
  },

  toJSON(message: QueryGridRowsRequest): unknown {
    const obj: any = {};
    message.auctionIds !== undefined && (obj.auctionIds = message.auctionIds);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryGridRowsRequest>): QueryGridRowsRequest {
    const message = { ...baseQueryGridRowsRequest } as QueryGridRowsRequest;
    if (object.auctionIds !== undefined && object.auctionIds !== null) {
      message.auctionIds = object.auctionIds;
    } else {
      message.auctionIds = "";
    }
    return message;
  },
};

const baseQueryGridRowsResponse: object = {};

export const QueryGridRowsResponse = {
  encode(
    message: QueryGridRowsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.rows) {
      AuctionGridDataRow.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGridRowsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGridRowsResponse } as QueryGridRowsResponse;
    message.rows = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rows.push(AuctionGridDataRow.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGridRowsResponse {
    const message = { ...baseQueryGridRowsResponse } as QueryGridRowsResponse;
    message.rows = [];
    if (object.rows !== undefined && object.rows !== null) {
      for (const e of object.rows) {
        message.rows.push(AuctionGridDataRow.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: QueryGridRowsResponse): unknown {
    const obj: any = {};
    if (message.rows) {
      obj.rows = message.rows.map((e) =>
        e ? AuctionGridDataRow.toJSON(e) : undefined
      );
    } else {
      obj.rows = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGridRowsResponse>
  ): QueryGridRowsResponse {
    const message = { ...baseQueryGridRowsResponse } as QueryGridRowsResponse;
    message.rows = [];
    if (object.rows !== undefined && object.rows !== null) {
      for (const e of object.rows) {
        message.rows.push(AuctionGridDataRow.fromPartial(e));
      }
    }
    return message;
  },
};

const baseQueryPricingInfoRequest: object = {
  ofsPublicKey: "",
  network: "",
  currency1: "",
  currency2: "",
};

export const QueryPricingInfoRequest = {
  encode(
    message: QueryPricingInfoRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.ofsPublicKey !== "") {
      writer.uint32(10).string(message.ofsPublicKey);
    }
    if (message.network !== "") {
      writer.uint32(18).string(message.network);
    }
    if (message.currency1 !== "") {
      writer.uint32(26).string(message.currency1);
    }
    if (message.currency2 !== "") {
      writer.uint32(34).string(message.currency2);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): QueryPricingInfoRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPricingInfoRequest,
    } as QueryPricingInfoRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ofsPublicKey = reader.string();
          break;
        case 2:
          message.network = reader.string();
          break;
        case 3:
          message.currency1 = reader.string();
          break;
        case 4:
          message.currency2 = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryPricingInfoRequest {
    const message = {
      ...baseQueryPricingInfoRequest,
    } as QueryPricingInfoRequest;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = String(object.ofsPublicKey);
    } else {
      message.ofsPublicKey = "";
    }
    if (object.network !== undefined && object.network !== null) {
      message.network = String(object.network);
    } else {
      message.network = "";
    }
    if (object.currency1 !== undefined && object.currency1 !== null) {
      message.currency1 = String(object.currency1);
    } else {
      message.currency1 = "";
    }
    if (object.currency2 !== undefined && object.currency2 !== null) {
      message.currency2 = String(object.currency2);
    } else {
      message.currency2 = "";
    }
    return message;
  },

  toJSON(message: QueryPricingInfoRequest): unknown {
    const obj: any = {};
    message.ofsPublicKey !== undefined &&
      (obj.ofsPublicKey = message.ofsPublicKey);
    message.network !== undefined && (obj.network = message.network);
    message.currency1 !== undefined && (obj.currency1 = message.currency1);
    message.currency2 !== undefined && (obj.currency2 = message.currency2);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPricingInfoRequest>
  ): QueryPricingInfoRequest {
    const message = {
      ...baseQueryPricingInfoRequest,
    } as QueryPricingInfoRequest;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = object.ofsPublicKey;
    } else {
      message.ofsPublicKey = "";
    }
    if (object.network !== undefined && object.network !== null) {
      message.network = object.network;
    } else {
      message.network = "";
    }
    if (object.currency1 !== undefined && object.currency1 !== null) {
      message.currency1 = object.currency1;
    } else {
      message.currency1 = "";
    }
    if (object.currency2 !== undefined && object.currency2 !== null) {
      message.currency2 = object.currency2;
    } else {
      message.currency2 = "";
    }
    return message;
  },
};

const baseQueryPricingInfoResponse: object = {};

export const QueryPricingInfoResponse = {
  encode(
    message: QueryPricingInfoResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.pricingInfo !== undefined) {
      QueryPricingInfoResponse_PricingInfo.encode(
        message.pricingInfo,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPricingInfoResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPricingInfoResponse,
    } as QueryPricingInfoResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pricingInfo = QueryPricingInfoResponse_PricingInfo.decode(
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

  fromJSON(object: any): QueryPricingInfoResponse {
    const message = {
      ...baseQueryPricingInfoResponse,
    } as QueryPricingInfoResponse;
    if (object.pricingInfo !== undefined && object.pricingInfo !== null) {
      message.pricingInfo = QueryPricingInfoResponse_PricingInfo.fromJSON(
        object.pricingInfo
      );
    } else {
      message.pricingInfo = undefined;
    }
    return message;
  },

  toJSON(message: QueryPricingInfoResponse): unknown {
    const obj: any = {};
    message.pricingInfo !== undefined &&
      (obj.pricingInfo = message.pricingInfo
        ? QueryPricingInfoResponse_PricingInfo.toJSON(message.pricingInfo)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPricingInfoResponse>
  ): QueryPricingInfoResponse {
    const message = {
      ...baseQueryPricingInfoResponse,
    } as QueryPricingInfoResponse;
    if (object.pricingInfo !== undefined && object.pricingInfo !== null) {
      message.pricingInfo = QueryPricingInfoResponse_PricingInfo.fromPartial(
        object.pricingInfo
      );
    } else {
      message.pricingInfo = undefined;
    }
    return message;
  },
};

const baseQueryPricingInfoResponse_PricingInfo: object = {
  auctionExistsForPair: false,
  flowEndorsementKey1: "",
  flowEndorsementKey2: "",
  ofsAccountExtensions: "",
};

export const QueryPricingInfoResponse_PricingInfo = {
  encode(
    message: QueryPricingInfoResponse_PricingInfo,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.auctionExistsForPair === true) {
      writer.uint32(8).bool(message.auctionExistsForPair);
    }
    if (message.flowEndorsementKey1 !== "") {
      writer.uint32(18).string(message.flowEndorsementKey1);
    }
    if (message.flowEndorsementKey2 !== "") {
      writer.uint32(26).string(message.flowEndorsementKey2);
    }
    if (message.ofsAccountExtensions !== "") {
      writer.uint32(34).string(message.ofsAccountExtensions);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPricingInfoResponse_PricingInfo {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPricingInfoResponse_PricingInfo,
    } as QueryPricingInfoResponse_PricingInfo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.auctionExistsForPair = reader.bool();
          break;
        case 2:
          message.flowEndorsementKey1 = reader.string();
          break;
        case 3:
          message.flowEndorsementKey2 = reader.string();
          break;
        case 4:
          message.ofsAccountExtensions = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryPricingInfoResponse_PricingInfo {
    const message = {
      ...baseQueryPricingInfoResponse_PricingInfo,
    } as QueryPricingInfoResponse_PricingInfo;
    if (
      object.auctionExistsForPair !== undefined &&
      object.auctionExistsForPair !== null
    ) {
      message.auctionExistsForPair = Boolean(object.auctionExistsForPair);
    } else {
      message.auctionExistsForPair = false;
    }
    if (
      object.flowEndorsementKey1 !== undefined &&
      object.flowEndorsementKey1 !== null
    ) {
      message.flowEndorsementKey1 = String(object.flowEndorsementKey1);
    } else {
      message.flowEndorsementKey1 = "";
    }
    if (
      object.flowEndorsementKey2 !== undefined &&
      object.flowEndorsementKey2 !== null
    ) {
      message.flowEndorsementKey2 = String(object.flowEndorsementKey2);
    } else {
      message.flowEndorsementKey2 = "";
    }
    if (
      object.ofsAccountExtensions !== undefined &&
      object.ofsAccountExtensions !== null
    ) {
      message.ofsAccountExtensions = String(object.ofsAccountExtensions);
    } else {
      message.ofsAccountExtensions = "";
    }
    return message;
  },

  toJSON(message: QueryPricingInfoResponse_PricingInfo): unknown {
    const obj: any = {};
    message.auctionExistsForPair !== undefined &&
      (obj.auctionExistsForPair = message.auctionExistsForPair);
    message.flowEndorsementKey1 !== undefined &&
      (obj.flowEndorsementKey1 = message.flowEndorsementKey1);
    message.flowEndorsementKey2 !== undefined &&
      (obj.flowEndorsementKey2 = message.flowEndorsementKey2);
    message.ofsAccountExtensions !== undefined &&
      (obj.ofsAccountExtensions = message.ofsAccountExtensions);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPricingInfoResponse_PricingInfo>
  ): QueryPricingInfoResponse_PricingInfo {
    const message = {
      ...baseQueryPricingInfoResponse_PricingInfo,
    } as QueryPricingInfoResponse_PricingInfo;
    if (
      object.auctionExistsForPair !== undefined &&
      object.auctionExistsForPair !== null
    ) {
      message.auctionExistsForPair = object.auctionExistsForPair;
    } else {
      message.auctionExistsForPair = false;
    }
    if (
      object.flowEndorsementKey1 !== undefined &&
      object.flowEndorsementKey1 !== null
    ) {
      message.flowEndorsementKey1 = object.flowEndorsementKey1;
    } else {
      message.flowEndorsementKey1 = "";
    }
    if (
      object.flowEndorsementKey2 !== undefined &&
      object.flowEndorsementKey2 !== null
    ) {
      message.flowEndorsementKey2 = object.flowEndorsementKey2;
    } else {
      message.flowEndorsementKey2 = "";
    }
    if (
      object.ofsAccountExtensions !== undefined &&
      object.ofsAccountExtensions !== null
    ) {
      message.ofsAccountExtensions = object.ofsAccountExtensions;
    } else {
      message.ofsAccountExtensions = "";
    }
    return message;
  },
};

const baseQueryOverlapRequest: object = { ofsPublicKey: "", auctions: "" };

export const QueryOverlapRequest = {
  encode(
    message: QueryOverlapRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.ofsPublicKey !== "") {
      writer.uint32(10).string(message.ofsPublicKey);
    }
    for (const v of message.auctions) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): QueryOverlapRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryOverlapRequest } as QueryOverlapRequest;
    message.auctions = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ofsPublicKey = reader.string();
          break;
        case 2:
          message.auctions.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryOverlapRequest {
    const message = { ...baseQueryOverlapRequest } as QueryOverlapRequest;
    message.auctions = [];
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = String(object.ofsPublicKey);
    } else {
      message.ofsPublicKey = "";
    }
    if (object.auctions !== undefined && object.auctions !== null) {
      for (const e of object.auctions) {
        message.auctions.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: QueryOverlapRequest): unknown {
    const obj: any = {};
    message.ofsPublicKey !== undefined &&
      (obj.ofsPublicKey = message.ofsPublicKey);
    if (message.auctions) {
      obj.auctions = message.auctions.map((e) => e);
    } else {
      obj.auctions = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<QueryOverlapRequest>): QueryOverlapRequest {
    const message = { ...baseQueryOverlapRequest } as QueryOverlapRequest;
    message.auctions = [];
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = object.ofsPublicKey;
    } else {
      message.ofsPublicKey = "";
    }
    if (object.auctions !== undefined && object.auctions !== null) {
      for (const e of object.auctions) {
        message.auctions.push(e);
      }
    }
    return message;
  },
};

const baseQueryOverlapResponse: object = {};

export const QueryOverlapResponse = {
  encode(
    message: QueryOverlapResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.overlapInfos) {
      QueryOverlapResponse_OverlapInfo.encode(
        v!,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): QueryOverlapResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryOverlapResponse } as QueryOverlapResponse;
    message.overlapInfos = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.overlapInfos.push(
            QueryOverlapResponse_OverlapInfo.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryOverlapResponse {
    const message = { ...baseQueryOverlapResponse } as QueryOverlapResponse;
    message.overlapInfos = [];
    if (object.overlapInfos !== undefined && object.overlapInfos !== null) {
      for (const e of object.overlapInfos) {
        message.overlapInfos.push(QueryOverlapResponse_OverlapInfo.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: QueryOverlapResponse): unknown {
    const obj: any = {};
    if (message.overlapInfos) {
      obj.overlapInfos = message.overlapInfos.map((e) =>
        e ? QueryOverlapResponse_OverlapInfo.toJSON(e) : undefined
      );
    } else {
      obj.overlapInfos = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<QueryOverlapResponse>): QueryOverlapResponse {
    const message = { ...baseQueryOverlapResponse } as QueryOverlapResponse;
    message.overlapInfos = [];
    if (object.overlapInfos !== undefined && object.overlapInfos !== null) {
      for (const e of object.overlapInfos) {
        message.overlapInfos.push(
          QueryOverlapResponse_OverlapInfo.fromPartial(e)
        );
      }
    }
    return message;
  },
};

const baseQueryOverlapResponse_OverlapInfo: object = { hasOverlap: false };

export const QueryOverlapResponse_OverlapInfo = {
  encode(
    message: QueryOverlapResponse_OverlapInfo,
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
  ): QueryOverlapResponse_OverlapInfo {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryOverlapResponse_OverlapInfo,
    } as QueryOverlapResponse_OverlapInfo;
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

  fromJSON(object: any): QueryOverlapResponse_OverlapInfo {
    const message = {
      ...baseQueryOverlapResponse_OverlapInfo,
    } as QueryOverlapResponse_OverlapInfo;
    if (object.hasOverlap !== undefined && object.hasOverlap !== null) {
      message.hasOverlap = Boolean(object.hasOverlap);
    } else {
      message.hasOverlap = false;
    }
    return message;
  },

  toJSON(message: QueryOverlapResponse_OverlapInfo): unknown {
    const obj: any = {};
    message.hasOverlap !== undefined && (obj.hasOverlap = message.hasOverlap);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryOverlapResponse_OverlapInfo>
  ): QueryOverlapResponse_OverlapInfo {
    const message = {
      ...baseQueryOverlapResponse_OverlapInfo,
    } as QueryOverlapResponse_OverlapInfo;
    if (object.hasOverlap !== undefined && object.hasOverlap !== null) {
      message.hasOverlap = object.hasOverlap;
    } else {
      message.hasOverlap = false;
    }
    return message;
  },
};

const baseQueryGetEncodedExpiringAuctionsRequest: object = {};

export const QueryGetEncodedExpiringAuctionsRequest = {
  encode(
    _: QueryGetEncodedExpiringAuctionsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetEncodedExpiringAuctionsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetEncodedExpiringAuctionsRequest,
    } as QueryGetEncodedExpiringAuctionsRequest;
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

  fromJSON(_: any): QueryGetEncodedExpiringAuctionsRequest {
    const message = {
      ...baseQueryGetEncodedExpiringAuctionsRequest,
    } as QueryGetEncodedExpiringAuctionsRequest;
    return message;
  },

  toJSON(_: QueryGetEncodedExpiringAuctionsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<QueryGetEncodedExpiringAuctionsRequest>
  ): QueryGetEncodedExpiringAuctionsRequest {
    const message = {
      ...baseQueryGetEncodedExpiringAuctionsRequest,
    } as QueryGetEncodedExpiringAuctionsRequest;
    return message;
  },
};

const baseQueryGetEncodedExpiringAuctionsResponse: object = {};

export const QueryGetEncodedExpiringAuctionsResponse = {
  encode(
    message: QueryGetEncodedExpiringAuctionsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.EncodedExpiringAuctions !== undefined) {
      EncodedExpiringAuctions.encode(
        message.EncodedExpiringAuctions,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetEncodedExpiringAuctionsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetEncodedExpiringAuctionsResponse,
    } as QueryGetEncodedExpiringAuctionsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.EncodedExpiringAuctions = EncodedExpiringAuctions.decode(
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

  fromJSON(object: any): QueryGetEncodedExpiringAuctionsResponse {
    const message = {
      ...baseQueryGetEncodedExpiringAuctionsResponse,
    } as QueryGetEncodedExpiringAuctionsResponse;
    if (
      object.EncodedExpiringAuctions !== undefined &&
      object.EncodedExpiringAuctions !== null
    ) {
      message.EncodedExpiringAuctions = EncodedExpiringAuctions.fromJSON(
        object.EncodedExpiringAuctions
      );
    } else {
      message.EncodedExpiringAuctions = undefined;
    }
    return message;
  },

  toJSON(message: QueryGetEncodedExpiringAuctionsResponse): unknown {
    const obj: any = {};
    message.EncodedExpiringAuctions !== undefined &&
      (obj.EncodedExpiringAuctions = message.EncodedExpiringAuctions
        ? EncodedExpiringAuctions.toJSON(message.EncodedExpiringAuctions)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetEncodedExpiringAuctionsResponse>
  ): QueryGetEncodedExpiringAuctionsResponse {
    const message = {
      ...baseQueryGetEncodedExpiringAuctionsResponse,
    } as QueryGetEncodedExpiringAuctionsResponse;
    if (
      object.EncodedExpiringAuctions !== undefined &&
      object.EncodedExpiringAuctions !== null
    ) {
      message.EncodedExpiringAuctions = EncodedExpiringAuctions.fromPartial(
        object.EncodedExpiringAuctions
      );
    } else {
      message.EncodedExpiringAuctions = undefined;
    }
    return message;
  },
};

const baseQueryGetEndorsementsRequest: object = { ofsPublicKey: "" };

export const QueryGetEndorsementsRequest = {
  encode(
    message: QueryGetEndorsementsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.ofsPublicKey !== "") {
      writer.uint32(10).string(message.ofsPublicKey);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetEndorsementsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetEndorsementsRequest,
    } as QueryGetEndorsementsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ofsPublicKey = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetEndorsementsRequest {
    const message = {
      ...baseQueryGetEndorsementsRequest,
    } as QueryGetEndorsementsRequest;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = String(object.ofsPublicKey);
    } else {
      message.ofsPublicKey = "";
    }
    return message;
  },

  toJSON(message: QueryGetEndorsementsRequest): unknown {
    const obj: any = {};
    message.ofsPublicKey !== undefined &&
      (obj.ofsPublicKey = message.ofsPublicKey);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetEndorsementsRequest>
  ): QueryGetEndorsementsRequest {
    const message = {
      ...baseQueryGetEndorsementsRequest,
    } as QueryGetEndorsementsRequest;
    if (object.ofsPublicKey !== undefined && object.ofsPublicKey !== null) {
      message.ofsPublicKey = object.ofsPublicKey;
    } else {
      message.ofsPublicKey = "";
    }
    return message;
  },
};

const baseQueryGetEndorsementsResponse: object = {};

export const QueryGetEndorsementsResponse = {
  encode(
    message: QueryGetEndorsementsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.endorsements !== undefined) {
      Endorsements.encode(
        message.endorsements,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetEndorsementsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetEndorsementsResponse,
    } as QueryGetEndorsementsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.endorsements = Endorsements.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetEndorsementsResponse {
    const message = {
      ...baseQueryGetEndorsementsResponse,
    } as QueryGetEndorsementsResponse;
    if (object.endorsements !== undefined && object.endorsements !== null) {
      message.endorsements = Endorsements.fromJSON(object.endorsements);
    } else {
      message.endorsements = undefined;
    }
    return message;
  },

  toJSON(message: QueryGetEndorsementsResponse): unknown {
    const obj: any = {};
    message.endorsements !== undefined &&
      (obj.endorsements = message.endorsements
        ? Endorsements.toJSON(message.endorsements)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetEndorsementsResponse>
  ): QueryGetEndorsementsResponse {
    const message = {
      ...baseQueryGetEndorsementsResponse,
    } as QueryGetEndorsementsResponse;
    if (object.endorsements !== undefined && object.endorsements !== null) {
      message.endorsements = Endorsements.fromPartial(object.endorsements);
    } else {
      message.endorsements = undefined;
    }
    return message;
  },
};

const baseQueryAllEndorsementsRequest: object = {};

export const QueryAllEndorsementsRequest = {
  encode(
    message: QueryAllEndorsementsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryAllEndorsementsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllEndorsementsRequest,
    } as QueryAllEndorsementsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllEndorsementsRequest {
    const message = {
      ...baseQueryAllEndorsementsRequest,
    } as QueryAllEndorsementsRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllEndorsementsRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllEndorsementsRequest>
  ): QueryAllEndorsementsRequest {
    const message = {
      ...baseQueryAllEndorsementsRequest,
    } as QueryAllEndorsementsRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryAllEndorsementsResponse: object = {};

export const QueryAllEndorsementsResponse = {
  encode(
    message: QueryAllEndorsementsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.endorsements) {
      Endorsements.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryAllEndorsementsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllEndorsementsResponse,
    } as QueryAllEndorsementsResponse;
    message.endorsements = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.endorsements.push(
            Endorsements.decode(reader, reader.uint32())
          );
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllEndorsementsResponse {
    const message = {
      ...baseQueryAllEndorsementsResponse,
    } as QueryAllEndorsementsResponse;
    message.endorsements = [];
    if (object.endorsements !== undefined && object.endorsements !== null) {
      for (const e of object.endorsements) {
        message.endorsements.push(Endorsements.fromJSON(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllEndorsementsResponse): unknown {
    const obj: any = {};
    if (message.endorsements) {
      obj.endorsements = message.endorsements.map((e) =>
        e ? Endorsements.toJSON(e) : undefined
      );
    } else {
      obj.endorsements = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllEndorsementsResponse>
  ): QueryAllEndorsementsResponse {
    const message = {
      ...baseQueryAllEndorsementsResponse,
    } as QueryAllEndorsementsResponse;
    message.endorsements = [];
    if (object.endorsements !== undefined && object.endorsements !== null) {
      for (const e of object.endorsements) {
        message.endorsements.push(Endorsements.fromPartial(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Parameters queries the parameters of the module. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  /** Queries a GlobalAuctionState by index. */
  GlobalAuctionState(
    request: QueryGetGlobalAuctionStateRequest
  ): Promise<QueryGetGlobalAuctionStateResponse>;
  /** Queries a OrderFlowAuction by index. */
  OrderFlowAuction(
    request: QueryGetOrderFlowAuctionRequest
  ): Promise<QueryGetOrderFlowAuctionResponse>;
  /** Queries a list of OrderFlowAuction items. */
  OrderFlowAuctionAll(
    request: QueryAllOrderFlowAuctionRequest
  ): Promise<QueryAllOrderFlowAuctionResponse>;
  /** Queries a list of OrderFlowAuction items. */
  OrderFlowAuctions(
    request: QueryOrderFlowAuctionsRequest
  ): Promise<QueryOrderFlowAuctionsResponse>;
  /** Queries a list of auctions. */
  Grid(request: QueryGridRequest): Promise<QueryGridResponse>;
  /** Query pricing info for the order flow source. */
  PricingInfo(
    request: QueryPricingInfoRequest
  ): Promise<QueryPricingInfoResponse>;
  /** Checks a list of nonexistent auctions for overlap with each other and an order flow source's existing auctions. */
  Overlap(request: QueryOverlapRequest): Promise<QueryOverlapResponse>;
  /** Queries a EncodedExpiringAuctions by index. */
  EncodedExpiringAuctions(
    request: QueryGetEncodedExpiringAuctionsRequest
  ): Promise<QueryGetEncodedExpiringAuctionsResponse>;
  /** Queries a Endorsements by index. */
  Endorsements(
    request: QueryGetEndorsementsRequest
  ): Promise<QueryGetEndorsementsResponse>;
  /** Queries a list of Endorsements items. */
  EndorsementsAll(
    request: QueryAllEndorsementsRequest
  ): Promise<QueryAllEndorsementsResponse>;
  /** Queries a list of GridRows items. */
  GridRows(request: QueryGridRowsRequest): Promise<QueryGridRowsResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("dflow.auction.Query", "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(new Reader(data)));
  }

  GlobalAuctionState(
    request: QueryGetGlobalAuctionStateRequest
  ): Promise<QueryGetGlobalAuctionStateResponse> {
    const data = QueryGetGlobalAuctionStateRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.auction.Query",
      "GlobalAuctionState",
      data
    );
    return promise.then((data) =>
      QueryGetGlobalAuctionStateResponse.decode(new Reader(data))
    );
  }

  OrderFlowAuction(
    request: QueryGetOrderFlowAuctionRequest
  ): Promise<QueryGetOrderFlowAuctionResponse> {
    const data = QueryGetOrderFlowAuctionRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.auction.Query",
      "OrderFlowAuction",
      data
    );
    return promise.then((data) =>
      QueryGetOrderFlowAuctionResponse.decode(new Reader(data))
    );
  }

  OrderFlowAuctionAll(
    request: QueryAllOrderFlowAuctionRequest
  ): Promise<QueryAllOrderFlowAuctionResponse> {
    const data = QueryAllOrderFlowAuctionRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.auction.Query",
      "OrderFlowAuctionAll",
      data
    );
    return promise.then((data) =>
      QueryAllOrderFlowAuctionResponse.decode(new Reader(data))
    );
  }

  OrderFlowAuctions(
    request: QueryOrderFlowAuctionsRequest
  ): Promise<QueryOrderFlowAuctionsResponse> {
    const data = QueryOrderFlowAuctionsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.auction.Query",
      "OrderFlowAuctions",
      data
    );
    return promise.then((data) =>
      QueryOrderFlowAuctionsResponse.decode(new Reader(data))
    );
  }

  Grid(request: QueryGridRequest): Promise<QueryGridResponse> {
    const data = QueryGridRequest.encode(request).finish();
    const promise = this.rpc.request("dflow.auction.Query", "Grid", data);
    return promise.then((data) => QueryGridResponse.decode(new Reader(data)));
  }

  PricingInfo(
    request: QueryPricingInfoRequest
  ): Promise<QueryPricingInfoResponse> {
    const data = QueryPricingInfoRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.auction.Query",
      "PricingInfo",
      data
    );
    return promise.then((data) =>
      QueryPricingInfoResponse.decode(new Reader(data))
    );
  }

  Overlap(request: QueryOverlapRequest): Promise<QueryOverlapResponse> {
    const data = QueryOverlapRequest.encode(request).finish();
    const promise = this.rpc.request("dflow.auction.Query", "Overlap", data);
    return promise.then((data) =>
      QueryOverlapResponse.decode(new Reader(data))
    );
  }

  EncodedExpiringAuctions(
    request: QueryGetEncodedExpiringAuctionsRequest
  ): Promise<QueryGetEncodedExpiringAuctionsResponse> {
    const data = QueryGetEncodedExpiringAuctionsRequest.encode(
      request
    ).finish();
    const promise = this.rpc.request(
      "dflow.auction.Query",
      "EncodedExpiringAuctions",
      data
    );
    return promise.then((data) =>
      QueryGetEncodedExpiringAuctionsResponse.decode(new Reader(data))
    );
  }

  Endorsements(
    request: QueryGetEndorsementsRequest
  ): Promise<QueryGetEndorsementsResponse> {
    const data = QueryGetEndorsementsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.auction.Query",
      "Endorsements",
      data
    );
    return promise.then((data) =>
      QueryGetEndorsementsResponse.decode(new Reader(data))
    );
  }

  EndorsementsAll(
    request: QueryAllEndorsementsRequest
  ): Promise<QueryAllEndorsementsResponse> {
    const data = QueryAllEndorsementsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.auction.Query",
      "EndorsementsAll",
      data
    );
    return promise.then((data) =>
      QueryAllEndorsementsResponse.decode(new Reader(data))
    );
  }

  GridRows(request: QueryGridRowsRequest): Promise<QueryGridRowsResponse> {
    const data = QueryGridRowsRequest.encode(request).finish();
    const promise = this.rpc.request("dflow.auction.Query", "GridRows", data);
    return promise.then((data) =>
      QueryGridRowsResponse.decode(new Reader(data))
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
