import { liquidityUnavailableReason } from "../../common";
import { schemaEndorsement } from "../../endorsement";
import { schemaPaymentInLieuToken } from "../../paymentInLieu";
import { z } from "zod";

export type IndicativeQuoteRequest = z.infer<typeof schemaIndicativeQuoteRequest>;
export const schemaIndicativeQuoteRequest = z.object({
    chainId: z.number(),
    /** Address of the ERC-20 token sent by the retail trader. */
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
        allowanceTarget: z.string(),
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

export enum SponsoredSwapFeeMode {
    /** Retail trader pays the transaction fee using the send token */
    RTSend = 0,
    /** Retail trader pays the transaction fee using the receive token */
    RTRecv = 1,
    /** Retail trader pays the transaction fee using the send token then using the receive token */
    // RTSendThenRTRecv = 2,
}

export type FeeModeRTSend = z.infer<typeof schemaFeeModeRTSend>;
export const schemaFeeModeRTSend = z.object({
    mode: z.literal(SponsoredSwapFeeMode.RTSend),
    /** Max allowed transaction fee reimbursement in RT send token.
     * Specified as a scaled integer. */
    maxAllowedSend: z.string().regex(/^0$|^[1-9]\d*$/),
});

export type FeeModeRTRecv = z.infer<typeof schemaFeeModeRTRecv>;
export const schemaFeeModeRTRecv = z.object({
    mode: z.literal(SponsoredSwapFeeMode.RTRecv),
    /** Max allowed transaction fee reimbursement in RT send token.
     * Specified as a scaled integer.
     * Only used if the settlement call fails. */
    maxAllowedSend: z.string().regex(/^0$|^[1-9]\d*$/),
    /** Max allowed transaction fee reimbursement in RT recv token.
     * Specified as a scaled integer. */
    maxAllowedRecv: z.string().regex(/^0$|^[1-9]\d*$/),
});

export type FeeMode = z.infer<typeof schemaFeeMode>;
export const schemaFeeMode = z.discriminatedUnion("mode", [
    schemaFeeModeRTSend,
    schemaFeeModeRTRecv,
]);

export type FirmQuoteRequest = z.infer<typeof schemaFirmQuoteRequest>;
export const schemaFirmQuoteRequest = z.object({
    chainId: z.number(),
    /** Address of the ERC-20 token sent by the retail trader. */
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
    /** The sponsored swap fee mode. */
    feeMode: schemaFeeMode,
});

export enum FirmQuoteResponseType {
    /** Transaction must be sent via signatory server sendTransaction endpoint */
    Ok = "Ok",
    /** Liquidity is unavailable, and payment in lieu is offered */
    PaymentInLieu = "PaymentInLieu",
    /** Liquidity is unavailable, and payment in lieu is not offered */
    Unavailable = "Unavailable",
}

export type Order = z.infer<typeof schemaOrder>;
export const schemaOrder = z.object({
    nonce: z.string(),
    maxAllowedSend: z.string(),
    maxAllowedRecv: z.string(),
    mode: z.string(),
    platformFeeReceiver: z.string(),
    platformFee: z.string(),
    sendPerGwei: z.string(),
    recvPerGwei: z.string(),
    unwrapNativeToken: z.boolean(),
    innerCalldata: z.string(),
});

export type SignatoryRequestIdentifier = z.infer<typeof schemaSignatoryRequestID>;
export const schemaSignatoryRequestID = z.object({
    /** Base64-encoded Ed25519 signature of
     *  `"{id},{retailTrader},{sendToken},{sendQty},{notional},{auctionId},{auctionEpoch}
     *    ,{marketMakerURL},{quoteId},{allowanceTarget},{chainId},{endorsement}
     *    ,{lastAllowedBlockTimestamp}
     *    ,{order.nonce},{order.maxAllowedSend},{order.maxAllowedRecv},{order.mode}
     *    ,{order.platformFeeReceiver},{order.platformFee},{order.sendPerGwei},{order.recvPerGwei}
     *    ,{order.unwrapNativeToken},{order.innerCalldata}"`. */
    signature: z.string(),
    /** Unique identifier for the request. */
    id: z.string(),
    retailTrader: z.string(),
    sendToken: z.string(),
    sendQty: z.string(),
    notional: z.number(),
    auctionId: z.number(),
    auctionEpoch: z.number(),
    marketMakerURL: z.string(),
    quoteId: z.string(),
    allowanceTarget: z.string(),
    chainId: z.number(),
    endorsement: schemaEndorsement,
    lastAllowedBlockTimestamp: z.number(),
    order: schemaOrder,
}).passthrough();

const schemaEip712Domain = z.object({
    name: z.string(),
    version: z.string(),
    chainId: z.number(),
    verifyingContract: z.string(),
});
const schemaTypedDataField = z.object({
    name: z.string(),
    type: z.string(),
});

export type EIP712Order = z.infer<typeof schemaEIP712Order>;
export const schemaEIP712Order = z.object({
    domain: schemaEip712Domain,
    types: z.object({
        TransactionFeeReimbursement: z.array(schemaTypedDataField),
    }),
    value: schemaOrder,
});

export type FirmQuoteOkResponse = z.infer<typeof schemaFirmQuoteOkResponse>;
export const schemaFirmQuoteOkResponse = z.object({
    type: z.literal(FirmQuoteResponseType.Ok),
    data: z.object({
        /** The order object. The client must call sendTransaction with the EIP-712 signature of
         * this object to submit the swap. */
        order: schemaEIP712Order,
        /** The contract address for which the retail trader needs to have an allowance for the send
         * token for the transaction to be processed. */
        allowanceTarget: z.string(),
        /** The last block timestamp at which the transaction can be processed. */
        lastValidBlockTimestamp: z.number(),
        /** The last block timestamp at which the transaction can be sent via sendTransaction. */
        lastAllowedBlockTimestamp: z.number(),
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

export type OrderSignature = z.infer<typeof schemaOrderSignature>;
export const schemaOrderSignature = z.object({
    domain: schemaEip712Domain,
    types: z.object({
        Order: z.array(schemaTypedDataField),
    }),
    value: schemaOrder,
});

export type SendTransactionRequest = z.infer<typeof schemaSendTransactionRequest>;
export const schemaSendTransactionRequest = z.object({
    /** Hex-encoded EIP-712 signature of the order object. Must start with "0x". */
    orderSignature: z.string(),
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
        /** EVM network transaction hash */
        txHash: z.string(),
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
