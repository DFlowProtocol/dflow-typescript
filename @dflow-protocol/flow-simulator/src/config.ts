import { EvmFeePayerMode, SolanaFeePayerMode } from "@dflow-protocol/client";
import {
    schemaFeePayer as schemaSolanaRequestFeePayer,
} from "@dflow-protocol/signatory-client-lib/solana";
import { z } from "zod";

const evmNetwork = z.union([
    z.literal("evm1"),
    z.literal("evm10"),
    z.literal("evm56"),
    z.literal("evm137"),
    z.literal("evm8453"),
    z.literal("evm42161"),
]);
const solanaNetwork = z.literal("solana");

export type OFSConfig = z.infer<typeof ofsConfigSchema>;
const ofsConfigSchema = z.object({
    extensions: z.optional(z.string()).default(""),
});

const baseAuctionConfig = {
    clientAuctionId: z.string(),
    baseCurrency: z.string(),
    quoteCurrency: z.string(),
    /** Minimum order notional size in USD specified as a fixed number with two decimals */
    minimumOrderSize: z.number(),
    /** Maximum order notional size in USD specified as a fixed number with two decimals */
    maximumOrderSize: z.number(),
    /** Batch notional specified as a fixed number with two decimals */
    notionalSize: z.number(),
    maxDeliveryPeriod: z.number(),
    isPaymentInLieuEnabled: z.optional(z.boolean()).default(true),
    isUnidirectional: z.optional(z.boolean()).default(false),
    extensions: z.optional(z.string()).default(""),
};

const evmFeePayerModeString = z.string().refine(x => {
    const xAsFeePayerModeString = x as keyof typeof EvmFeePayerMode;
    switch(xAsFeePayerModeString) {
        case "Legacy":
        case "Sponsored":
            return true;
        default: {
            const _exhaustiveCheck: never = xAsFeePayerModeString;
            return false;
        }
    }
}).transform(x => EvmFeePayerMode[x as keyof typeof EvmFeePayerMode]);

export type EvmAuctionConfig = z.infer<typeof evmAuctionConfigSchema>;
const evmAuctionConfigSchema = z.object({
    ...baseAuctionConfig,
    feePayerMode: evmFeePayerModeString,
    network: evmNetwork,
});

const solanaFeePayerModeString = z.string().refine(x => {
    const xAsFeePayerModeString = x as keyof typeof SolanaFeePayerMode;
    switch(xAsFeePayerModeString) {
        case "RETAIL_TRADER":
        case "MARKET_MAKER":
            return true;
        default: {
            const _exhaustiveCheck: never = xAsFeePayerModeString;
            return false;
        }
    }
}).transform(x => SolanaFeePayerMode[x as keyof typeof SolanaFeePayerMode]);

export type SolanaAuctionConfig = z.infer<typeof solanaAuctionConfigSchema>;
const solanaAuctionConfigSchema = z.object({
    ...baseAuctionConfig,
    feePayerMode: solanaFeePayerModeString,
    network: solanaNetwork,
});

export type AuctionConfig = z.infer<typeof auctionConfigSchema>;
const auctionConfigSchema = z.union([evmAuctionConfigSchema, solanaAuctionConfigSchema]);

const feeModeRTSendParams = z.object({
    mode: z.literal("RTSend"),
    maxAllowedSend: z.string(),
});
const feeModeRTRecvParams = z.object({
    mode: z.literal("RTRecv"),
    maxAllowedSend: z.string(),
    maxAllowedRecv: z.string(),
});
export type SponsoredSwapParams = z.infer<typeof sponsoredSwapParams>;
const sponsoredSwapParams = z.union([feeModeRTSendParams, feeModeRTRecvParams]);

const baseOrderConfig = {
    id: z.string(),
    sendCurrency: z.string(),
    receiveCurrency: z.string(),
    /** Send qty specified as a real number string */
    sendQty: z.string(),
    /** Interval between subsequent orders in milliseconds */
    interval: z.number(),
    platformFeeBps: z.optional(z.number().nonnegative().int()),
    /** Must be specified if `platformFeeBps` > 0 */
    platformFeeReceiver: z.optional(z.string()),
    /** If true, check balance changes across tx */
    assertBalances: z.optional(z.boolean()),
};

export type EvmOrderConfig = z.infer<typeof evmOrderConfigSchema>;
const evmOrderConfigSchema = z.object({
    ...baseOrderConfig,
    network: evmNetwork,
    sponsoredSwap: z.optional(sponsoredSwapParams),
});

export type SolanaOrderConfig = z.infer<typeof solanaOrderConfigSchema>;
const solanaOrderConfigSchema = z.object({
    ...baseOrderConfig,
    network: solanaNetwork,
    feePayer: z.optional(schemaSolanaRequestFeePayer),
    useNativeToken: z.optional(z.boolean()),
});

export type OrderConfig = z.infer<typeof orderConfigSchema>;
const orderConfigSchema = z.union([evmOrderConfigSchema, solanaOrderConfigSchema]);

export type FlowSimulatorEVMConfig = z.infer<typeof flowSimulatorEVMConfig>;
export const flowSimulatorEVMConfig = z.object({
    keypairPath: z.string(),
    chains: z.array(z.object({
        rpcURL: z.string(),
        wethContractAddress: z.string(),
    })),
});

export type FlowSimulatorConfig = z.infer<typeof flowSimulatorConfigSchema>;
export const flowSimulatorConfigSchema = z.object({
    signatoryServerURL: z.string(),
    endorsementServerURL: z.string(),

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

    ofsDFlowKeypairMnemonicPath: z.string(),
    endorsementKeyPath: z.string(),
    ofsSolanaKeypairPath: z.string(),
    ofsConfig: z.optional(ofsConfigSchema),
    auctions: z.optional(z.array(auctionConfigSchema)),
    orderConfigs: z.optional(z.array(orderConfigSchema)),

    rtSolanaKeypairPath: z.string(),
    evm: z.optional(flowSimulatorEVMConfig),
});
