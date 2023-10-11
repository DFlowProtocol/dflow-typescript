/* eslint-disable */
import { Reader, Writer } from "protobufjs/minimal";
import { Params } from "../ssaccount/params";
import { SignatoryServer } from "../ssaccount/signatory_server";
import {
  PageRequest,
  PageResponse,
} from "../cosmos/base/query/v1beta1/pagination";

export const protobufPackage = "dflow.ssaccount";

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {}

/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params: Params | undefined;
}

export interface QueryGetSignatoryServerRequest {
  ssPublicKey: string;
}

export interface QueryGetSignatoryServerResponse {
  signatoryServer: SignatoryServer | undefined;
}

export interface QueryAllSignatoryServerRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllSignatoryServerResponse {
  signatoryServer: SignatoryServer[];
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

const baseQueryGetSignatoryServerRequest: object = { ssPublicKey: "" };

export const QueryGetSignatoryServerRequest = {
  encode(
    message: QueryGetSignatoryServerRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.ssPublicKey !== "") {
      writer.uint32(10).string(message.ssPublicKey);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetSignatoryServerRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetSignatoryServerRequest,
    } as QueryGetSignatoryServerRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ssPublicKey = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetSignatoryServerRequest {
    const message = {
      ...baseQueryGetSignatoryServerRequest,
    } as QueryGetSignatoryServerRequest;
    if (object.ssPublicKey !== undefined && object.ssPublicKey !== null) {
      message.ssPublicKey = String(object.ssPublicKey);
    } else {
      message.ssPublicKey = "";
    }
    return message;
  },

  toJSON(message: QueryGetSignatoryServerRequest): unknown {
    const obj: any = {};
    message.ssPublicKey !== undefined &&
      (obj.ssPublicKey = message.ssPublicKey);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetSignatoryServerRequest>
  ): QueryGetSignatoryServerRequest {
    const message = {
      ...baseQueryGetSignatoryServerRequest,
    } as QueryGetSignatoryServerRequest;
    if (object.ssPublicKey !== undefined && object.ssPublicKey !== null) {
      message.ssPublicKey = object.ssPublicKey;
    } else {
      message.ssPublicKey = "";
    }
    return message;
  },
};

const baseQueryGetSignatoryServerResponse: object = {};

export const QueryGetSignatoryServerResponse = {
  encode(
    message: QueryGetSignatoryServerResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.signatoryServer !== undefined) {
      SignatoryServer.encode(
        message.signatoryServer,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetSignatoryServerResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetSignatoryServerResponse,
    } as QueryGetSignatoryServerResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signatoryServer = SignatoryServer.decode(
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

  fromJSON(object: any): QueryGetSignatoryServerResponse {
    const message = {
      ...baseQueryGetSignatoryServerResponse,
    } as QueryGetSignatoryServerResponse;
    if (
      object.signatoryServer !== undefined &&
      object.signatoryServer !== null
    ) {
      message.signatoryServer = SignatoryServer.fromJSON(
        object.signatoryServer
      );
    } else {
      message.signatoryServer = undefined;
    }
    return message;
  },

  toJSON(message: QueryGetSignatoryServerResponse): unknown {
    const obj: any = {};
    message.signatoryServer !== undefined &&
      (obj.signatoryServer = message.signatoryServer
        ? SignatoryServer.toJSON(message.signatoryServer)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetSignatoryServerResponse>
  ): QueryGetSignatoryServerResponse {
    const message = {
      ...baseQueryGetSignatoryServerResponse,
    } as QueryGetSignatoryServerResponse;
    if (
      object.signatoryServer !== undefined &&
      object.signatoryServer !== null
    ) {
      message.signatoryServer = SignatoryServer.fromPartial(
        object.signatoryServer
      );
    } else {
      message.signatoryServer = undefined;
    }
    return message;
  },
};

const baseQueryAllSignatoryServerRequest: object = {};

export const QueryAllSignatoryServerRequest = {
  encode(
    message: QueryAllSignatoryServerRequest,
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
  ): QueryAllSignatoryServerRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllSignatoryServerRequest,
    } as QueryAllSignatoryServerRequest;
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

  fromJSON(object: any): QueryAllSignatoryServerRequest {
    const message = {
      ...baseQueryAllSignatoryServerRequest,
    } as QueryAllSignatoryServerRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllSignatoryServerRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllSignatoryServerRequest>
  ): QueryAllSignatoryServerRequest {
    const message = {
      ...baseQueryAllSignatoryServerRequest,
    } as QueryAllSignatoryServerRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryAllSignatoryServerResponse: object = {};

export const QueryAllSignatoryServerResponse = {
  encode(
    message: QueryAllSignatoryServerResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.signatoryServer) {
      SignatoryServer.encode(v!, writer.uint32(10).fork()).ldelim();
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
  ): QueryAllSignatoryServerResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllSignatoryServerResponse,
    } as QueryAllSignatoryServerResponse;
    message.signatoryServer = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signatoryServer.push(
            SignatoryServer.decode(reader, reader.uint32())
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

  fromJSON(object: any): QueryAllSignatoryServerResponse {
    const message = {
      ...baseQueryAllSignatoryServerResponse,
    } as QueryAllSignatoryServerResponse;
    message.signatoryServer = [];
    if (
      object.signatoryServer !== undefined &&
      object.signatoryServer !== null
    ) {
      for (const e of object.signatoryServer) {
        message.signatoryServer.push(SignatoryServer.fromJSON(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllSignatoryServerResponse): unknown {
    const obj: any = {};
    if (message.signatoryServer) {
      obj.signatoryServer = message.signatoryServer.map((e) =>
        e ? SignatoryServer.toJSON(e) : undefined
      );
    } else {
      obj.signatoryServer = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllSignatoryServerResponse>
  ): QueryAllSignatoryServerResponse {
    const message = {
      ...baseQueryAllSignatoryServerResponse,
    } as QueryAllSignatoryServerResponse;
    message.signatoryServer = [];
    if (
      object.signatoryServer !== undefined &&
      object.signatoryServer !== null
    ) {
      for (const e of object.signatoryServer) {
        message.signatoryServer.push(SignatoryServer.fromPartial(e));
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
  /** Queries a SignatoryServer by index. */
  SignatoryServer(
    request: QueryGetSignatoryServerRequest
  ): Promise<QueryGetSignatoryServerResponse>;
  /** Queries a list of SignatoryServer items. */
  SignatoryServerAll(
    request: QueryAllSignatoryServerRequest
  ): Promise<QueryAllSignatoryServerResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("dflow.ssaccount.Query", "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(new Reader(data)));
  }

  SignatoryServer(
    request: QueryGetSignatoryServerRequest
  ): Promise<QueryGetSignatoryServerResponse> {
    const data = QueryGetSignatoryServerRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.ssaccount.Query",
      "SignatoryServer",
      data
    );
    return promise.then((data) =>
      QueryGetSignatoryServerResponse.decode(new Reader(data))
    );
  }

  SignatoryServerAll(
    request: QueryAllSignatoryServerRequest
  ): Promise<QueryAllSignatoryServerResponse> {
    const data = QueryAllSignatoryServerRequest.encode(request).finish();
    const promise = this.rpc.request(
      "dflow.ssaccount.Query",
      "SignatoryServerAll",
      data
    );
    return promise.then((data) =>
      QueryAllSignatoryServerResponse.decode(new Reader(data))
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
