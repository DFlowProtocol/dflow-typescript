/* eslint-disable */
import { Reader, util, configure, Writer } from "protobufjs/minimal";
import * as Long from "long";
import { Params } from "../bridge/params";
import { NoncedProposedTransfers } from "../bridge/nonced_proposed_transfers";
import {
  PageRequest,
  PageResponse,
} from "../cosmos/base/query/v1beta1/pagination";
import { WithdrawTxMap } from "../bridge/withdraw_tx_map";
import { PendingWithdrawal } from "../bridge/pending_withdrawal";

export const protobufPackage = "dflow.bridge";

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {}

/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params: Params | undefined;
}

export interface QueryGetNoncedProposedTransfersRequest {
  nonce: number;
}

export interface QueryGetNoncedProposedTransfersResponse {
  noncedProposedTransfers: NoncedProposedTransfers | undefined;
}

export interface QueryAllNoncedProposedTransfersRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllNoncedProposedTransfersResponse {
  noncedProposedTransfers: NoncedProposedTransfers[];
  pagination: PageResponse | undefined;
}

export interface QueryGetWithdrawTxMapRequest {
  withdrawId: number;
}

export interface QueryGetWithdrawTxMapResponse {
  withdrawTxMap: WithdrawTxMap | undefined;
}

export interface QueryAllWithdrawTxMapRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllWithdrawTxMapResponse {
  withdrawTxMap: WithdrawTxMap[];
  pagination: PageResponse | undefined;
}

export interface QueryWithdrawTxMapsByAccountRequest {
  /** The bech32 public key associated with the withdrawer of funds */
  src: string;
}

export interface QueryWithdrawTxMapsByAccountResponse {
  withdrawTxMaps: WithdrawTxMap[];
}

export interface QueryPendingWithdrawalsRequest {
  /**
   * The bech32 public key associated with the withdrawer of funds or "" to request all pending
   * withdrawals
   */
  src: string;
}

export interface QueryPendingWithdrawalsResponse {
  withdrawTxMaps: WithdrawTxMap[];
}

export interface QueryGetPendingWithdrawalRequest {
  withdrawId: number;
}

export interface QueryGetPendingWithdrawalResponse {
  pendingWithdrawal: PendingWithdrawal | undefined;
}

export interface QueryAllPendingWithdrawalRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllPendingWithdrawalResponse {
  pendingWithdrawal: PendingWithdrawal[];
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

const baseQueryGetNoncedProposedTransfersRequest: object = { nonce: 0 };

export const QueryGetNoncedProposedTransfersRequest = {
  encode(
    message: QueryGetNoncedProposedTransfersRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.nonce !== 0) {
      writer.uint32(8).uint64(message.nonce);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetNoncedProposedTransfersRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetNoncedProposedTransfersRequest,
    } as QueryGetNoncedProposedTransfersRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nonce = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetNoncedProposedTransfersRequest {
    const message = {
      ...baseQueryGetNoncedProposedTransfersRequest,
    } as QueryGetNoncedProposedTransfersRequest;
    if (object.nonce !== undefined && object.nonce !== null) {
      message.nonce = Number(object.nonce);
    } else {
      message.nonce = 0;
    }
    return message;
  },

  toJSON(message: QueryGetNoncedProposedTransfersRequest): unknown {
    const obj: any = {};
    message.nonce !== undefined && (obj.nonce = message.nonce);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetNoncedProposedTransfersRequest>
  ): QueryGetNoncedProposedTransfersRequest {
    const message = {
      ...baseQueryGetNoncedProposedTransfersRequest,
    } as QueryGetNoncedProposedTransfersRequest;
    if (object.nonce !== undefined && object.nonce !== null) {
      message.nonce = object.nonce;
    } else {
      message.nonce = 0;
    }
    return message;
  },
};

const baseQueryGetNoncedProposedTransfersResponse: object = {};

export const QueryGetNoncedProposedTransfersResponse = {
  encode(
    message: QueryGetNoncedProposedTransfersResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.noncedProposedTransfers !== undefined) {
      NoncedProposedTransfers.encode(
        message.noncedProposedTransfers,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetNoncedProposedTransfersResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetNoncedProposedTransfersResponse,
    } as QueryGetNoncedProposedTransfersResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.noncedProposedTransfers = NoncedProposedTransfers.decode(
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

  fromJSON(object: any): QueryGetNoncedProposedTransfersResponse {
    const message = {
      ...baseQueryGetNoncedProposedTransfersResponse,
    } as QueryGetNoncedProposedTransfersResponse;
    if (
      object.noncedProposedTransfers !== undefined &&
      object.noncedProposedTransfers !== null
    ) {
      message.noncedProposedTransfers = NoncedProposedTransfers.fromJSON(
        object.noncedProposedTransfers
      );
    } else {
      message.noncedProposedTransfers = undefined;
    }
    return message;
  },

  toJSON(message: QueryGetNoncedProposedTransfersResponse): unknown {
    const obj: any = {};
    message.noncedProposedTransfers !== undefined &&
      (obj.noncedProposedTransfers = message.noncedProposedTransfers
        ? NoncedProposedTransfers.toJSON(message.noncedProposedTransfers)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetNoncedProposedTransfersResponse>
  ): QueryGetNoncedProposedTransfersResponse {
    const message = {
      ...baseQueryGetNoncedProposedTransfersResponse,
    } as QueryGetNoncedProposedTransfersResponse;
    if (
      object.noncedProposedTransfers !== undefined &&
      object.noncedProposedTransfers !== null
    ) {
      message.noncedProposedTransfers = NoncedProposedTransfers.fromPartial(
        object.noncedProposedTransfers
      );
    } else {
      message.noncedProposedTransfers = undefined;
    }
    return message;
  },
};

const baseQueryAllNoncedProposedTransfersRequest: object = {};

export const QueryAllNoncedProposedTransfersRequest = {
  encode(
    message: QueryAllNoncedProposedTransfersRequest,
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
  ): QueryAllNoncedProposedTransfersRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllNoncedProposedTransfersRequest,
    } as QueryAllNoncedProposedTransfersRequest;
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

  fromJSON(object: any): QueryAllNoncedProposedTransfersRequest {
    const message = {
      ...baseQueryAllNoncedProposedTransfersRequest,
    } as QueryAllNoncedProposedTransfersRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllNoncedProposedTransfersRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllNoncedProposedTransfersRequest>
  ): QueryAllNoncedProposedTransfersRequest {
    const message = {
      ...baseQueryAllNoncedProposedTransfersRequest,
    } as QueryAllNoncedProposedTransfersRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryAllNoncedProposedTransfersResponse: object = {};

export const QueryAllNoncedProposedTransfersResponse = {
  encode(
    message: QueryAllNoncedProposedTransfersResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.noncedProposedTransfers) {
      NoncedProposedTransfers.encode(v!, writer.uint32(10).fork()).ldelim();
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
  ): QueryAllNoncedProposedTransfersResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllNoncedProposedTransfersResponse,
    } as QueryAllNoncedProposedTransfersResponse;
    message.noncedProposedTransfers = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.noncedProposedTransfers.push(
            NoncedProposedTransfers.decode(reader, reader.uint32())
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

  fromJSON(object: any): QueryAllNoncedProposedTransfersResponse {
    const message = {
      ...baseQueryAllNoncedProposedTransfersResponse,
    } as QueryAllNoncedProposedTransfersResponse;
    message.noncedProposedTransfers = [];
    if (
      object.noncedProposedTransfers !== undefined &&
      object.noncedProposedTransfers !== null
    ) {
      for (const e of object.noncedProposedTransfers) {
        message.noncedProposedTransfers.push(
          NoncedProposedTransfers.fromJSON(e)
        );
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllNoncedProposedTransfersResponse): unknown {
    const obj: any = {};
    if (message.noncedProposedTransfers) {
      obj.noncedProposedTransfers = message.noncedProposedTransfers.map((e) =>
        e ? NoncedProposedTransfers.toJSON(e) : undefined
      );
    } else {
      obj.noncedProposedTransfers = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllNoncedProposedTransfersResponse>
  ): QueryAllNoncedProposedTransfersResponse {
    const message = {
      ...baseQueryAllNoncedProposedTransfersResponse,
    } as QueryAllNoncedProposedTransfersResponse;
    message.noncedProposedTransfers = [];
    if (
      object.noncedProposedTransfers !== undefined &&
      object.noncedProposedTransfers !== null
    ) {
      for (const e of object.noncedProposedTransfers) {
        message.noncedProposedTransfers.push(
          NoncedProposedTransfers.fromPartial(e)
        );
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

const baseQueryGetWithdrawTxMapRequest: object = { withdrawId: 0 };

export const QueryGetWithdrawTxMapRequest = {
  encode(
    message: QueryGetWithdrawTxMapRequest,
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
  ): QueryGetWithdrawTxMapRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetWithdrawTxMapRequest,
    } as QueryGetWithdrawTxMapRequest;
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

  fromJSON(object: any): QueryGetWithdrawTxMapRequest {
    const message = {
      ...baseQueryGetWithdrawTxMapRequest,
    } as QueryGetWithdrawTxMapRequest;
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = Number(object.withdrawId);
    } else {
      message.withdrawId = 0;
    }
    return message;
  },

  toJSON(message: QueryGetWithdrawTxMapRequest): unknown {
    const obj: any = {};
    message.withdrawId !== undefined && (obj.withdrawId = message.withdrawId);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetWithdrawTxMapRequest>
  ): QueryGetWithdrawTxMapRequest {
    const message = {
      ...baseQueryGetWithdrawTxMapRequest,
    } as QueryGetWithdrawTxMapRequest;
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = object.withdrawId;
    } else {
      message.withdrawId = 0;
    }
    return message;
  },
};

const baseQueryGetWithdrawTxMapResponse: object = {};

export const QueryGetWithdrawTxMapResponse = {
  encode(
    message: QueryGetWithdrawTxMapResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.withdrawTxMap !== undefined) {
      WithdrawTxMap.encode(
        message.withdrawTxMap,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetWithdrawTxMapResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetWithdrawTxMapResponse,
    } as QueryGetWithdrawTxMapResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdrawTxMap = WithdrawTxMap.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetWithdrawTxMapResponse {
    const message = {
      ...baseQueryGetWithdrawTxMapResponse,
    } as QueryGetWithdrawTxMapResponse;
    if (object.withdrawTxMap !== undefined && object.withdrawTxMap !== null) {
      message.withdrawTxMap = WithdrawTxMap.fromJSON(object.withdrawTxMap);
    } else {
      message.withdrawTxMap = undefined;
    }
    return message;
  },

  toJSON(message: QueryGetWithdrawTxMapResponse): unknown {
    const obj: any = {};
    message.withdrawTxMap !== undefined &&
      (obj.withdrawTxMap = message.withdrawTxMap
        ? WithdrawTxMap.toJSON(message.withdrawTxMap)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetWithdrawTxMapResponse>
  ): QueryGetWithdrawTxMapResponse {
    const message = {
      ...baseQueryGetWithdrawTxMapResponse,
    } as QueryGetWithdrawTxMapResponse;
    if (object.withdrawTxMap !== undefined && object.withdrawTxMap !== null) {
      message.withdrawTxMap = WithdrawTxMap.fromPartial(object.withdrawTxMap);
    } else {
      message.withdrawTxMap = undefined;
    }
    return message;
  },
};

const baseQueryAllWithdrawTxMapRequest: object = {};

export const QueryAllWithdrawTxMapRequest = {
  encode(
    message: QueryAllWithdrawTxMapRequest,
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
  ): QueryAllWithdrawTxMapRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllWithdrawTxMapRequest,
    } as QueryAllWithdrawTxMapRequest;
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

  fromJSON(object: any): QueryAllWithdrawTxMapRequest {
    const message = {
      ...baseQueryAllWithdrawTxMapRequest,
    } as QueryAllWithdrawTxMapRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllWithdrawTxMapRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllWithdrawTxMapRequest>
  ): QueryAllWithdrawTxMapRequest {
    const message = {
      ...baseQueryAllWithdrawTxMapRequest,
    } as QueryAllWithdrawTxMapRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryAllWithdrawTxMapResponse: object = {};

export const QueryAllWithdrawTxMapResponse = {
  encode(
    message: QueryAllWithdrawTxMapResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.withdrawTxMap) {
      WithdrawTxMap.encode(v!, writer.uint32(10).fork()).ldelim();
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
  ): QueryAllWithdrawTxMapResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllWithdrawTxMapResponse,
    } as QueryAllWithdrawTxMapResponse;
    message.withdrawTxMap = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdrawTxMap.push(
            WithdrawTxMap.decode(reader, reader.uint32())
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

  fromJSON(object: any): QueryAllWithdrawTxMapResponse {
    const message = {
      ...baseQueryAllWithdrawTxMapResponse,
    } as QueryAllWithdrawTxMapResponse;
    message.withdrawTxMap = [];
    if (object.withdrawTxMap !== undefined && object.withdrawTxMap !== null) {
      for (const e of object.withdrawTxMap) {
        message.withdrawTxMap.push(WithdrawTxMap.fromJSON(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllWithdrawTxMapResponse): unknown {
    const obj: any = {};
    if (message.withdrawTxMap) {
      obj.withdrawTxMap = message.withdrawTxMap.map((e) =>
        e ? WithdrawTxMap.toJSON(e) : undefined
      );
    } else {
      obj.withdrawTxMap = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllWithdrawTxMapResponse>
  ): QueryAllWithdrawTxMapResponse {
    const message = {
      ...baseQueryAllWithdrawTxMapResponse,
    } as QueryAllWithdrawTxMapResponse;
    message.withdrawTxMap = [];
    if (object.withdrawTxMap !== undefined && object.withdrawTxMap !== null) {
      for (const e of object.withdrawTxMap) {
        message.withdrawTxMap.push(WithdrawTxMap.fromPartial(e));
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

const baseQueryWithdrawTxMapsByAccountRequest: object = { src: "" };

export const QueryWithdrawTxMapsByAccountRequest = {
  encode(
    message: QueryWithdrawTxMapsByAccountRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.src !== "") {
      writer.uint32(10).string(message.src);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryWithdrawTxMapsByAccountRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryWithdrawTxMapsByAccountRequest,
    } as QueryWithdrawTxMapsByAccountRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.src = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryWithdrawTxMapsByAccountRequest {
    const message = {
      ...baseQueryWithdrawTxMapsByAccountRequest,
    } as QueryWithdrawTxMapsByAccountRequest;
    if (object.src !== undefined && object.src !== null) {
      message.src = String(object.src);
    } else {
      message.src = "";
    }
    return message;
  },

  toJSON(message: QueryWithdrawTxMapsByAccountRequest): unknown {
    const obj: any = {};
    message.src !== undefined && (obj.src = message.src);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryWithdrawTxMapsByAccountRequest>
  ): QueryWithdrawTxMapsByAccountRequest {
    const message = {
      ...baseQueryWithdrawTxMapsByAccountRequest,
    } as QueryWithdrawTxMapsByAccountRequest;
    if (object.src !== undefined && object.src !== null) {
      message.src = object.src;
    } else {
      message.src = "";
    }
    return message;
  },
};

const baseQueryWithdrawTxMapsByAccountResponse: object = {};

export const QueryWithdrawTxMapsByAccountResponse = {
  encode(
    message: QueryWithdrawTxMapsByAccountResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.withdrawTxMaps) {
      WithdrawTxMap.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryWithdrawTxMapsByAccountResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryWithdrawTxMapsByAccountResponse,
    } as QueryWithdrawTxMapsByAccountResponse;
    message.withdrawTxMaps = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdrawTxMaps.push(
            WithdrawTxMap.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryWithdrawTxMapsByAccountResponse {
    const message = {
      ...baseQueryWithdrawTxMapsByAccountResponse,
    } as QueryWithdrawTxMapsByAccountResponse;
    message.withdrawTxMaps = [];
    if (object.withdrawTxMaps !== undefined && object.withdrawTxMaps !== null) {
      for (const e of object.withdrawTxMaps) {
        message.withdrawTxMaps.push(WithdrawTxMap.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: QueryWithdrawTxMapsByAccountResponse): unknown {
    const obj: any = {};
    if (message.withdrawTxMaps) {
      obj.withdrawTxMaps = message.withdrawTxMaps.map((e) =>
        e ? WithdrawTxMap.toJSON(e) : undefined
      );
    } else {
      obj.withdrawTxMaps = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryWithdrawTxMapsByAccountResponse>
  ): QueryWithdrawTxMapsByAccountResponse {
    const message = {
      ...baseQueryWithdrawTxMapsByAccountResponse,
    } as QueryWithdrawTxMapsByAccountResponse;
    message.withdrawTxMaps = [];
    if (object.withdrawTxMaps !== undefined && object.withdrawTxMaps !== null) {
      for (const e of object.withdrawTxMaps) {
        message.withdrawTxMaps.push(WithdrawTxMap.fromPartial(e));
      }
    }
    return message;
  },
};

const baseQueryPendingWithdrawalsRequest: object = { src: "" };

export const QueryPendingWithdrawalsRequest = {
  encode(
    message: QueryPendingWithdrawalsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.src !== "") {
      writer.uint32(10).string(message.src);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPendingWithdrawalsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPendingWithdrawalsRequest,
    } as QueryPendingWithdrawalsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.src = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryPendingWithdrawalsRequest {
    const message = {
      ...baseQueryPendingWithdrawalsRequest,
    } as QueryPendingWithdrawalsRequest;
    if (object.src !== undefined && object.src !== null) {
      message.src = String(object.src);
    } else {
      message.src = "";
    }
    return message;
  },

  toJSON(message: QueryPendingWithdrawalsRequest): unknown {
    const obj: any = {};
    message.src !== undefined && (obj.src = message.src);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPendingWithdrawalsRequest>
  ): QueryPendingWithdrawalsRequest {
    const message = {
      ...baseQueryPendingWithdrawalsRequest,
    } as QueryPendingWithdrawalsRequest;
    if (object.src !== undefined && object.src !== null) {
      message.src = object.src;
    } else {
      message.src = "";
    }
    return message;
  },
};

const baseQueryPendingWithdrawalsResponse: object = {};

export const QueryPendingWithdrawalsResponse = {
  encode(
    message: QueryPendingWithdrawalsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.withdrawTxMaps) {
      WithdrawTxMap.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPendingWithdrawalsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPendingWithdrawalsResponse,
    } as QueryPendingWithdrawalsResponse;
    message.withdrawTxMaps = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdrawTxMaps.push(
            WithdrawTxMap.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryPendingWithdrawalsResponse {
    const message = {
      ...baseQueryPendingWithdrawalsResponse,
    } as QueryPendingWithdrawalsResponse;
    message.withdrawTxMaps = [];
    if (object.withdrawTxMaps !== undefined && object.withdrawTxMaps !== null) {
      for (const e of object.withdrawTxMaps) {
        message.withdrawTxMaps.push(WithdrawTxMap.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: QueryPendingWithdrawalsResponse): unknown {
    const obj: any = {};
    if (message.withdrawTxMaps) {
      obj.withdrawTxMaps = message.withdrawTxMaps.map((e) =>
        e ? WithdrawTxMap.toJSON(e) : undefined
      );
    } else {
      obj.withdrawTxMaps = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPendingWithdrawalsResponse>
  ): QueryPendingWithdrawalsResponse {
    const message = {
      ...baseQueryPendingWithdrawalsResponse,
    } as QueryPendingWithdrawalsResponse;
    message.withdrawTxMaps = [];
    if (object.withdrawTxMaps !== undefined && object.withdrawTxMaps !== null) {
      for (const e of object.withdrawTxMaps) {
        message.withdrawTxMaps.push(WithdrawTxMap.fromPartial(e));
      }
    }
    return message;
  },
};

const baseQueryGetPendingWithdrawalRequest: object = { withdrawId: 0 };

export const QueryGetPendingWithdrawalRequest = {
  encode(
    message: QueryGetPendingWithdrawalRequest,
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
  ): QueryGetPendingWithdrawalRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetPendingWithdrawalRequest,
    } as QueryGetPendingWithdrawalRequest;
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

  fromJSON(object: any): QueryGetPendingWithdrawalRequest {
    const message = {
      ...baseQueryGetPendingWithdrawalRequest,
    } as QueryGetPendingWithdrawalRequest;
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = Number(object.withdrawId);
    } else {
      message.withdrawId = 0;
    }
    return message;
  },

  toJSON(message: QueryGetPendingWithdrawalRequest): unknown {
    const obj: any = {};
    message.withdrawId !== undefined && (obj.withdrawId = message.withdrawId);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetPendingWithdrawalRequest>
  ): QueryGetPendingWithdrawalRequest {
    const message = {
      ...baseQueryGetPendingWithdrawalRequest,
    } as QueryGetPendingWithdrawalRequest;
    if (object.withdrawId !== undefined && object.withdrawId !== null) {
      message.withdrawId = object.withdrawId;
    } else {
      message.withdrawId = 0;
    }
    return message;
  },
};

const baseQueryGetPendingWithdrawalResponse: object = {};

export const QueryGetPendingWithdrawalResponse = {
  encode(
    message: QueryGetPendingWithdrawalResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.pendingWithdrawal !== undefined) {
      PendingWithdrawal.encode(
        message.pendingWithdrawal,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetPendingWithdrawalResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetPendingWithdrawalResponse,
    } as QueryGetPendingWithdrawalResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pendingWithdrawal = PendingWithdrawal.decode(
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

  fromJSON(object: any): QueryGetPendingWithdrawalResponse {
    const message = {
      ...baseQueryGetPendingWithdrawalResponse,
    } as QueryGetPendingWithdrawalResponse;
    if (
      object.pendingWithdrawal !== undefined &&
      object.pendingWithdrawal !== null
    ) {
      message.pendingWithdrawal = PendingWithdrawal.fromJSON(
        object.pendingWithdrawal
      );
    } else {
      message.pendingWithdrawal = undefined;
    }
    return message;
  },

  toJSON(message: QueryGetPendingWithdrawalResponse): unknown {
    const obj: any = {};
    message.pendingWithdrawal !== undefined &&
      (obj.pendingWithdrawal = message.pendingWithdrawal
        ? PendingWithdrawal.toJSON(message.pendingWithdrawal)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetPendingWithdrawalResponse>
  ): QueryGetPendingWithdrawalResponse {
    const message = {
      ...baseQueryGetPendingWithdrawalResponse,
    } as QueryGetPendingWithdrawalResponse;
    if (
      object.pendingWithdrawal !== undefined &&
      object.pendingWithdrawal !== null
    ) {
      message.pendingWithdrawal = PendingWithdrawal.fromPartial(
        object.pendingWithdrawal
      );
    } else {
      message.pendingWithdrawal = undefined;
    }
    return message;
  },
};

const baseQueryAllPendingWithdrawalRequest: object = {};

export const QueryAllPendingWithdrawalRequest = {
  encode(
    message: QueryAllPendingWithdrawalRequest,
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
  ): QueryAllPendingWithdrawalRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllPendingWithdrawalRequest,
    } as QueryAllPendingWithdrawalRequest;
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

  fromJSON(object: any): QueryAllPendingWithdrawalRequest {
    const message = {
      ...baseQueryAllPendingWithdrawalRequest,
    } as QueryAllPendingWithdrawalRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllPendingWithdrawalRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllPendingWithdrawalRequest>
  ): QueryAllPendingWithdrawalRequest {
    const message = {
      ...baseQueryAllPendingWithdrawalRequest,
    } as QueryAllPendingWithdrawalRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryAllPendingWithdrawalResponse: object = {};

export const QueryAllPendingWithdrawalResponse = {
  encode(
    message: QueryAllPendingWithdrawalResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.pendingWithdrawal) {
      PendingWithdrawal.encode(v!, writer.uint32(10).fork()).ldelim();
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
  ): QueryAllPendingWithdrawalResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllPendingWithdrawalResponse,
    } as QueryAllPendingWithdrawalResponse;
    message.pendingWithdrawal = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pendingWithdrawal.push(
            PendingWithdrawal.decode(reader, reader.uint32())
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

  fromJSON(object: any): QueryAllPendingWithdrawalResponse {
    const message = {
      ...baseQueryAllPendingWithdrawalResponse,
    } as QueryAllPendingWithdrawalResponse;
    message.pendingWithdrawal = [];
    if (
      object.pendingWithdrawal !== undefined &&
      object.pendingWithdrawal !== null
    ) {
      for (const e of object.pendingWithdrawal) {
        message.pendingWithdrawal.push(PendingWithdrawal.fromJSON(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllPendingWithdrawalResponse): unknown {
    const obj: any = {};
    if (message.pendingWithdrawal) {
      obj.pendingWithdrawal = message.pendingWithdrawal.map((e) =>
        e ? PendingWithdrawal.toJSON(e) : undefined
      );
    } else {
      obj.pendingWithdrawal = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllPendingWithdrawalResponse>
  ): QueryAllPendingWithdrawalResponse {
    const message = {
      ...baseQueryAllPendingWithdrawalResponse,
    } as QueryAllPendingWithdrawalResponse;
    message.pendingWithdrawal = [];
    if (
      object.pendingWithdrawal !== undefined &&
      object.pendingWithdrawal !== null
    ) {
      for (const e of object.pendingWithdrawal) {
        message.pendingWithdrawal.push(PendingWithdrawal.fromPartial(e));
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
  /** Queries a NoncedProposedTransfers by index. */
  NoncedProposedTransfers(
    request: QueryGetNoncedProposedTransfersRequest
  ): Promise<QueryGetNoncedProposedTransfersResponse>;
  /** Queries a list of NoncedProposedTransfers items. */
  NoncedProposedTransfersAll(
    request: QueryAllNoncedProposedTransfersRequest
  ): Promise<QueryAllNoncedProposedTransfersResponse>;
  /** Queries a WithdrawTxMap by index. */
  WithdrawTxMap(
    request: QueryGetWithdrawTxMapRequest
  ): Promise<QueryGetWithdrawTxMapResponse>;
  /** Queries a list of WithdrawTxMap items. */
  WithdrawTxMapAll(
    request: QueryAllWithdrawTxMapRequest
  ): Promise<QueryAllWithdrawTxMapResponse>;
  /** Queries a list of WithdrawTxMap items for the specified src account. */
  WithdrawTxMapsByAccount(
    request: QueryWithdrawTxMapsByAccountRequest
  ): Promise<QueryWithdrawTxMapsByAccountResponse>;
  /** Queries a list of WithdrawTxMap items for withdrawals that are pending, optionally for the specified src account. */
  PendingWithdrawals(
    request: QueryPendingWithdrawalsRequest
  ): Promise<QueryPendingWithdrawalsResponse>;
  /** Queries a PendingWithdrawal by index. */
  PendingWithdrawal(
    request: QueryGetPendingWithdrawalRequest
  ): Promise<QueryGetPendingWithdrawalResponse>;
  /** Queries a list of PendingWithdrawal items. */
  PendingWithdrawalAll(
    request: QueryAllPendingWithdrawalRequest
  ): Promise<QueryAllPendingWithdrawalResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("dflow.bridge.Query", "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(new Reader(data)));
  }

  NoncedProposedTransfers(
    request: QueryGetNoncedProposedTransfersRequest
  ): Promise<QueryGetNoncedProposedTransfersResponse> {
    const data = QueryGetNoncedProposedTransfersRequest.encode(
      request
    ).finish();
    const promise = this.rpc.request(
      "dflow.bridge.Query",
      "NoncedProposedTransfers",
      data
    );
    return promise.then((data) =>
      QueryGetNoncedProposedTransfersResponse.decode(new Reader(data))
    );
  }

  NoncedProposedTransfersAll(
    request: QueryAllNoncedProposedTransfersRequest
  ): Promise<QueryAllNoncedProposedTransfersResponse> {
    const data = QueryAllNoncedProposedTransfersRequest.encode(
      request
    ).finish();
    const promise = this.rpc.request(
      "dflow.bridge.Query",
      "NoncedProposedTransfersAll",
      data
    );
    return promise.then((data) =>
      QueryAllNoncedProposedTransfersResponse.decode(new Reader(data))
    );
  }

  WithdrawTxMap(
    request: QueryGetWithdrawTxMapRequest
  ): Promise<QueryGetWithdrawTxMapResponse> {
    const data = QueryGetWithdrawTxMapRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.bridge.Query",
      "WithdrawTxMap",
      data
    );
    return promise.then((data) =>
      QueryGetWithdrawTxMapResponse.decode(new Reader(data))
    );
  }

  WithdrawTxMapAll(
    request: QueryAllWithdrawTxMapRequest
  ): Promise<QueryAllWithdrawTxMapResponse> {
    const data = QueryAllWithdrawTxMapRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.bridge.Query",
      "WithdrawTxMapAll",
      data
    );
    return promise.then((data) =>
      QueryAllWithdrawTxMapResponse.decode(new Reader(data))
    );
  }

  WithdrawTxMapsByAccount(
    request: QueryWithdrawTxMapsByAccountRequest
  ): Promise<QueryWithdrawTxMapsByAccountResponse> {
    const data = QueryWithdrawTxMapsByAccountRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.bridge.Query",
      "WithdrawTxMapsByAccount",
      data
    );
    return promise.then((data) =>
      QueryWithdrawTxMapsByAccountResponse.decode(new Reader(data))
    );
  }

  PendingWithdrawals(
    request: QueryPendingWithdrawalsRequest
  ): Promise<QueryPendingWithdrawalsResponse> {
    const data = QueryPendingWithdrawalsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.bridge.Query",
      "PendingWithdrawals",
      data
    );
    return promise.then((data) =>
      QueryPendingWithdrawalsResponse.decode(new Reader(data))
    );
  }

  PendingWithdrawal(
    request: QueryGetPendingWithdrawalRequest
  ): Promise<QueryGetPendingWithdrawalResponse> {
    const data = QueryGetPendingWithdrawalRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.bridge.Query",
      "PendingWithdrawal",
      data
    );
    return promise.then((data) =>
      QueryGetPendingWithdrawalResponse.decode(new Reader(data))
    );
  }

  PendingWithdrawalAll(
    request: QueryAllPendingWithdrawalRequest
  ): Promise<QueryAllPendingWithdrawalResponse> {
    const data = QueryAllPendingWithdrawalRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.bridge.Query",
      "PendingWithdrawalAll",
      data
    );
    return promise.then((data) =>
      QueryAllPendingWithdrawalResponse.decode(new Reader(data))
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
