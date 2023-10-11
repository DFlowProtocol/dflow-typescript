import { schemaEndorsement } from "@dflow-protocol/signatory-client-lib";
import { z } from "zod";

export type IndicativeQuoteGetQuery = z.infer<typeof schemaIndicativeQuoteGetQuery>;
export const schemaIndicativeQuoteGetQuery = z.object({
    /** Base58-encoded address of the SPL mint that the retail trader is sending */
    sendMint: z.string(),
    /** Base58-encoded address of the SPL mint that the retail trader is receiving */
    receiveMint: z.string(),
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
    /** Base58-encoded address of the SPL mint that the retail trader is sending */
    sendMint: z.string(),
    /** Base58-encoded address of the SPL mint that the retail trader is receiving */
    receiveMint: z.string(),
    /** Send quantity specified as a scaled integer */
    sendQty: z.string().regex(/^[1-9]\d*$/),
    /** Minimum allowed fill quantity specified as a scaled integer */
    minFillQty: z.string().regex(/^0$|^[1-9]\d*$/),
    /** True if and only if the retail trader is sending wrapped SOL. Note that even if the retail
     * trader sends wrapped SOL, the market maker receives native SOL. */
    isSendWSOL: z.boolean(),
    /** Base58-encoded address of the retail trader's wallet */
    retailTrader: z.string(),
    transaction: z.object({
        /** Blockhash that will be used to create the transaction */
        blockhash: z.string(),
        /** The last valid block height at which the transaction will be valid */
        lastValidBlockHeight: z.number(),
        /** The last block height at which the retail trader will be allowed to send the
         * transaction */
        lastAllowedBlockHeight: z.number(),
    }),
    endorsement: schemaEndorsement,
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
    /** Base58-encoded address of the market maker's account that will receive the token that the
     * retail trader is sending.
     *
     * If the retail trader is sending SOL or WSOL, this is the address of the market maker's wallet
     * that will receive SOL.
     *
     * If the retail trader is sending WSOL, this account must sign the transaction when processing
     * a send transaction request, and the transaction will close this account's associated token
     * account for WSOL, unwrapping the WSOL received from the retail trader and any WSOL that was
     * in the account prior to the transaction. If the retail trader is sending WSOL, this account
     * must hold enough SOL to meet the rent-exempt minimum for a token account at the time the
     * transaction is processed.
     *
     * If the retail trader is sending any token other than SOL or WSOL, this is the address of the
     * market maker's SPL token account for the token that the retail trader is sending. */
    xAccount: z.string(),
    /** Base58-encoded address of the market maker's account that will send the token that the
     * retail trader is receiving.
     *
     * If the retail trader is receiving SOL or WSOL, this is the address of the market maker's
     * wallet that will send SOL, and this account must sign the transaction when processing a send
     * transaction request.
     *
     * If the retail trader is receiving any token other than SOL or WSOL, this is the address of
     * the market maker's SPL token account for the token that the retail trader is receiving.
     *
     * If the retail trader is sending WSOL and the auction specifies the retail trader as the fee
     * payer, this SPL token account must be owned by the `xAccount` wallet. */
    yAccount: z.string(),
    /** If the retail trader is receiving SOL or WSOL, this field is ignored.
     *
     * If the retail trader is sending WSOL and the auction specifies the retail trader as the fee
     * payer, this field is ignored, and the `yAccount` SPL token account must be owned by the
     * `xAccount` wallet.
     *
     * In all other cases, this field must be specified as the Base58-encoded address of the account
     * that owns the `yAccount` SPL token account, and this account must sign the transaction when
     * processing a send transaction request. */
    yTokenAccountOwner: z.optional(z.string()),
    /** If the auction specifies the market maker as the fee payer, this field must be specified as
     * the Base58-encoded address of the transaction fee payer, and this account must sign the
     * transaction when processing a send transaction request.
     *
     * In all other cases, this field is ignored. */
    feePayer: z.optional(z.string()),
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

export type SendTransactionPostRequest = z.infer<typeof schemaSendTransactionPostRequest>;
export const schemaSendTransactionPostRequest = z.object({
    /** Base64-encoded transaction */
    tx: z.string(),
    /** The last valid block height to use when confirming the transaction */
    lastValidBlockHeight: z.number(),
    quoteId: z.string(),
    auctionId: z.string().regex(/^0$|^[1-9]\d*$/),
    auctionEpoch: z.string().regex(/^0$|^[1-9]\d*$/),
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
    /** Transaction signature */
    signature: z.string(),
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
