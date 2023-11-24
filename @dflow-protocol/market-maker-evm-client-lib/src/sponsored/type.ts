import { schemaEndorsement } from "@dflow-protocol/signatory-client-lib";
import { SponsoredSwapFeeMode } from "@dflow-protocol/signatory-client-lib/evm/sponsored";
import { schemaAddress, schemaRFQOrderSignature } from "../common";
import { z } from "zod";

export type IndicativeQuoteGetQuery = z.infer<typeof schemaIndicativeQuoteGetQuery>;
export const schemaIndicativeQuoteGetQuery = z.object({
    /** Address of the ERC-20 token that the retail trader is sending */
    sendToken: schemaAddress,
    /** Address of the ERC-20 token that the retail trader is receiving */
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
    /** Address of the ERC-20 token that the retail trader is sending. This is the `takerToken`
     * used to construct the 0x RFQ order. */
    sendToken: schemaAddress,
    /** Address of the ERC-20 token that the retail trader is receiving. This is the `makerToken`
     * used to construct the 0x RFQ order. */
    receiveToken: schemaAddress,
    /** Send quantity specified as a scaled integer */
    sendQty: z.string().regex(/^[1-9]\d*$/),
    /** Minimum allowed fill quantity specified as a scaled integer */
    minFillQty: z.string().regex(/^0$|^[1-9]\d*$/),
    /** Address of the retail trader's wallet */
    retailTrader: schemaAddress,
    endorsement: schemaEndorsement,
    /** `taker` to use when constructing the 0x RFQ order */
    taker: schemaAddress,
    /** Minimum allowed `expiry` for the 0x RFQ order. Number of seconds since
     * Jan 1, 1970 00:00:00 UTC. */
    minExpiry: z.number(),
    /** `chainId` to use when constructing the 0x RFQ order */
    chainId: z.number(),
    /** `verifyingContract` to use when constructing the 0x RFQ order */
    verifyingContract: schemaAddress,
    /** Reimbursement mode */
    reimbursementMode: z.nativeEnum(SponsoredSwapFeeMode),
    /** Max allowed transaction fee reimbursement in `sendToken`.
     * Specified as a scaled integer. */
    maxReimbursementSend: z.string().regex(/^0$|^[1-9]\d*$/),
    /** Max allowed transaction fee reimbursement in `receiveToken`.
     * Specified as a scaled integer. */
    maxReimbursementRecv: z.string().regex(/^0$|^[1-9]\d*$/),
    /** Exchange rate used to calculate reimbursement in `sendToken` */
    reimbursementSendPerGwei: z.string().regex(/^0$|^[1-9]\d*$/),
    /** Exchange rate used to calculate reimbursement in `receiveToken` */
    reimbursementRecvPerGwei: z.string().regex(/^0$|^[1-9]\d*$/),
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
     * `minFillQty`. */
    fillQty: z.string().regex(/^0$|^[1-9]\d*$/),
    /** Address of the market maker's wallet. This is the signer of the 0x RFQ order. This is the
     * `maker` used to construct the 0x RFQ order. */
    maker: schemaAddress,
    /** Address of the tx origin. This is the address of the EOA that will send the transaction and
     * pay for gas. If sending transactions from multiple EOAs, this is the address of the EOA that
     * was used to register the allowed EOAs via registerAllowedRfqOrigins. See
     * https://docs.0xprotocol.org/en/latest/basics/functions.html#registerallowedrfqorigins */
    txOrigin: schemaAddress,
    /** `expiry` used to construct the 0x RFQ order. Formatted as a hex string. */
    expiry: z.string().regex(/^[0-9a-fA-F]+$/),
    /** `salt` used to construct the 0x RFQ order. Formatted as a hex string. */
    salt: z.string().regex(/^[0-9a-fA-F]+$/),
    /** Market maker's signature of the 0x RFQ order */
    rfqOrderSignature: schemaRFQOrderSignature,
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

export type TransactionInfo = z.infer<typeof schemaTransactionInfo>;
export const schemaTransactionInfo = z.object({
    chainId: z.number(),
    to: z.string(),
    data: z.string(),
});

export type SendTransactionPostRequest = z.infer<typeof schemaSendTransactionPostRequest>;
export const schemaSendTransactionPostRequest = z.object({
    tx: schemaTransactionInfo,
    quoteId: z.string(),
    auctionId: z.string(),
    auctionEpoch: z.string(),
});

export enum SendTransactionResponseCode {
    /** Transaction was sent to the network */
    Sent = 0,
    /** Transaction was not sent to the network */
    NotSent = 1,
}

export type SendTransactionResponseSent = z.infer<typeof schemaSendTransactionResponseSent>;
export const schemaSendTransactionResponseSent = z.object({
    code: z.literal(SendTransactionResponseCode.Sent),
    /** Transaction hash */
    txHash: z.string(),
});

export type SendTransactionResponseNotSent = z.infer<typeof schemaSendTransactionResponseNotSent>;
export const schemaSendTransactionResponseNotSent = z.object({
    code: z.literal(SendTransactionResponseCode.NotSent),
});

export type SendTransactionPostResponse = z.infer<typeof schemaSendTransactionPostResponse>;
export const schemaSendTransactionPostResponse = z.discriminatedUnion("code", [
    schemaSendTransactionResponseSent,
    schemaSendTransactionResponseNotSent,
]);
