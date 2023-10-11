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

export interface AuctionGridDataRowOFSPayment {
  /** @format uint64 */
  paid?: string;

  /**
   * Total amount that the OFS deserves based on current delivered notional. This may be different
   * than `currentPaymentToOfs` in the event of underflow.
   * @format uint64
   */
  realized?: string;

  /** @format uint64 */
  unrealized?: string;
}

export interface AuctionGridDataRowOverlap {
  hasOverlap?: boolean;
}

export interface QueryOverlapResponseOverlapInfo {
  hasOverlap?: boolean;
}

export interface QueryPricingInfoResponsePricingInfo {
  auctionExistsForPair?: boolean;
  flowEndorsementKey1?: string;
  flowEndorsementKey2?: string;
  ofsAccountExtensions?: string;
}

export interface AuctionAuctionGridDataRow {
  ofsPublicKey?: string;

  /** @format uint64 */
  auctionId?: string;
  clientAuctionId?: string;
  baseCurrency?: string;
  quoteCurrency?: string;

  /** @format uint64 */
  minimumOrderSize?: string;

  /** @format uint64 */
  maximumOrderSize?: string;

  /** @format uint64 */
  notionalSize?: string;

  /** @format int64 */
  maxDeliveryPeriod?: string;

  /** @format uint64 */
  deliveredNotionalSize?: string;

  /** @format uint64 */
  lifetimeDeliveredNotionalSize?: string;

  /** @format uint64 */
  paymentInLieuDeliveredNotionalSize?: string;

  /** @format uint64 */
  paymentInLieuLifetimeDeliveredNotionalSize?: string;

  /** @format int64 */
  feePayerMode?: number;
  isPaymentInLieuEnabled?: boolean;
  isUnidirectional?: boolean;
  extensions?: string;
  network?: string;

  /** @format uint64 */
  epoch?: string;

  /** @format int64 */
  epochCutoffTimestamp?: string;

  /** @format int64 */
  blindBidEndTimestamp?: string;

  /** @format uint64 */
  blindBidEndNotionalTime?: string;
  leader?: AuctionBidInfo;
  winner?: AuctionBidInfo;
  blindBids?: AuctionBlindBid[];
  payment?: AuctionGridDataRowOFSPayment;
  overlap?: AuctionGridDataRowOverlap;
}

export interface AuctionBidInfo {
  marketMakerPublicKey?: string;
  marketMakerUrl?: string;

  /** @format uint64 */
  bid?: string;
}

export interface AuctionBlindBid {
  hash?: string;
  marketMakerPublicKey?: string;

  /** @format uint64 */
  revealedValue?: string;
  isRevealed?: boolean;
}

export interface AuctionEncodedExpiringAuctions {
  encoded?: string;
}

export interface AuctionEndorsement {
  endorser?: string;
  signature?: string;
  id?: string;

  /**
   * Expiration time as UTC. Number of seconds since Jan 1, 1970 00:00:00 UTC.
   * @format int64
   */
  expirationTimeUTC?: string;
  data?: string;
}

export interface AuctionEndorsementInfo {
  /** @format uint64 */
  id?: string;

  /** @format int64 */
  expirationTimeUTC?: string;
}

export interface AuctionEndorsements {
  ofsPublicKey?: string;
  endorsements?: AuctionEndorsementInfo[];
}

export interface AuctionGlobalAuctionState {
  /** @format uint64 */
  nextAuctionId?: string;
}

export type AuctionMsgBlindBidResponse = object;

export interface AuctionMsgCreateAuctionResponse {
  /** @format uint64 */
  auctionId?: string;
}

export type AuctionMsgDeleteAuctionResponse = object;

export type AuctionMsgDeliverNotionalResponse = object;

export type AuctionMsgRevealBidResponse = object;

export type AuctionMsgReviseBlindBidResponse = object;

export type AuctionMsgUpdateAuctionResponse = object;

export interface AuctionOrderFlowAuction {
  ofsPublicKey?: string;

  /** @format uint64 */
  auctionId?: string;
  clientAuctionId?: string;
  baseCurrency?: string;
  quoteCurrency?: string;

  /** @format uint64 */
  minimumOrderSize?: string;

  /** @format uint64 */
  maximumOrderSize?: string;

  /** @format uint64 */
  notionalSize?: string;

  /** @format int64 */
  maxDeliveryPeriod?: string;

  /**
   * Total notional value of order flow delivered during the current epoch. Includes notional delivered for payment in lieu.
   * @format uint64
   */
  deliveredNotionalSize?: string;

  /**
   * Total notional value of order flow delivered over the lifetime of the auction. Includes notional delivered for payment in lieu.
   * @format uint64
   */
  lifetimeDeliveredNotionalSize?: string;

  /** @format uint64 */
  paymentInLieuDeliveredNotionalSize?: string;

  /** @format uint64 */
  paymentInLieuLifetimeDeliveredNotionalSize?: string;

  /** @format int64 */
  feePayerMode?: number;
  isPaymentInLieuEnabled?: boolean;
  isUnidirectional?: boolean;
  extensions?: string;
  network?: string;

  /** @format uint64 */
  epoch?: string;

  /** @format int64 */
  blindBidEndTimestamp?: string;

  /** @format uint64 */
  blindBidEndNotionalTime?: string;
  leader?: AuctionBidInfo;
  winner?: AuctionBidInfo;
  blindBids?: AuctionBlindBid[];
}

/**
 * Params defines the parameters for the module.
 */
export interface AuctionParams {
  /** @format uint64 */
  auctionCost?: string;

  /** @format int64 */
  minDeliveryPeriod?: string;

  /**
   * The maximum allowed endorsement expiration time in seconds relative to when deliver notional is called.
   * Endorsements should not be issued with longer expiration times than this.
   * @format int64
   */
  endorsementMaxRelativeExpiration?: string;

  /**
   * A grace period in seconds added to the maximum allowed expiration time when checking the
   * maximum expiration time of an endorsement. This can be used to ensure that endorsements are not
   * wrongly rejected due to lag in block timestamps.
   * @format int64
   */
  endorsementMaxRelativeExpirationGrace?: string;
}

export interface AuctionQueryAllEndorsementsResponse {
  endorsements?: AuctionEndorsements[];

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

export interface AuctionQueryAllOrderFlowAuctionResponse {
  orderFlowAuction?: AuctionOrderFlowAuction[];

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

export interface AuctionQueryGetEncodedExpiringAuctionsResponse {
  EncodedExpiringAuctions?: AuctionEncodedExpiringAuctions;
}

export interface AuctionQueryGetEndorsementsResponse {
  endorsements?: AuctionEndorsements;
}

export interface AuctionQueryGetGlobalAuctionStateResponse {
  GlobalAuctionState?: AuctionGlobalAuctionState;
}

export interface AuctionQueryGetOrderFlowAuctionResponse {
  orderFlowAuction?: AuctionOrderFlowAuction;
}

export interface AuctionQueryGridResponse {
  rows?: AuctionAuctionGridDataRow[];

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

export interface AuctionQueryGridRowsResponse {
  rows?: AuctionAuctionGridDataRow[];
}

export interface AuctionQueryOrderFlowAuctionsResponse {
  orderFlowAuctions?: AuctionOrderFlowAuction[];
}

export interface AuctionQueryOverlapResponse {
  overlapInfos?: QueryOverlapResponseOverlapInfo[];
}

/**
 * QueryParamsResponse is response type for the Query/Params RPC method.
 */
export interface AuctionQueryParamsResponse {
  /** params holds all the parameters of this module. */
  params?: AuctionParams;
}

export interface AuctionQueryPricingInfoResponse {
  pricingInfo?: QueryPricingInfoResponsePricingInfo;
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
 * @title auction/encoded_expiring_auctions.proto
 * @version version not set
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name QueryEncodedExpiringAuctions
   * @summary Queries a EncodedExpiringAuctions by index.
   * @request GET:/dflow/auction/encoded_expiring_auctions
   */
  queryEncodedExpiringAuctions = (params: RequestParams = {}) =>
    this.request<AuctionQueryGetEncodedExpiringAuctionsResponse, RpcStatus>({
      path: `/dflow/auction/encoded_expiring_auctions`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryEndorsementsAll
   * @summary Queries a list of Endorsements items.
   * @request GET:/dflow/auction/endorsements
   */
  queryEndorsementsAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<AuctionQueryAllEndorsementsResponse, RpcStatus>({
      path: `/dflow/auction/endorsements`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryEndorsements
   * @summary Queries a Endorsements by index.
   * @request GET:/dflow/auction/endorsements/{ofsPublicKey}
   */
  queryEndorsements = (ofsPublicKey: string, params: RequestParams = {}) =>
    this.request<AuctionQueryGetEndorsementsResponse, RpcStatus>({
      path: `/dflow/auction/endorsements/${ofsPublicKey}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryGlobalAuctionState
   * @summary Queries a GlobalAuctionState by index.
   * @request GET:/dflow/auction/global_auction_state
   */
  queryGlobalAuctionState = (params: RequestParams = {}) =>
    this.request<AuctionQueryGetGlobalAuctionStateResponse, RpcStatus>({
      path: `/dflow/auction/global_auction_state`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryGrid
   * @summary Queries a list of auctions.
   * @request GET:/dflow/auction/grid
   */
  queryGrid = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<AuctionQueryGridResponse, RpcStatus>({
      path: `/dflow/auction/grid`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryGridRows
   * @summary Queries a list of GridRows items.
   * @request GET:/dflow/auction/grid_rows
   */
  queryGridRows = (query?: { auctionIds?: string }, params: RequestParams = {}) =>
    this.request<AuctionQueryGridRowsResponse, RpcStatus>({
      path: `/dflow/auction/grid_rows`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryOrderFlowAuctionAll
   * @summary Queries a list of OrderFlowAuction items.
   * @request GET:/dflow/auction/order_flow_auction
   */
  queryOrderFlowAuctionAll = (
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<AuctionQueryAllOrderFlowAuctionResponse, RpcStatus>({
      path: `/dflow/auction/order_flow_auction`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryOrderFlowAuction
   * @summary Queries a OrderFlowAuction by index.
   * @request GET:/dflow/auction/order_flow_auction/{auctionId}
   */
  queryOrderFlowAuction = (auctionId: string, params: RequestParams = {}) =>
    this.request<AuctionQueryGetOrderFlowAuctionResponse, RpcStatus>({
      path: `/dflow/auction/order_flow_auction/${auctionId}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryOrderFlowAuctions
   * @summary Queries a list of OrderFlowAuction items.
   * @request GET:/dflow/auction/order_flow_auctions
   */
  queryOrderFlowAuctions = (
    query?: { ofsPublicKey?: string; network?: string; currency1?: string; currency2?: string; orderSize?: string },
    params: RequestParams = {},
  ) =>
    this.request<AuctionQueryOrderFlowAuctionsResponse, RpcStatus>({
      path: `/dflow/auction/order_flow_auctions`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryOverlap
   * @summary Checks a list of nonexistent auctions for overlap with each other and an order flow source's existing auctions.
   * @request GET:/dflow/auction/overlap
   */
  queryOverlap = (query?: { ofsPublicKey?: string; auctions?: string[] }, params: RequestParams = {}) =>
    this.request<AuctionQueryOverlapResponse, RpcStatus>({
      path: `/dflow/auction/overlap`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryParams
   * @summary Parameters queries the parameters of the module.
   * @request GET:/dflow/auction/params
   */
  queryParams = (params: RequestParams = {}) =>
    this.request<AuctionQueryParamsResponse, RpcStatus>({
      path: `/dflow/auction/params`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryPricingInfo
   * @summary Query pricing info for the order flow source.
   * @request GET:/dflow/auction/pricing_info
   */
  queryPricingInfo = (
    query?: { ofsPublicKey?: string; network?: string; currency1?: string; currency2?: string },
    params: RequestParams = {},
  ) =>
    this.request<AuctionQueryPricingInfoResponse, RpcStatus>({
      path: `/dflow/auction/pricing_info`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
