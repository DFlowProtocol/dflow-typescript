import { liquidityUnavailableReason } from "../common";
import { schemaEndorsement } from "../endorsement";
import { schemaPaymentInLieuToken } from "../paymentInLieu";
import { z } from "zod";

export type FeePayer = z.infer<typeof schemaFeePayer>;
export const schemaFeePayer = z.union([
    z.literal("retailTrader"),
    z.literal("marketMaker"),
]);

export type IndicativeQuoteRequest = z.infer<typeof schemaIndicativeQuoteRequest>;
export const schemaIndicativeQuoteRequest = z.object({
    /** Base58-encoded SPL mint sent by the retail trader. */
    sendMint: z.string(),
    /** Base58-encoded SPL mint received by the retail trader. */
    receiveMint: z.string(),
    /** Send quantity specified as a scaled integer */
    sendQty: z.string().regex(/^[1-9]\d*$/),
    /** DFlow network public key identifying the order flow source. */
    orderFlowSource: z.string(),
    /** The order flow source's endorsement of this quote request. */
    endorsement: schemaEndorsement,
    /** (Optional) The fee payer for the transaction. If unspecified and the order flow source has
     * multiple auctions with different fee payer modes that match the request, the signatory server
     * will determine which fee payer mode to use. */
    feePayer: z.optional(schemaFeePayer),
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

export enum FirmQuoteResponseType {
    /** Transaction must be sent via signatory server sendTransaction endpoint */
    Ok = "Ok",
    /** Liquidity is unavailable, and payment in lieu is offered */
    PaymentInLieu = "PaymentInLieu",
    /** Liquidity is unavailable, and payment in lieu is not offered */
    Unavailable = "Unavailable",
}

export type FirmQuoteRequest = z.infer<typeof schemaFirmQuoteRequest>;
export const schemaFirmQuoteRequest = z.object({
    /** Base58-encoded SPL mint sent by the retail trader. */
    sendMint: z.string(),
    /** Base58-encoded SPL mint received by the retail trader. */
    receiveMint: z.string(),
    /** Send quantity specified as a scaled integer */
    sendQty: z.string().regex(/^[1-9]\d*$/),
    /** Use native SOL instead of wrapped SOL when buying or selling SOL. Default is true. */
    useNativeSOL: z.optional(z.boolean()),
    /** DFlow network public key identifying the order flow source. */
    orderFlowSource: z.string(),
    /** The order flow source's endorsement of this quote request. */
    endorsement: schemaEndorsement,
    /** (Optional) The fee payer for the transaction. If unspecified and the order flow source has
     * multiple auctions with different fee payer modes that match the request, the signatory server
     * will determine which fee payer mode to use. */
    feePayer: z.optional(schemaFeePayer),
});

export type SignatoryRequestIdentifier = z.infer<typeof schemaSignatoryRequestID>;
export const schemaSignatoryRequestID = z.object({
    /** Base64-encoded Ed25519 signature of
     *  `"{id},{retailTrader},{notional},{auctionId},{auctionEpoch},{marketMakerURL},{quoteId},
     *    ,{endorsement},{lastValidBlockHeight},{lastAllowedBlockHeight},{tx}"` */
    signature: z.string(),
    /** Unique identifier for the request. */
    id: z.string(),
    retailTrader: z.string(),
    notional: z.number(),
    auctionId: z.number(),
    auctionEpoch: z.number(),
    marketMakerURL: z.string(),
    quoteId: z.string(),
    endorsement: schemaEndorsement,
    lastValidBlockHeight: z.number(),
    lastAllowedBlockHeight: z.number(),
    tx: z.string(),
}).passthrough();

export type FirmQuoteOkResponse = z.infer<typeof schemaFirmQuoteOkResponse>;
export const schemaFirmQuoteOkResponse = z.object({
    type: z.literal(FirmQuoteResponseType.Ok),
    data: z.object({
        /** The Base64-encoded transaction. The client must not override the blockhash included in
         * this transaction. */
        tx: z.string(),
        /** Minimum lamports balance required in the retail trader's wallet for the transaction to
         * be processed. */
        txRequiredLamports: z.number(),
        /** Solana transaction fee paid by the retail trader. */
        solanaTransactionFee: z.number(),
        /** Refundable token account deposit paid by the retail trader to create an associated token
         * account for the token that the retail trader is receiving. This is required by Solana and
         * is returned to the retail trader if the retail trader closes the token account. */
        tokenAccountRentDeposit: z.number(),
        /** The last valid block height to use when confirming the transaction. */
        lastValidBlockHeight: z.number(),
        /** The last block height at which the transaction can be sent via sendTransaction. */
        lastAllowedBlockHeight: z.number(),
        /** The commitment level that the signatory server will use when querying the block height
         * to determine whether the lastAllowedBlockHeight has passed. Clients should use this
         * commitment level when querying and comparing the current block height to the
         * lastAllowedBlockHeight. */
        blockHeightQueryCommitment: z.string(),
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
            /** Base58-encoded SPL mint of the token in which the platform fee will be paid */
            mint: z.string(),
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

export type SendTransactionRequest = z.infer<typeof schemaSendTransactionRequest>;
export const schemaSendTransactionRequest = z.object({
    /** The Base64-encoded transaction, signed by the retail trader. */
    tx: z.string(),
    /** The requestId from the firm quote response */
    requestId: schemaSignatoryRequestID,
});

export enum SendTransactionResponseType {
    /** Transaction was sent to the network */
    Sent = "Sent",
    /** Transaction was not sent to the network */
    NotSent = "NotSent",
}

export type SendTransactionResponseSent = z.infer<typeof schemaSendTransactionResponseSent>;
export const schemaSendTransactionResponseSent = z.object({
    type: z.literal(SendTransactionResponseType.Sent),
    data: z.object({
        /** Solana transaction signature */
        signature: z.string(),
    }),
});

export type SendTransactionResponseNotSent = z.infer<typeof schemaSendTransactionResponseNotSent>;
export const schemaSendTransactionResponseNotSent = z.object({
    type: z.literal(SendTransactionResponseType.NotSent),
});

export type SendTransactionResponse = z.infer<typeof schemaSendTransactionResponse>;
export const schemaSendTransactionResponse = z.discriminatedUnion("type", [
    schemaSendTransactionResponseSent,
    schemaSendTransactionResponseNotSent,
]);
