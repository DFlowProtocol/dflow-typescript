import { schemaEndorsement } from "@dflow-protocol/signatory-client-lib";
import {
    MAX_ORDER_EXPIRY,
    schemaAddress,
    schemaEip712TypedDataWithoutMessage,
    schemaSignature,
} from "../common";
import { z } from "zod";

export type IndicativeQuoteGetQuery = z.infer<typeof schemaIndicativeQuoteGetQuery>;
export const schemaIndicativeQuoteGetQuery = z.object({
    /** Address of the ERC-20 token that the retail trader is sending. If specified as
     * 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee, the retail trader sends the unwrapped variant
     * of the native token, and the maker receives the wrapped variant. */
    sendToken: schemaAddress,
    /** Address of the ERC-20 token that the retail trader is receiving. If specified as
     * 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee, the retail trader receives the unwrapped variant
     * variant of the native token, and the maker sends the wrapped variant. */
    receiveToken: schemaAddress,
    /** Minimum allowed fill price. Specified as token units sent to retail trader per token
     * received from retail trader */
    minFillPrice: z.string().regex(/^0$|^[1-9]\d*$/),
    auctionId: z.string().regex(/^0$|^[1-9]\d*$/),
    auctionEpoch: z.string().regex(/^0$|^[1-9]\d*$/),
});

export type IndicativeQuoteGetResponse = z.infer<typeof schemaIndicativeQuoteGetResponse>;
export const schemaIndicativeQuoteGetResponse = z.object({
    /** Token units sent to retail trader per token received from retail trader. Must be greater
     * than or equal to the minFillPrice. */
    fillPrice: z.string().regex(/^0$|^[1-9]\d*$/),
});

export type FirmQuotePostRequest = z.infer<typeof schemaFirmQuotePostRequest>;
export const schemaFirmQuotePostRequest = z.object({
    /** Address of the ERC-20 token that the retail trader is sending. If specified as
     * 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee, the retail trader sends the unwrapped variant
     * of the native token, and the maker receives the wrapped variant. */
    sendToken: schemaAddress,
    /** Address of the ERC-20 token that the retail trader is receiving. If specified as
     * 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee, the retail trader receives the unwrapped variant
     * variant of the native token, and the maker sends the wrapped variant. */
    receiveToken: schemaAddress,
    /** `takerToken` to use when constructing the DFlow Swap order. Not specified if the retail
     * trader is sending the unwrapped variant of the native token. */
    takerToken: z.optional(schemaAddress),
    /** `makerToken` to use when constructing the DFlow Swap order. Not specified if the retail
     * trader is receiving the unwrapped variant of the native token. */
    makerToken: z.optional(schemaAddress),
    /** Send quantity specified as a scaled integer. This is the `takerAmount` to use when
     * constructing the DFlow Swap order. */
    sendQty: z.string().regex(/^[1-9]\d*$/),
    /** Platform fee amount specified as a scaled integer. Specified if and only if a platform fee
     * applies to the order. If specified, this is the `platformFee` to use when constructing the
     * DFlow Swap order, and this amount of the `receiveToken` will be transfered from the `maker`
     * to the `platformFeeReceiver` in addition to the `fillQty` being transfered from the `maker`
     * to the `taker`. */
    platformFee: z.optional(z.string().regex(/^[1-9]\d*$/)),
    /** Platform fee receiver address. Specified if and only if a platform fee
     * applies to the order. If specified, this is the `platformFeeReceiver` to use when
     * constructing the DFlow Swap order. */
    platformFeeReceiver: z.optional(schemaAddress),
    /** Minimum allowed fill quantity specified as a scaled integer. This is the minimum
     * `makerAmount` to use when constructing the DFlow Swap order. */
    minFillQty: z.string().regex(/^0$|^[1-9]\d*$/),
    /** If true, the DFlow Swap order must be constructed using
     * `uint128 makerAmountAndTakerAmount` where the higher-order bits are the `uint128 makerAmount`
     * and the lower-order bits are the `uint128 takerAmount`. Otherwise, the order must be
     * constructed using `uint256 makerAmount` and `uint256 takerAmount`. */
    useMakerAmountAndTakerAmount: z.boolean(),
    /** Address of the retail trader's wallet */
    retailTrader: schemaAddress,
    endorsement: schemaEndorsement,
    /** `taker` to use when constructing the DFlow Swap order */
    taker: schemaAddress,
    /** `txOrigin` to use when constructing the DFlow Swap order */
    txOrigin: schemaAddress,
    /** Minimum allowed `expiry` for the DFlow Swap order. Number of seconds since
     * Jan 1, 1970 00:00:00 UTC. */
    minExpiry: z.number().int().nonnegative().max(MAX_ORDER_EXPIRY),
    /** uint256 `flags` to use when constructing the DFlow Swap order */
    flags: z.string().regex(/^0$|^[1-9]\d*$/),
    /** `nonceBucket` to use when constructing the DFlow Swap order */
    nonceBucket: z.string().regex(/^0$|^[1-9]\d*$/),
    /** `nonce` to use when constructing the DFlow Swap order */
    nonce: z.string().regex(/^0$|^[1-9]\d*$/),
    /** EIP-712 TypedData that the market maker must sign. The market maker must construct a message
     * to the primary type and produce an EIP-712 signature covering the TypedData. */
    eip712: schemaEip712TypedDataWithoutMessage,
    auctionId: z.string().regex(/^0$|^[1-9]\d*$/),
    auctionEpoch: z.string().regex(/^0$|^[1-9]\d*$/),
});

export enum FirmQuoteResponseCode {
    Ok = 0,
    /** Market maker opted not to offer a quote */
    Refused = 1,
}

export type FirmQuoteResponseOk = z.infer<typeof schemaFirmQuoteResponseOk>;
export const schemaFirmQuoteResponseOk = z.object({
    code: z.literal(FirmQuoteResponseCode.Ok),
    /** Fill quantity specified as a scaled integer. Must be greater than or equal to the
     * `minFillQty`. This is the `makerAmount` used to construct the DFlow Swap order. This amount
     * of the `receiveToken` is transfered from the `maker` to the `taker`. */
    fillQty: z.string().regex(/^0$|^[1-9]\d*$/),
    /** Address of the market maker's wallet. This is the signer of the DFlow Swap order. This is
     * the `maker` used to construct the DFlow Swap order. */
    maker: schemaAddress,
    /** `expiry` used to construct the DFlow Swap order */
    expiry: z.number().int().nonnegative().max(MAX_ORDER_EXPIRY),
    /** Market maker's signature of the DFlow Swap order */
    orderSignature: schemaSignature,
    quoteId: z.string(),
});

export type FirmQuoteResponseRefused = z.infer<typeof schemaFirmQuoteResponseRefused>;
export const schemaFirmQuoteResponseRefused = z.object({
    code: z.literal(FirmQuoteResponseCode.Refused),
});

export type FirmQuotePostResponse = z.infer<typeof schemaFirmQuotePostResponse>;
export const schemaFirmQuotePostResponse = z.discriminatedUnion("code", [
    schemaFirmQuoteResponseOk,
    schemaFirmQuoteResponseRefused,
]);
