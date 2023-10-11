import { liquidityUnavailableReason } from "../../common";
import { schemaEndorsement } from "../../endorsement";
import { schemaPaymentInLieuToken } from "../../paymentInLieu";
import { z } from "zod";

export type IndicativeQuoteRequest = z.infer<typeof schemaIndicativeQuoteRequest>;
export const schemaIndicativeQuoteRequest = z.object({
    chainId: z.number(),
    /** Address of the ERC-20 token sent by the retail trader. For native ETH, this is
     * 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee. */
    sendToken: z.string(),
    /** Address of the ERC-20 token received by the retail trader. For native ETH, this is
     * 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee. */
    receiveToken: z.string(),
    /** Send quantity specified as a scaled integer */
    sendQty: z.string().regex(/^[1-9]\d*$/),
    /** DFlow network public key identifying the order flow source. */
    orderFlowSource: z.string(),
    /** The order flow source's endorsement of this quote request. */
    endorsement: schemaEndorsement,
});

export enum IndicativeQuoteResponseType {
    Ok = "Ok",
    Unavailable = "Unavailable",
}

export type IndicativeQuoteOkResponse = z.infer<typeof schemaIndicativeQuoteOkResponse>;
export const schemaIndicativeQuoteOkResponse = z.object({
    type: z.literal(IndicativeQuoteResponseType.Ok),
    data: z.object({
        /** Token units sent to retail trader per token received from retail trader */
        fillPrice: z.string(),
        effectivePlatformFeeBps: z.number(),
        auctionId: z.number(),
        auctionEpoch: z.number(),
        /** The allowance target that would be returned for a firm quote request with the same
         * parameters */
        allowanceTarget: z.nullable(z.string()),
    }),
});

export type IndicativeQuoteUnavailableResponse
    = z.infer<typeof schemaIndicativeQuoteUnavailableResponse>;
export const schemaIndicativeQuoteUnavailableResponse = z.object({
    type: z.literal(IndicativeQuoteResponseType.Unavailable),
    data: z.object({
        reason: liquidityUnavailableReason,
    }),
});

export type IndicativeQuoteResponse = z.infer<typeof schemaIndicativeQuoteResponse>;
export const schemaIndicativeQuoteResponse = z.discriminatedUnion("type", [
    schemaIndicativeQuoteOkResponse,
    schemaIndicativeQuoteUnavailableResponse,
]);

export type FirmQuoteRequest = z.infer<typeof schemaFirmQuoteRequest>;
export const schemaFirmQuoteRequest = z.object({
    chainId: z.number(),
    /** Address of the ERC-20 token sent by the retail trader. For native ETH, this is
     * 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee. */
    sendToken: z.string(),
    /** Address of the ERC-20 token received by the retail trader. For native ETH, this is
     * 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee. */
    receiveToken: z.string(),
    /** Send quantity specified as a scaled integer */
    sendQty: z.string().regex(/^[1-9]\d*$/),
    /** DFlow network public key identifying the order flow source. */
    orderFlowSource: z.string(),
    /** The order flow source's endorsement of this quote request. */
    endorsement: schemaEndorsement,
});

export enum FirmQuoteResponseType {
    /** Transaction must be sent directly to the settlement network */
    Ok = "Ok",
    /** Liquidity is unavailable, and payment in lieu is offered */
    PaymentInLieu = "PaymentInLieu",
    /** Liquidity is unavailable, and payment in lieu is not offered */
    Unavailable = "Unavailable",
}

export type TransactionInfo = z.infer<typeof schemaTransactionInfo>;
export const schemaTransactionInfo = z.object({
    chainId: z.number(),
    from: z.string(),
    to: z.string(),
    data: z.string(),
    value: z.string(),
});

export type SignatoryRequestIdentifier = z.infer<typeof schemaSignatoryRequestID>;
export const schemaSignatoryRequestID = z.object({
    /** Base64-encoded Ed25519 signature of
     *  `"{id},{retailTrader},{sendToken},{sendQty},{notional},{auctionId},{auctionEpoch}
     *    ,{endorsement},{lastValidBlockTimestamp}
     *    ,{tx.chainId},{tx.from},{tx.to}{tx.data},{tx.value}"`. */
    signature: z.string(),
    /** Unique identifier for the request. */
    id: z.string(),
    retailTrader: z.string(),
    sendToken: z.string(),
    sendQty: z.string(),
    notional: z.number(),
    auctionId: z.number(),
    auctionEpoch: z.number(),
    endorsement: schemaEndorsement,
    lastValidBlockTimestamp: z.number(),
    tx: schemaTransactionInfo,
}).passthrough();

export type FirmQuoteOkResponse = z.infer<typeof schemaFirmQuoteOkResponse>;
export const schemaFirmQuoteOkResponse = z.object({
    type: z.literal(FirmQuoteResponseType.Ok),
    data: z.object({
        /** The transaction. The client is responsible for populating the transaction's nonce and
         * gas parameters. The client must not modify the specified transaction parameters. */
        tx: schemaTransactionInfo,
        /** The contract address for which the retail trader needs to have an allowance for the send
         * token for the transaction to be processed. If null, then the transaction does not require
         * an allowance from the retail trader. */
        allowanceTarget: z.nullable(z.string()),
        /** The last block timestamp at which the transaction can be processed. */
        lastValidBlockTimestamp: z.number(),
        /** Send quantity specified as a scaled integer */
        sendQty: z.string(),
        /** Receive quantity specified as a scaled integer */
        receiveQty: z.string(),
        /** Minimum allowed fill quantity before platform fee. Specified as a scaled integer. */
        minFillQty: z.string(),
        /** Platform fee info. Only included if a platform fee was applied to the transaction. */
        platformFee: z.optional(z.object({
            receiver: z.string(),
            /** Platform fee quantity specified as a scaled integer. Note that this is
             * already factored into the `receiveQty`. */
            qty: z.string(),
            bps: z.number(),
            /** Address of the ERC-20 token in which the platform fee will be paid. For native ETH,
             * this is 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee. */
            token: z.string(),
        })),
        /** Time at which the DBBO was calculated */
        dbboTime: z.number(),
        /** (Unstable) Response body returned by the DBBO query that was used to determine the
         * `minFillQty` */
        dbboData: z.any(),
        /** Notional value in USD of the send quantity */
        sendNotional: z.optional(z.number()),
        /** Notional value in USD of the receive quantity */
        receiveNotional: z.optional(z.number()),
        /** Notional value in USD of the fill quantity before platform fee */
        fillNotional: z.optional(z.number()),
        /** (Unstable) Signatory server request identifier */
        requestId: schemaSignatoryRequestID,
    }),
});

export type FirmQuotePaymentInLieuResponse = z.infer<typeof schemaFirmQuotePaymentInLieuResponse>;
export const schemaFirmQuotePaymentInLieuResponse = z.object({
    type: z.literal(FirmQuoteResponseType.PaymentInLieu),
    data: z.object({
        reason: liquidityUnavailableReason,
        paymentInLieuToken: schemaPaymentInLieuToken,
    }),
});

export type FirmQuoteUnavailableResponse = z.infer<typeof schemaFirmQuoteUnavailableResponse>;
export const schemaFirmQuoteUnavailableResponse = z.object({
    type: z.literal(FirmQuoteResponseType.Unavailable),
    data: z.object({
        reason: liquidityUnavailableReason,
    }),
});

export type FirmQuoteResponse = z.infer<typeof schemaFirmQuoteResponse>;
export const schemaFirmQuoteResponse = z.discriminatedUnion("type", [
    schemaFirmQuoteOkResponse,
    schemaFirmQuotePaymentInLieuResponse,
    schemaFirmQuoteUnavailableResponse,
]);

export type ReportTransactionRequest = z.infer<typeof schemaReportTransactionRequest>;
export const schemaReportTransactionRequest = z.object({
    /** The transaction hash of the executed LegacySwap transaction */
    txHash: z.string(),
    /** The requestId from the firm quote response */
    requestId: schemaSignatoryRequestID,
});

export enum ReportTransactionResponseType {
    /** Payment for the transaction was sent to the order flow source */
    Paid = "Paid",
    /** Payment for the transaction was not sent to the order flow source */
    NotPaid = "NotPaid",
}

export type ReportTransactionResponsePaid = z.infer<typeof schemaReportTransactionResponsePaid>;
export const schemaReportTransactionResponsePaid = z.object({
    type: z.literal(ReportTransactionResponseType.Paid),
    data: z.object({
        /** DFlow network deliver notional transaction hash */
        txHash: z.string(),
    }),
});

export type ReportTransactionResponseNotPaid
    = z.infer<typeof schemaReportTransactionResponseNotPaid>;
export const schemaReportTransactionResponseNotPaid = z.object({
    type: z.literal(ReportTransactionResponseType.NotPaid),
});

export type ReportTransactionResponse = z.infer<typeof schemaReportTransactionResponse>;
export const schemaReportTransactionResponse = z.discriminatedUnion("type", [
    schemaReportTransactionResponsePaid,
    schemaReportTransactionResponseNotPaid,
]);
