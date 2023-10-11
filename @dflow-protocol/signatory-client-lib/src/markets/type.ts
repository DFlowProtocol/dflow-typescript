import { schemaFeePayer } from "../solana";
import { z } from "zod";

export type MarketsRequest = z.infer<typeof schemaMarketsRequest>;
/** Gets markets supported by the specified order flow source and the signatory server */
export const schemaMarketsRequest = z.object({
    /** DFlow network public key identifying the order flow source. */
    orderFlowSource: z.string(),
    /** If set to true, response will include markets with no liquidity */
    includeNoLiquidity: z.optional(z.string()),
});

const commonMarketDetails = {
    /** Token that the retail trader sends */
    sendToken: z.string(),
    /** Token that the retail trader receives */
    receiveToken: z.string(),
    /** The USD-denominated minimum order size (inclusive) */
    minOrderSizeUsd: z.number(),
    /** The USD-denominated minimum order size (exclusive) */
    maxOrderSizeUsd: z.number(),
    /** Boolean indicating whether or not the range has liquidity. Ranges without liquidity are only
     * included if `includeNoLiquidity` was set to true in the request. */
    hasLiquidity: z.boolean(),
};

export type EvmMarket = z.infer<typeof schemaEvmMarket>;
export const schemaEvmMarket = z.object({
    network: z.custom<`evm${number}`>(val => typeof val === "string" && /^evm[0-9]+$/.test(val)),
    /** Boolean indicating whether this is a sponsored swap market */
    isSponsoredSwap: z.boolean(),
    ...commonMarketDetails,
});

export type SolanaMarket = z.infer<typeof schemaSolanaMarket>;
export const schemaSolanaMarket = z.object({
    network: z.literal("solana"),
    /** The Solana transaction fee payer */
    feePayer: schemaFeePayer,
    ...commonMarketDetails,
});

export type Market = z.infer<typeof schemaMarket>;
export const schemaMarket = z.union([
    schemaEvmMarket,
    schemaSolanaMarket,
]);

export type MarketsResponse = z.infer<typeof schemaMarketsResponse>;
export const schemaMarketsResponse = z.array(schemaMarket);
