import { getContractAddressesForChainOrThrow } from "@0x/contract-addresses";
import { AuctionInfo } from "@dflow-protocol/client";
import { isSafeInteger } from "./coding";
import { ethers } from "ethers";
import { EVMLegacyStrategy } from "./lib/evm/legacyStrategy";
import { EVMSponsoredStrategy } from "./lib/evm/sponsoredStrategy";
import { ISolanaStrategy } from "./lib/solana/strategy";
import { Logger } from "./logger";

export class MarketMakerAPIContext {
    readonly logger: Logger

    constructor() {
        this.logger = new Logger();
    }
}

export class MarketMakerAPISolanaContext {
    readonly strategy: ISolanaStrategy

    constructor(strategy: ISolanaStrategy) {
        this.strategy = strategy;
    }
}

type MarketMakerEVMChainContextParams = {
    auctionNetwork: string
    rpcURL: string
    provider: ethers.Provider
    wallet: ethers.Wallet
}

export class MarketMakerEVMChainContext {
    auctionNetwork: string
    rpcURL: string
    chainId: number
    provider: ethers.Provider
    wallet: ethers.Wallet
    zeroExExchangeProxyAddress: string
    wethContractAddress: string

    constructor(params: MarketMakerEVMChainContextParams) {
        this.auctionNetwork = params.auctionNetwork;
        this.rpcURL = params.rpcURL;
        this.provider = params.provider;
        this.wallet = params.wallet;
        this.chainId = parseInt(this.auctionNetwork.substring(3));
        const contractAddresses = getContractAddressesForChainOrThrow(this.chainId);
        this.zeroExExchangeProxyAddress = contractAddresses.exchangeProxy;
        this.wethContractAddress = contractAddresses.etherToken;
    }

    async validate(): Promise<void> {
        const networkInfo = await this.provider.getNetwork();
        const rpcChainId = Number(networkInfo.chainId);
        if (!isSafeInteger(rpcChainId)) {
            throw new Error(
                `Chain ID ${networkInfo.chainId} from ${this.rpcURL} cannot be safely represented`
                + ` as a JavaScript number`
            );
        }
        if (rpcChainId !== this.chainId) {
            throw new Error(
                `RPC chain ID ${rpcChainId} !== expected chain ID ${this.chainId}`
                + ` for ${this.rpcURL}`
            );
        }
    }
}

export class MarketMakerAPIEVMContext {
    readonly networkToChainContext: Map<string, MarketMakerEVMChainContext>
    readonly auctionIdToChainContext: Map<bigint, MarketMakerEVMChainContext>
    readonly sponsoredStrategy: EVMSponsoredStrategy
    readonly legacyStrategy: EVMLegacyStrategy

    constructor(chainContexts: MarketMakerEVMChainContext[]) {
        if (chainContexts.length === 0) {
            throw new Error("Must include at least one chain context");
        }

        this.networkToChainContext = new Map();
        for (const chainContext of chainContexts) {
            const network = chainContext.auctionNetwork;
            if (this.networkToChainContext.has(network)) {
                throw new Error(`Duplicate chain context for network ${network}`);
            }
            this.networkToChainContext.set(network, chainContext);
        }

        this.auctionIdToChainContext = new Map();
        this.sponsoredStrategy = new EVMSponsoredStrategy();
        this.legacyStrategy = new EVMLegacyStrategy();
    }

    getChainContextByNetwork(network: string): MarketMakerEVMChainContext | undefined {
        return this.networkToChainContext.get(network);
    }

    getChainContextByAuction(auctionId: bigint): MarketMakerEVMChainContext | undefined {
        return this.auctionIdToChainContext.get(auctionId);
    }

    hasChainContext(auction: AuctionInfo): boolean {
        return this.getChainContextByAuction(auction.auctionId) !== undefined;
    }

    registerChainContext(auction: AuctionInfo): void {
        const auctionId = auction.auctionId;
        const network = auction.network;
        if (this.auctionIdToChainContext.has(auctionId)) {
            throw new Error(`Duplicate chain context for auction ID ${auctionId}`);
        }
        const chainContext = this.getChainContextByNetwork(network);
        if (!chainContext) {
            throw new Error(
                `Chain context not found for network ${network}`
                + ` when attempting to register for auction ID ${auctionId}`
            );
        }
        this.auctionIdToChainContext.set(auctionId, chainContext);
    }
}
