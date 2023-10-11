/* eslint-disable */
import { Reader, Writer } from "protobufjs/minimal";
import { Params } from "../noncedbank/params";
import { NoncedBridgeState } from "../noncedbank/nonced_bridge_state";

export const protobufPackage = "dflow.noncedbank";

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {}

/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params: Params | undefined;
}

export interface QueryGetNoncedBridgeStateRequest {}

export interface QueryGetNoncedBridgeStateResponse {
  NoncedBridgeState: NoncedBridgeState | undefined;
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

const baseQueryGetNoncedBridgeStateRequest: object = {};

export const QueryGetNoncedBridgeStateRequest = {
  encode(
    _: QueryGetNoncedBridgeStateRequest,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetNoncedBridgeStateRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetNoncedBridgeStateRequest,
    } as QueryGetNoncedBridgeStateRequest;
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

  fromJSON(_: any): QueryGetNoncedBridgeStateRequest {
    const message = {
      ...baseQueryGetNoncedBridgeStateRequest,
    } as QueryGetNoncedBridgeStateRequest;
    return message;
  },

  toJSON(_: QueryGetNoncedBridgeStateRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<QueryGetNoncedBridgeStateRequest>
  ): QueryGetNoncedBridgeStateRequest {
    const message = {
      ...baseQueryGetNoncedBridgeStateRequest,
    } as QueryGetNoncedBridgeStateRequest;
    return message;
  },
};

const baseQueryGetNoncedBridgeStateResponse: object = {};

export const QueryGetNoncedBridgeStateResponse = {
  encode(
    message: QueryGetNoncedBridgeStateResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.NoncedBridgeState !== undefined) {
      NoncedBridgeState.encode(
        message.NoncedBridgeState,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetNoncedBridgeStateResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetNoncedBridgeStateResponse,
    } as QueryGetNoncedBridgeStateResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.NoncedBridgeState = NoncedBridgeState.decode(
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

  fromJSON(object: any): QueryGetNoncedBridgeStateResponse {
    const message = {
      ...baseQueryGetNoncedBridgeStateResponse,
    } as QueryGetNoncedBridgeStateResponse;
    if (
      object.NoncedBridgeState !== undefined &&
      object.NoncedBridgeState !== null
    ) {
      message.NoncedBridgeState = NoncedBridgeState.fromJSON(
        object.NoncedBridgeState
      );
    } else {
      message.NoncedBridgeState = undefined;
    }
    return message;
  },

  toJSON(message: QueryGetNoncedBridgeStateResponse): unknown {
    const obj: any = {};
    message.NoncedBridgeState !== undefined &&
      (obj.NoncedBridgeState = message.NoncedBridgeState
        ? NoncedBridgeState.toJSON(message.NoncedBridgeState)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetNoncedBridgeStateResponse>
  ): QueryGetNoncedBridgeStateResponse {
    const message = {
      ...baseQueryGetNoncedBridgeStateResponse,
    } as QueryGetNoncedBridgeStateResponse;
    if (
      object.NoncedBridgeState !== undefined &&
      object.NoncedBridgeState !== null
    ) {
      message.NoncedBridgeState = NoncedBridgeState.fromPartial(
        object.NoncedBridgeState
      );
    } else {
      message.NoncedBridgeState = undefined;
    }
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Parameters queries the parameters of the module. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  /** Queries a NoncedBridgeState by index. */
  NoncedBridgeState(
    request: QueryGetNoncedBridgeStateRequest
  ): Promise<QueryGetNoncedBridgeStateResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("dflow.noncedbank.Query", "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(new Reader(data)));
  }

  NoncedBridgeState(
    request: QueryGetNoncedBridgeStateRequest
  ): Promise<QueryGetNoncedBridgeStateResponse> {
    const data = QueryGetNoncedBridgeStateRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.noncedbank.Query",
      "NoncedBridgeState",
      data
    );
    return promise.then((data) =>
      QueryGetNoncedBridgeStateResponse.decode(new Reader(data))
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
