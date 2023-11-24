import { z } from "zod";

export type MarketMakerEVMConfig = z.infer<typeof marketMakerEVMConfig>;
export const marketMakerEVMConfig = z.object({
    keypairPath: z.string(),
    standardSwapContractAddress: z.string(),
    chains: z.array(z.object({
        auctionNetwork: z.string(),
        rpcURL: z.string(),
    })),
});

export type MarketMakerConfig = z.infer<typeof marketMakerConfig>;
export const marketMakerConfig = z.object({
    dflowApiURL: z.string(),
    dflowRpcURL: z.string(),

    solanaURL: z.string(),
    solanaCommitment: z.union([
        z.literal("processed"),
        z.literal("confirmed"),
        z.literal("finalized"),
    ]),

    bridgeMint: z.string(),
    bridgeProgramID: z.string(),
    initialFunding: z.optional(z.number().int().nonnegative()),

    bidSize: z.number().int().nonnegative(),

    /** If specified, the market maker will only bid in these auctions */
    auctions: z.optional(z.array(z.number())),

    dflowKeypairMnemonicPath: z.string(),
    solanaKeypairPath: z.string(),

    evm: z.optional(marketMakerEVMConfig),

    marketMakerURL: z.string(),

    /** Optional server settings */
    server: z.optional(z.object({
        /** Server port */
        port: z.optional(z.number().int().positive()),
        /** Keep alive timeout in seconds */
        keepAliveTimeout: z.optional(z.number().positive()),
    })),
});
