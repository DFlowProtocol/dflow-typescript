import {
    AuctionAuctionGridDataRow,
    AuctionBidInfo,
    AuctionBlindBid,
    AuctionOrderFlowAuction,
} from "@dflow-protocol/client-core/dist/dflow.auction/rest";
import { AccountInfo } from "./accountInfo";


export class AuctionInfo extends AccountInfo<AuctionOrderFlowAuction> {
    get ofsPublicKey(): string {
        if (this.data.ofsPublicKey === undefined) {
            throw new Error("ofsPublicKey undefined");
        }
        return this.data.ofsPublicKey;
    }
    get auctionId(): bigint {
        if (this.data.auctionId === undefined) {
            throw new Error("auctionId undefined");
        }
        return BigInt(this.data.auctionId);
    }
    get clientAuctionId(): string {
        if (this.data.clientAuctionId === undefined) {
            throw new Error("clientAuctionId undefined");
        }
        return this.data.clientAuctionId;
    }
    get baseCurrency(): string {
        if (this.data.baseCurrency === undefined) {
            throw new Error("baseCurrency undefined");
        }
        return this.data.baseCurrency;
    }
    get quoteCurrency(): string {
        if (this.data.quoteCurrency === undefined) {
            throw new Error("quoteCurrency undefined");
        }
        return this.data.quoteCurrency;
    }
    get minimumOrderSize(): bigint {
        if (this.data.minimumOrderSize === undefined) {
            throw new Error("minimumOrderSize undefined");
        }
        return BigInt(this.data.minimumOrderSize);
    }
    get maximumOrderSize(): bigint {
        if (this.data.maximumOrderSize === undefined) {
            throw new Error("maximumOrderSize undefined");
        }
        return BigInt(this.data.maximumOrderSize);
    }
    get notionalSize(): bigint {
        if (this.data.notionalSize === undefined) {
            throw new Error("notionalSize undefined");
        }
        return BigInt(this.data.notionalSize);
    }
    get maxDeliveryPeriod(): bigint {
        if (this.data.maxDeliveryPeriod === undefined) {
            throw new Error("maxDeliveryPeriod undefined");
        }
        return BigInt(this.data.maxDeliveryPeriod);
    }
    get deliveredNotionalSize(): bigint {
        if (this.data.deliveredNotionalSize === undefined) {
            throw new Error("deliveredNotionalSize undefined");
        }
        return BigInt(this.data.deliveredNotionalSize);
    }
    get lifetimeDeliveredNotionalSize(): bigint {
        if (this.data.lifetimeDeliveredNotionalSize === undefined) {
            throw new Error("lifetimeDeliveredNotionalSize undefined");
        }
        return BigInt(this.data.lifetimeDeliveredNotionalSize);
    }
    get paymentInLieuDeliveredNotionalSize(): bigint {
        if (this.data.paymentInLieuDeliveredNotionalSize === undefined) {
            throw new Error("paymentInLieuDeliveredNotionalSize undefined");
        }
        return BigInt(this.data.paymentInLieuDeliveredNotionalSize);
    }
    get paymentInLieuLifetimeDeliveredNotionalSize(): bigint {
        if (this.data.paymentInLieuLifetimeDeliveredNotionalSize === undefined) {
            throw new Error("paymentInLieuLifetimeDeliveredNotionalSize undefined");
        }
        return BigInt(this.data.paymentInLieuLifetimeDeliveredNotionalSize);
    }
    get feePayerMode(): SolanaFeePayerMode {
        if (this.data.feePayerMode === undefined) {
            throw new Error("feePayerMode undefined");
        }
        return this.data.feePayerMode;
    }
    get isPaymentInLieuEnabled(): boolean {
        if (this.data.isPaymentInLieuEnabled === undefined) {
            throw new Error("isPaymentInLieuEnabled undefined");
        }
        return this.data.isPaymentInLieuEnabled;
    }
    get isUnidirectional(): boolean {
        if (this.data.isUnidirectional === undefined) {
            throw new Error("isUnidirectional undefined");
        }
        return this.data.isUnidirectional;
    }
    get extensions(): string {
        if (this.data.extensions === undefined) {
            throw new Error("extensions undefined");
        }
        return this.data.extensions;
    }
    get network(): string {
        if (this.data.network === undefined) {
            throw new Error("network undefined");
        }
        return this.data.network;
    }
    get epoch(): bigint {
        if (this.data.epoch === undefined) {
            throw new Error("epoch undefined");
        }
        return BigInt(this.data.epoch);
    }
    get blindBidEndTimestamp() {
        if (this.data.blindBidEndTimestamp === undefined) {
            throw new Error("blindBidEndTimestamp undefined");
        }
        return BigInt(this.data.blindBidEndTimestamp);
    }
    get blindBidEndNotionalTime(): bigint {
        if (this.data.blindBidEndNotionalTime === undefined) {
            throw new Error("blindBidEndNotionalTime undefined");
        }
        return BigInt(this.data.blindBidEndNotionalTime);
    }
    get leader(): AuctionBidInfo | null {
        if (this.data.leader === undefined) {
            throw new Error("leader undefined");
        }
        if (this.data.leader === null) {
            return null;
        }
        if (this.data.leader.marketMakerPublicKey === undefined) {
            throw new Error("marketMakerPublicKey undefined");
        }
        if (this.data.leader.marketMakerUrl === undefined) {
            throw new Error("marketMakerUrl undefined");
        }
        if (this.data.leader.bid === undefined) {
            throw new Error("bid undefined");
        }
        return this.data.leader;
    }
    get winner(): AuctionBidInfo | null {
        if (this.data.winner === undefined) {
            throw new Error("winner undefined");
        }
        if (this.data.winner === null) {
            return null;
        }
        if (this.data.winner.marketMakerPublicKey === undefined) {
            throw new Error("marketMakerPublicKey undefined");
        }
        if (this.data.winner.marketMakerUrl === undefined) {
            throw new Error("marketMakerUrl undefined");
        }
        if (this.data.winner.bid === undefined) {
            throw new Error("bid undefined");
        }
        return this.data.winner;
    }
    get blindBids(): AuctionBlindBid[] {
        if (this.data.blindBids === undefined) {
            throw new Error("blindBids undefined");
        }
        return this.data.blindBids;
    }

    get epochCutoffTimestamp() {
        return this.blindBidEndTimestamp + this.maxDeliveryPeriod * BigInt(3) / BigInt(10);
    }

    isValidNotional(notional: number) {
        // Auction notional sizes are specified with two decimals
        const scaledNotional = notional * 100;
        return this.minimumOrderSize <= scaledNotional && scaledNotional < this.maximumOrderSize;
    }

    /** Parsed extensions or null if extensions fail to parse */
    get parsedExtensions(): Extensions | null {
        return AuctionInfo.parseExtensions(this.extensions);
    }

    /** Returns parsed extensions or null if extensions fail to parse */
    static parseExtensions(extensions: string): Extensions | null {
        try {
            return JSON.parse(extensions);
        } catch {
            return null;
        }
    }

    get isSponsoredSwap(): boolean {
        return false;
    }
}

type Extensions = {
    // TODO
}

function bigIntOrUndefined(field: string | number | undefined) {
    if (field === undefined) {
        return undefined;
    }
    return BigInt(field);
}

export class AuctionGridDataRow extends AccountInfo<AuctionAuctionGridDataRow> {
    get ofsPublicKey(): string | undefined {
        return this.data.ofsPublicKey;
    }
    get auctionId(): bigint | undefined {
        return bigIntOrUndefined(this.data.auctionId);
    }
    get clientAuctionId(): string | undefined {
        return this.data.clientAuctionId;
    }
    get baseCurrency(): string | undefined {
        return this.data.baseCurrency;
    }
    get quoteCurrency(): string | undefined {
        return this.data.quoteCurrency;
    }
    get minimumOrderSize(): bigint | undefined {
        return bigIntOrUndefined(this.data.minimumOrderSize);
    }
    get maximumOrderSize(): bigint | undefined {
        return bigIntOrUndefined(this.data.maximumOrderSize);
    }
    get notionalSize(): bigint | undefined {
        return bigIntOrUndefined(this.data.notionalSize);
    }
    get maxDeliveryPeriod(): bigint | undefined {
        return bigIntOrUndefined(this.data.maxDeliveryPeriod);
    }
    get deliveredNotionalSize(): bigint | undefined {
        return bigIntOrUndefined(this.data.deliveredNotionalSize);
    }
    get lifetimeDeliveredNotionalSize(): bigint | undefined {
        return bigIntOrUndefined(this.data.lifetimeDeliveredNotionalSize);
    }
    get paymentInLieuDeliveredNotionalSize(): bigint | undefined {
        return bigIntOrUndefined(this.data.paymentInLieuDeliveredNotionalSize);
    }
    get paymentInLieuLifetimeDeliveredNotionalSize(): bigint | undefined {
        return bigIntOrUndefined(this.data.paymentInLieuLifetimeDeliveredNotionalSize);
    }
    get feePayerMode(): number | undefined {
        return this.data.feePayerMode;
    }
    get isPaymentInLieuEnabled(): boolean | undefined {
        return this.data.isPaymentInLieuEnabled;
    }
    get isUnidirectional(): boolean | undefined {
        return this.data.isUnidirectional;
    }
    get extensions(): string | undefined {
        return this.data.extensions;
    }
    get network(): string | undefined {
        return this.data.network;
    }
    get epoch(): bigint | undefined {
        return bigIntOrUndefined(this.data.epoch);
    }
    get epochCutoffTimestamp(): bigint | undefined {
        return bigIntOrUndefined(this.data.epochCutoffTimestamp);
    }
    get blindBidEndTimestamp(): bigint | undefined {
        return bigIntOrUndefined(this.data.blindBidEndTimestamp);
    }
    get blindBidEndNotionalTime(): bigint | undefined {
        return bigIntOrUndefined(this.data.blindBidEndNotionalTime);
    }
    get leader(): AuctionBidInfo | null {
        if (!this.data.leader) {
            return null;
        }
        return this.data.leader;
    }
    get winner(): AuctionBidInfo | null {
        if (!this.data.winner) {
            return null;
        }
        return this.data.winner;
    }
    get blindBids(): AuctionBlindBid[] | undefined {
        return this.data.blindBids;
    }
    get hasOverlap(): boolean | undefined {
        return this.data.overlap?.hasOverlap;
    }

    /** Parsed extensions or null if extensions fail to parse */
    get parsedExtensions(): Extensions | null {
        if (!this.extensions) {
            return null;
        }
        return AuctionInfo.parseExtensions(this.extensions);
    }

    get isSponsoredSwap(): boolean {
        return false;
    }
}

export type AuctionCreateTemplate = EvmAuctionCreateTemplate | SolanaAuctionCreateTemplate

export type BaseAuctionCreateTemplate = {
    /** The max delivery period in milliseconds */
    maxDeliveryPeriod: number
    /** The minimum notional size of the order in USD. Scaled integer with two decimals. */
    minimumOrderSize: number
    /** The maximum notional size of the order in USD. Scaled integer with two decimals. */
    maximumOrderSize: number
    /** The total notional size being delivered by the auction in USD. Scaled integer with two
     * decimals. */
    notionalSize: number
    /** The order flow source's identifier for the auction */
    clientAuctionId: string
    /** The base currency in the token pair. For unidirectional auctions, this is the currency that
     * retail sends. */
    baseCurrency: string
    /** The quote currency in the token pair. For unidirectional auctions, this is the currency that
     * retail receives. */
    quoteCurrency: string
    /** A boolean indicating whether payment in lieu is enabled for the auction */
    isPaymentInLieuEnabled: boolean
    /** A boolean indicating whether the auction is unidirectional */
    isUnidirectional: boolean
    extensions: string
}

export type EvmAuctionCreateTemplate = BaseAuctionCreateTemplate & {
    network: EvmNetwork
    /** The fee payer mode for settlement transactions */
    feePayerMode: EvmFeePayerMode
}

export type SolanaAuctionCreateTemplate = BaseAuctionCreateTemplate & {
    network: SolanaNetwork
    /** The fee payer mode for settlement transactions */
    feePayerMode: SolanaFeePayerMode
}

export enum EvmFeePayerMode {
    Legacy = 0,
    Sponsored = 1,
}

export enum SolanaFeePayerMode {
    /** Retail trader pays the Solana transaction fee */
    RETAIL_TRADER = 0,
    /** Market maker pays the Solana transaction fee */
    MARKET_MAKER = 1,
}

export type EvmNetwork =
    "evm1"  // Ethereum
    | "evm137"  // Polygon
    | "evm42161"  // Arbitrum
    | "evm10"  // Optimism
    | "evm56"  // BSC
    | "evm8453"  // Base

export type SolanaNetwork = "solana"

export type Network = EvmNetwork | SolanaNetwork;

export type AuctionModuleParams = {
    /** The cost to create an auction as a scaled integer */
    auctionCost: number
    /** The minimum valid maxDeliveryPeriod */
    minDeliveryPeriod: number
    /** The maximum allowed endorsement expiration time in seconds relative to when deliver notional
     * is called. Endorsements should not be issued with longer expiration times than this. */
    endorsementMaxRelativeExpiration: number
    /** A grace period in seconds added to the maximum allowed expiration time when checking the
     * maximum expiration time of an endorsement. This can be used to ensure that endorsements are
     * not wrongly rejected due to lag in block timestamps. */
    endorsementMaxRelativeExpirationGrace: number
}
