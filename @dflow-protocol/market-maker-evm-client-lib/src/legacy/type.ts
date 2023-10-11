import { schemaEndorsement } from "@dflow-protocol/signatory-client-lib";
import { schemaRFQOrderSignature } from "../common";
import { z } from "zod";

export type IndicativeQuoteGetQuery = z.infer<typeof schemaIndicativeQuoteGetQuery>;
export const schemaIndicativeQuoteGetQuery = z.object({
    /** Address of the ERC-20 token that the retail trader is sending */
    sendToken: z.string(),
    /** Address of the ERC-20 token that the retail trader is receiving */
    receiveToken: z.string(),
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
    sendToken: z.string(),
    /** Address of the ERC-20 token that the retail trader is receiving. This is the `makerToken`
     * used to construct the 0x RFQ order. */
    receiveToken: z.string(),
    /** Send quantity specified as a scaled integer */
    sendQty: z.string().regex(/^[1-9]\d*$/),
    /** Minimum allowed fill quantity specified as a scaled integer */
    minFillQty: z.string().regex(/^0$|^[1-9]\d*$/),
    /** Address of the retail trader's wallet */
    retailTrader: z.string(),
    endorsement: schemaEndorsement,
    /** `taker` to use when constructing the 0x RFQ order */
    taker: z.string(),
    /** `txOrigin` to use when constructing the 0x RFQ order */
    txOrigin: z.string(),
    /** Minimum allowed `expiry` for the 0x RFQ order. Number of seconds since
     * Jan 1, 1970 00:00:00 UTC. */
    minExpiry: z.number(),
    /** `chainId` to use when constructing the 0x RFQ order */
    chainId: z.number(),
    /** `verifyingContract` to use when constructing the 0x RFQ order */
    verifyingContract: z.string(),
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
    maker: z.string().regex(/^0x[0-9a-fA-F]+$/),
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
