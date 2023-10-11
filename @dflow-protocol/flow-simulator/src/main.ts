import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { BridgeClient, DFlowClient, DFlowPrefix } from "@dflow-protocol/client";
import { Connection, Keypair } from "@solana/web3.js";
import { Command, Option } from "commander";
import { flowSimulatorConfigSchema } from "./config";
import { ethers } from "ethers";
import { FlowSimulator, FlowSimulatorEVMChainParams } from "./flowSimulator";
import fs from "fs";
import yaml from "js-yaml";
import process from "process";
import "source-map-support/register"

async function main(opts: any): Promise<void> {
    const rawConfig = yaml.load(fs.readFileSync(opts.config, "utf-8"));
    const config = flowSimulatorConfigSchema.parse(rawConfig);

    const ofsDFlowKeyPath = config.ofsDFlowKeypairMnemonicPath;
    const ofsDFlowKeyMnemonic = fs.readFileSync(ofsDFlowKeyPath, "utf-8").trim();
    const dflowKeypair = await DirectSecp256k1HdWallet.fromMnemonic(ofsDFlowKeyMnemonic, {
        prefix: DFlowPrefix,
    });
    const ofsDFlowClient = new DFlowClient(config.dflowApiURL, config.dflowRpcURL, dflowKeypair);

    const endorsementKeyPath = config.endorsementKeyPath;
    const endorsementKey = new Uint8Array(JSON.parse(fs.readFileSync(endorsementKeyPath, "utf-8")));
    const endorsementKeypair = Keypair.fromSecretKey(endorsementKey);

    const ofsSolanaKeyPath = config.ofsSolanaKeypairPath;
    const ofsSolanaKey = new Uint8Array(JSON.parse(fs.readFileSync(ofsSolanaKeyPath, "utf-8")));
    const ofsSolanaKeypair = Keypair.fromSecretKey(ofsSolanaKey);

    const rtSolanaKeyPath = config.rtSolanaKeypairPath;
    const rtSolanaKey = new Uint8Array(JSON.parse(fs.readFileSync(rtSolanaKeyPath, "utf-8")));
    const rtSolanaKeypair = Keypair.fromSecretKey(rtSolanaKey);

    const solanaConnection = new Connection(config.solanaURL, config.solanaCommitment);

    const bridgeClient = new BridgeClient({
        solanaConnection,
        bridgeProgramId: config.bridgeProgramID,
        bridgeMint: config.bridgeMint,
    });

    let evmParamsMap: Map<number, FlowSimulatorEVMChainParams> | undefined;
    if (config.evm) {
        const evmKey = fs.readFileSync(config.evm.keypairPath, "utf-8");
        evmParamsMap = new Map();
        for (const evmChainConfig of config.evm.chains) {
            const rpcURL = evmChainConfig.rpcURL;
            const provider = new ethers.JsonRpcProvider(rpcURL);
            const wallet = new ethers.Wallet(evmKey, provider);
            const evmParams: FlowSimulatorEVMChainParams = {
                rpcURL,
                provider,
                wethContractAddress: evmChainConfig.wethContractAddress,
                wallet: wallet,
            };
            const { chainId } = await provider.getNetwork();
            if (!isSafeInteger(Number(chainId))) {
                throw new Error(
                    `Chain ID ${chainId} cannot be safely represented as a JavaScript number`
                );
            }
            const chainIdNumber = Number(chainId);
            evmParamsMap.set(chainIdNumber, evmParams);
        }
    }

    const flowSimulator = new FlowSimulator({
        ofsDFlowClient,
        endorsementKeypair,
        ofsSolanaKeypair,
        ofsConfig: config.ofsConfig,
        auctions: config.auctions ?? [],
        orderConfigs: config.orderConfigs ?? [],
        rtSolanaKeypair,
        solanaConnection,
        bridgeClient,
        signatoryServerURL: config.signatoryServerURL,
        endorsementServerURL: config.endorsementServerURL,
        evm: evmParamsMap,
    });
    await flowSimulator.start();

    await waitForever();
}

async function waitForever(): Promise<void> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 10 * 60_000));
    }
}

function isSafeInteger(value: number): boolean {
    return Number.isSafeInteger(value);
}

const program = new Command()
    .addOption(new Option("--config <CONFIG PATH>", "Config file path")
        .makeOptionMandatory())
    .addHelpText("before", "DFlow Flow Simulator\n")
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
