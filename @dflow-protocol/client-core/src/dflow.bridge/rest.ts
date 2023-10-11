/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface BridgeEndorsedTransfer {
  validatorPublicKey?: string;
  transfer?: BridgeTransfer;
}

export interface BridgeMsgAttestTransferResponse {
  /** @format uint64 */
  currentCommittedNonce?: string;
}

export interface BridgeMsgRequestWithdrawResponse {
  /** @format uint64 */
  withdrawId?: string;
}

export type BridgeMsgReviseWithdrawalResponse = object;

export type BridgeMsgSignWithdrawalResponse = object;

export interface BridgeNoncedProposedTransfers {
  /** @format uint64 */
  nonce?: string;
  proposed?: BridgeEndorsedTransfer[];
}

/**
 * Params defines the parameters for the module.
 */
export type BridgeParams = object;

export interface BridgePendingWithdrawal {
  /** @format uint64 */
  withdrawId?: string;
}

export interface BridgeQueryAllNoncedProposedTransfersResponse {
  noncedProposedTransfers?: BridgeNoncedProposedTransfers[];

  /**
   * PageResponse is to be embedded in gRPC response messages where the
   * corresponding request message has used PageRequest.
   *
   *  message SomeResponse {
   *          repeated Bar results = 1;
   *          PageResponse page = 2;
   *  }
   */
  pagination?: V1Beta1PageResponse;
}

export interface BridgeQueryAllPendingWithdrawalResponse {
  pendingWithdrawal?: BridgePendingWithdrawal[];

  /**
   * PageResponse is to be embedded in gRPC response messages where the
   * corresponding request message has used PageRequest.
   *
   *  message SomeResponse {
   *          repeated Bar results = 1;
   *          PageResponse page = 2;
   *  }
   */
  pagination?: V1Beta1PageResponse;
}

export interface BridgeQueryAllWithdrawTxMapResponse {
  withdrawTxMap?: BridgeWithdrawTxMap[];

  /**
   * PageResponse is to be embedded in gRPC response messages where the
   * corresponding request message has used PageRequest.
   *
   *  message SomeResponse {
   *          repeated Bar results = 1;
   *          PageResponse page = 2;
   *  }
   */
  pagination?: V1Beta1PageResponse;
}

export interface BridgeQueryGetNoncedProposedTransfersResponse {
  noncedProposedTransfers?: BridgeNoncedProposedTransfers;
}

export interface BridgeQueryGetPendingWithdrawalResponse {
  pendingWithdrawal?: BridgePendingWithdrawal;
}

export interface BridgeQueryGetWithdrawTxMapResponse {
  withdrawTxMap?: BridgeWithdrawTxMap;
}

/**
 * QueryParamsResponse is response type for the Query/Params RPC method.
 */
export interface BridgeQueryParamsResponse {
  /** params holds all the parameters of this module. */
  params?: BridgeParams;
}

export interface BridgeQueryPendingWithdrawalsResponse {
  withdrawTxMaps?: BridgeWithdrawTxMap[];
}

export interface BridgeQueryWithdrawTxMapsByAccountResponse {
  withdrawTxMaps?: BridgeWithdrawTxMap[];
}

export interface BridgeSignatureInfo {
  ssPublicKey?: string;
  ed25519PublicKey?: string;
  signature?: string;
}

export interface BridgeTransfer {
  transferType?: BridgeTransferType;
  dst?: string;

  /** @format uint64 */
  amount?: string;

  /** @format uint64 */
  nonce?: string;

  /** @format uint64 */
  withdrawId?: string;
}

export enum BridgeTransferType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
}

export interface BridgeWithdrawTxMap {
  /** @format uint64 */
  withdrawId?: string;
  message?: string;
  signatures?: BridgeSignatureInfo[];
  src?: string;
  dst?: string;
  dstOwner?: string;

  /** @format uint64 */
  amt?: string;
}

export interface ProtobufAny {
  "@type"?: string;
}

export interface RpcStatus {
  /** @format int32 */
  code?: number;
  message?: string;
  details?: ProtobufAny[];
}

/**
* message SomeRequest {
         Foo some_parameter = 1;
         PageRequest pagination = 2;
 }
*/
export interface V1Beta1PageRequest {
  /**
   * key is a value returned in PageResponse.next_key to begin
   * querying the next page most efficiently. Only one of offset or key
   * should be set.
   * @format byte
   */
  key?: string;

  /**
   * offset is a numeric offset that can be used when key is unavailable.
   * It is less efficient than using key. Only one of offset or key should
   * be set.
   * @format uint64
   */
  offset?: string;

  /**
   * limit is the total number of results to be returned in the result page.
   * If left empty it will default to a value to be set by each app.
   * @format uint64
   */
  limit?: string;

  /**
   * count_total is set to true  to indicate that the result set should include
   * a count of the total number of items available for pagination in UIs.
   * count_total is only respected when offset is used. It is ignored when key
   * is set.
   */
  count_total?: boolean;

  /**
   * reverse is set to true if results are to be returned in the descending order.
   *
   * Since: cosmos-sdk 0.43
   */
  reverse?: boolean;
}

/**
* PageResponse is to be embedded in gRPC response messages where the
corresponding request message has used PageRequest.

 message SomeResponse {
         repeated Bar results = 1;
         PageResponse page = 2;
 }
*/
export interface V1Beta1PageResponse {
  /**
   * next_key is the key to be passed to PageRequest.key to
   * query the next page most efficiently. It will be empty if
   * there are no more results.
   * @format byte
   */
  next_key?: string;

  /** @format uint64 */
  total?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: keyof Omit<Body, "body" | "bodyUsed">;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType) => RequestParams | void;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType = null as any;
  private securityWorker: null | ApiConfig<SecurityDataType>["securityWorker"] = null;
  private abortControllers = new Map<CancelToken, AbortController>();

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType) => {
    this.securityData = data;
  };

  private addQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];

    return (
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(Array.isArray(value) ? value.join(",") : typeof value === "number" ? value : `${value}`)
    );
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) =>
        typeof query[key] === "object" && !Array.isArray(query[key])
          ? this.toQueryString(query[key] as QueryParamsType)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((data, key) => {
        data.append(key, input[key]);
        return data;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  private mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format = "json",
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams = (secure && this.securityWorker && this.securityWorker(this.securityData)) || {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];

    return fetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = (null as unknown) as T;
      r.error = (null as unknown) as E;

      const data = await response[format]()
        .then((data) => {
          if (r.ok) {
            r.data = data;
          } else {
            r.error = data;
          }
          return r;
        })
        .catch((e) => {
          r.error = e;
          return r;
        });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title bridge/event.proto
 * @version version not set
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name QueryNoncedProposedTransfersAll
   * @summary Queries a list of NoncedProposedTransfers items.
   * @request GET:/dflow/bridge/nonced_proposed_transfers
   */
  queryNoncedProposedTransfersAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<BridgeQueryAllNoncedProposedTransfersResponse, RpcStatus>({
      path: `/dflow/bridge/nonced_proposed_transfers`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryNoncedProposedTransfers
   * @summary Queries a NoncedProposedTransfers by index.
   * @request GET:/dflow/bridge/nonced_proposed_transfers/{nonce}
   */
  queryNoncedProposedTransfers = (nonce: string, params: RequestParams = {}) =>
    this.request<BridgeQueryGetNoncedProposedTransfersResponse, RpcStatus>({
      path: `/dflow/bridge/nonced_proposed_transfers/${nonce}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryParams
   * @summary Parameters queries the parameters of the module.
   * @request GET:/dflow/bridge/params
   */
  queryParams = (params: RequestParams = {}) =>
    this.request<BridgeQueryParamsResponse, RpcStatus>({
      path: `/dflow/bridge/params`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryPendingWithdrawalAll
   * @summary Queries a list of PendingWithdrawal items.
   * @request GET:/dflow/bridge/pending_withdrawal
   */
  queryPendingWithdrawalAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<BridgeQueryAllPendingWithdrawalResponse, RpcStatus>({
      path: `/dflow/bridge/pending_withdrawal`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryPendingWithdrawal
   * @summary Queries a PendingWithdrawal by index.
   * @request GET:/dflow/bridge/pending_withdrawal/{withdrawId}
   */
  queryPendingWithdrawal = (withdrawId: string, params: RequestParams = {}) =>
    this.request<BridgeQueryGetPendingWithdrawalResponse, RpcStatus>({
      path: `/dflow/bridge/pending_withdrawal/${withdrawId}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryPendingWithdrawals
   * @summary Queries a list of WithdrawTxMap items for withdrawals that are pending, optionally for the specified src account.
   * @request GET:/dflow/bridge/pending_withdrawals/{src}
   */
  queryPendingWithdrawals = (src: string, params: RequestParams = {}) =>
    this.request<BridgeQueryPendingWithdrawalsResponse, RpcStatus>({
      path: `/dflow/bridge/pending_withdrawals/${src}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryWithdrawTxMapAll
   * @summary Queries a list of WithdrawTxMap items.
   * @request GET:/dflow/bridge/withdraw_tx_map
   */
  queryWithdrawTxMapAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<BridgeQueryAllWithdrawTxMapResponse, RpcStatus>({
      path: `/dflow/bridge/withdraw_tx_map`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryWithdrawTxMap
   * @summary Queries a WithdrawTxMap by index.
   * @request GET:/dflow/bridge/withdraw_tx_map/{withdrawId}
   */
  queryWithdrawTxMap = (withdrawId: string, params: RequestParams = {}) =>
    this.request<BridgeQueryGetWithdrawTxMapResponse, RpcStatus>({
      path: `/dflow/bridge/withdraw_tx_map/${withdrawId}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryWithdrawTxMapsByAccount
   * @summary Queries a list of WithdrawTxMap items for the specified src account.
   * @request GET:/dflow/bridge/withdraw_tx_maps_by_account/{src}
   */
  queryWithdrawTxMapsByAccount = (src: string, params: RequestParams = {}) =>
    this.request<BridgeQueryWithdrawTxMapsByAccountResponse, RpcStatus>({
      path: `/dflow/bridge/withdraw_tx_maps_by_account/${src}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
