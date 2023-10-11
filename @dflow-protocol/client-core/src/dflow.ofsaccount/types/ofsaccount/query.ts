/* eslint-disable */
import { Reader, Writer } from "protobufjs/minimal";
import { Params } from "../ofsaccount/params";
import { OrderFlowSource } from "../ofsaccount/order_flow_source";
import {
  PageRequest,
  PageResponse,
} from "../cosmos/base/query/v1beta1/pagination";

export const protobufPackage = "dflow.ofsaccount";

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {}

/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params: Params | undefined;
}

export interface QueryGetOrderFlowSourceRequest {
  publicKey: string;
}

export interface QueryGetOrderFlowSourceResponse {
  orderFlowSource: OrderFlowSource | undefined;
}

export interface QueryAllOrderFlowSourceRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllOrderFlowSourceResponse {
  orderFlowSource: OrderFlowSource[];
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

const baseQueryGetOrderFlowSourceRequest: object = { publicKey: "" };

export const QueryGetOrderFlowSourceRequest = {
  encode(
    message: QueryGetOrderFlowSourceRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.publicKey !== "") {
      writer.uint32(10).string(message.publicKey);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetOrderFlowSourceRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetOrderFlowSourceRequest,
    } as QueryGetOrderFlowSourceRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.publicKey = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetOrderFlowSourceRequest {
    const message = {
      ...baseQueryGetOrderFlowSourceRequest,
    } as QueryGetOrderFlowSourceRequest;
    if (object.publicKey !== undefined && object.publicKey !== null) {
      message.publicKey = String(object.publicKey);
    } else {
      message.publicKey = "";
    }
    return message;
  },

  toJSON(message: QueryGetOrderFlowSourceRequest): unknown {
    const obj: any = {};
    message.publicKey !== undefined && (obj.publicKey = message.publicKey);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetOrderFlowSourceRequest>
  ): QueryGetOrderFlowSourceRequest {
    const message = {
      ...baseQueryGetOrderFlowSourceRequest,
    } as QueryGetOrderFlowSourceRequest;
    if (object.publicKey !== undefined && object.publicKey !== null) {
      message.publicKey = object.publicKey;
    } else {
      message.publicKey = "";
    }
    return message;
  },
};

const baseQueryGetOrderFlowSourceResponse: object = {};

export const QueryGetOrderFlowSourceResponse = {
  encode(
    message: QueryGetOrderFlowSourceResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.orderFlowSource !== undefined) {
      OrderFlowSource.encode(
        message.orderFlowSource,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetOrderFlowSourceResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetOrderFlowSourceResponse,
    } as QueryGetOrderFlowSourceResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderFlowSource = OrderFlowSource.decode(
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

  fromJSON(object: any): QueryGetOrderFlowSourceResponse {
    const message = {
      ...baseQueryGetOrderFlowSourceResponse,
    } as QueryGetOrderFlowSourceResponse;
    if (
      object.orderFlowSource !== undefined &&
      object.orderFlowSource !== null
    ) {
      message.orderFlowSource = OrderFlowSource.fromJSON(
        object.orderFlowSource
      );
    } else {
      message.orderFlowSource = undefined;
    }
    return message;
  },

  toJSON(message: QueryGetOrderFlowSourceResponse): unknown {
    const obj: any = {};
    message.orderFlowSource !== undefined &&
      (obj.orderFlowSource = message.orderFlowSource
        ? OrderFlowSource.toJSON(message.orderFlowSource)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetOrderFlowSourceResponse>
  ): QueryGetOrderFlowSourceResponse {
    const message = {
      ...baseQueryGetOrderFlowSourceResponse,
    } as QueryGetOrderFlowSourceResponse;
    if (
      object.orderFlowSource !== undefined &&
      object.orderFlowSource !== null
    ) {
      message.orderFlowSource = OrderFlowSource.fromPartial(
        object.orderFlowSource
      );
    } else {
      message.orderFlowSource = undefined;
    }
    return message;
  },
};

const baseQueryAllOrderFlowSourceRequest: object = {};

export const QueryAllOrderFlowSourceRequest = {
  encode(
    message: QueryAllOrderFlowSourceRequest,
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
  ): QueryAllOrderFlowSourceRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllOrderFlowSourceRequest,
    } as QueryAllOrderFlowSourceRequest;
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

  fromJSON(object: any): QueryAllOrderFlowSourceRequest {
    const message = {
      ...baseQueryAllOrderFlowSourceRequest,
    } as QueryAllOrderFlowSourceRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllOrderFlowSourceRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllOrderFlowSourceRequest>
  ): QueryAllOrderFlowSourceRequest {
    const message = {
      ...baseQueryAllOrderFlowSourceRequest,
    } as QueryAllOrderFlowSourceRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryAllOrderFlowSourceResponse: object = {};

export const QueryAllOrderFlowSourceResponse = {
  encode(
    message: QueryAllOrderFlowSourceResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.orderFlowSource) {
      OrderFlowSource.encode(v!, writer.uint32(10).fork()).ldelim();
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
  ): QueryAllOrderFlowSourceResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllOrderFlowSourceResponse,
    } as QueryAllOrderFlowSourceResponse;
    message.orderFlowSource = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderFlowSource.push(
            OrderFlowSource.decode(reader, reader.uint32())
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

  fromJSON(object: any): QueryAllOrderFlowSourceResponse {
    const message = {
      ...baseQueryAllOrderFlowSourceResponse,
    } as QueryAllOrderFlowSourceResponse;
    message.orderFlowSource = [];
    if (
      object.orderFlowSource !== undefined &&
      object.orderFlowSource !== null
    ) {
      for (const e of object.orderFlowSource) {
        message.orderFlowSource.push(OrderFlowSource.fromJSON(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllOrderFlowSourceResponse): unknown {
    const obj: any = {};
    if (message.orderFlowSource) {
      obj.orderFlowSource = message.orderFlowSource.map((e) =>
        e ? OrderFlowSource.toJSON(e) : undefined
      );
    } else {
      obj.orderFlowSource = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllOrderFlowSourceResponse>
  ): QueryAllOrderFlowSourceResponse {
    const message = {
      ...baseQueryAllOrderFlowSourceResponse,
    } as QueryAllOrderFlowSourceResponse;
    message.orderFlowSource = [];
    if (
      object.orderFlowSource !== undefined &&
      object.orderFlowSource !== null
    ) {
      for (const e of object.orderFlowSource) {
        message.orderFlowSource.push(OrderFlowSource.fromPartial(e));
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
  /** Queries a OrderFlowSource by index. */
  OrderFlowSource(
    request: QueryGetOrderFlowSourceRequest
  ): Promise<QueryGetOrderFlowSourceResponse>;
  /** Queries a list of OrderFlowSource items. */
  OrderFlowSourceAll(
    request: QueryAllOrderFlowSourceRequest
  ): Promise<QueryAllOrderFlowSourceResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("dflow.ofsaccount.Query", "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(new Reader(data)));
  }

  OrderFlowSource(
    request: QueryGetOrderFlowSourceRequest
  ): Promise<QueryGetOrderFlowSourceResponse> {
    const data = QueryGetOrderFlowSourceRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.ofsaccount.Query",
      "OrderFlowSource",
      data
    );
    return promise.then((data) =>
      QueryGetOrderFlowSourceResponse.decode(new Reader(data))
    );
  }

  OrderFlowSourceAll(
    request: QueryAllOrderFlowSourceRequest
  ): Promise<QueryAllOrderFlowSourceResponse> {
    const data = QueryAllOrderFlowSourceRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.ofsaccount.Query",
      "OrderFlowSourceAll",
      data
    );
    return promise.then((data) =>
      QueryAllOrderFlowSourceResponse.decode(new Reader(data))
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
