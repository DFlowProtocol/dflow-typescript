import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { BridgeClient, DFlowClient, DFlowPrefix, Network } from "@dflow-protocol/client";
import { NATIVE_TOKEN_ADDRESS } from "@dflow-protocol/signatory-client-lib/evm";
import { Connection, Keypair } from "@solana/web3.js";
import fs from "fs";
import { Command, Option } from "commander";
import { marketMakerConfig } from "./config";
import {
    MarketMakerAPIContext,
    MarketMakerAPISolanaContext,
    MarketMakerEVMChainContext,
    MarketMakerAPIEVMContext,
} from "./context";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import { Bidder } from "./lib/bidder";
import { AllowanceGranter } from "./lib/evm/allowanceGranter";
import { SolanaStrategy } from "./lib/solana/strategy";
import process from "process";
import { MarketMakerServer, apiPath } from "./server";
import "source-map-support/register"

async function main(opts: any): Promise<void> {
    Decimal.set({
        precision: 100,
        toExpPos: 100,
        toExpNeg: -100,
    });

    const rawConfig = JSON.parse(fs.readFileSync(opts.config, "utf-8"));
    const config = marketMakerConfig.parse(rawConfig);

    const dflowKeyPath = config.dflowKeypairMnemonicPath;
    const dflowKeyMnemonic = fs.readFileSync(dflowKeyPath, "utf-8").trim();
    const dflowKeypair = await DirectSecp256k1HdWallet.fromMnemonic(dflowKeyMnemonic, {
        prefix: DFlowPrefix,
    });
    const client = new DFlowClient(config.dflowApiURL, config.dflowRpcURL, dflowKeypair);
    await client.init();

    const solanaKeyPath = config.solanaKeypairPath;
    const solanaKey = new Uint8Array(JSON.parse(fs.readFileSync(solanaKeyPath, "utf-8")));
    const solanaKeypair = Keypair.fromSecretKey(solanaKey);

    const solanaConnection = new Connection(config.solanaURL, config.solanaCommitment);

    const bridgeClient = new BridgeClient({
        solanaConnection,
        bridgeProgramId: config.bridgeProgramID,
        bridgeMint: config.bridgeMint,
    });

    let evmContext: MarketMakerAPIEVMContext | undefined;
    let allowanceGranter: AllowanceGranter | undefined;
    if (config.evm) {
        const evmChainContexts = [];
        const evmKey = fs.readFileSync(config.evm.keypairPath, "utf-8");
        for (const evmChainConfig of config.evm.chains) {
            const rpcURL = evmChainConfig.rpcURL;
            const provider = new ethers.JsonRpcProvider(rpcURL);
            const wallet = new ethers.Wallet(evmKey, provider);
            const evmChainContext = new MarketMakerEVMChainContext({
                auctionNetwork: evmChainConfig.auctionNetwork,
                rpcURL,
                provider,
                wallet,
            });
            evmChainContexts.push(evmChainContext);
        }
        await Promise.all(evmChainContexts.map(x => x.validate()));
        if (evmChainContexts.length > 0) {
            evmContext = new MarketMakerAPIEVMContext(evmChainContexts);
            allowanceGranter = new AllowanceGranter(evmContext);
        }
    }

    const bidder = new Bidder({
        client,
        connection: solanaConnection,
        keypair: solanaKeypair,
        bridgeClient,
        initialFunding: config.initialFunding ?? 0,
        bidSize: config.bidSize,
        shouldBid: (auction, logger) => {
            if (config.auctions !== undefined) {
                if (!config.auctions.some(x => Number(auction.auctionId) === x)) {
                    return false;
                }
            }
            const auctionNetwork = auction.network as Network;
            if (auctionNetwork.startsWith("evm")) {
                return evmContext !== undefined
                    && evmContext.getChainContextByNetwork(auctionNetwork) !== undefined;
            }
            switch (auctionNetwork) {
                case "solana": return true;
                default: {
                    logger.error(`Unrecognized network ${auctionNetwork}. Not bidding.`);
                    return false;
                }
            }
        },
        getMarketMakerURL: auction => {
            const auctionNetwork = auction.network as Network;
            if (auctionNetwork.startsWith("evm")) {
                if (auction.isSponsoredSwap) {
                    return `${config.marketMakerURL}${apiPath.evmSponsored}`;
                } else {
                    return `${config.marketMakerURL}${apiPath.evmLegacy}`;
                }
            }
            switch (auctionNetwork) {
                case "solana": return `${config.marketMakerURL}${apiPath.solana}`;
                default: return "";
            }
        },
        beforeBid: auction => {
            const auctionNetwork = auction.network as Network;
            if (!auctionNetwork.startsWith("evm")) {
                return;
            }
            if (evmContext && !evmContext.hasChainContext(auction)) {
                evmContext.registerChainContext(auction);
            }
        },
        afterBid: async (auction, _logger) => {
            const auctionNetwork = auction.network as Network;
            if (auctionNetwork.startsWith("evm")) {
                // Allow 0x contract to move ERC-20 tokens on behalf of the market maker wallet
                if (!evmContext) {
                    throw new Error("Submitted EVM bid without EVM context set");
                }
                const auctionId = auction.auctionId;
                const evmChainContext = evmContext.getChainContextByAuction(auctionId);
                if (!evmChainContext) {
                    throw new Error(
                        `Submitted EVM bid without EVM chain context for auction ${auctionId}`
                    );
                }
                const closedEvmChainContext = evmChainContext;
                const allowanceTarget = evmChainContext.zeroExExchangeProxyAddress;
                const grantAllowance = (token: string) => {
                    if (token === NATIVE_TOKEN_ADDRESS) {
                        // Grant WETH allowance
                        token = closedEvmChainContext.wethContractAddress;
                    }
                    allowanceGranter?.grantAllowance({
                        network: auctionNetwork,
                        token,
                        allowanceTarget,
                    });
                }
                grantAllowance(auction.baseCurrency);
                grantAllowance(auction.quoteCurrency);
            }
        },
    });
    await bidder.start();

    const context = new MarketMakerAPIContext();

    const solanaStrategy = new SolanaStrategy({
        connection: solanaConnection,
        keypair: solanaKeypair,
    });
    const solanaContext = new MarketMakerAPISolanaContext(solanaStrategy);

    const server = new MarketMakerServer({
        context,
        solanaContext,
        evmContext,
    });

    const port = config.server?.port ?? 8084;
    server.listen(port, {
        callback: () => {
            const serverStartMsg = "Express server started on port: ";
            context.logger.info(serverStartMsg + port);
        },
        keepAliveTimeout: (config.server?.keepAliveTimeout ?? 5) * 1_000,
    });

    await waitForever();
}

async function waitForever(): Promise<void> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 10 * 60_000));
    }
}

const program = new Command()
    .addOption(new Option("--config <CONFIG PATH>", "Config file path")
        .makeOptionMandatory())
    .addHelpText("before", "DFlow Market Maker Server\n")
    .showHelpAfterError()
    .parse();
const opts = program.opts();

main(opts).then(
    () => process.exit(0),
    error => {
        console.error(error);
        process.exit(1);
    },
);
