import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { EVM_NATIVE_TOKEN_ADDRESS } from "@dflow-protocol/client";
import {
    AuctionCreateTemplate,
    BridgeClient,
    DFlowClient,
    DFlowPrefix,
    EvmFeePayerMode,
    SolanaFeePayerMode,
} from "@dflow-protocol/client";
import { BN } from "@project-serum/anchor";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import fs from "fs";
import process from "process";
import "source-map-support/register"

/** Creates an order flow source account and auctions on DFlow */
async function main(): Promise<void> {
    const solanaKeyPath = "/path/to/solana-key.json";
    const solanaKey = new Uint8Array(JSON.parse(fs.readFileSync(solanaKeyPath, "utf-8")));
    const solanaKeypair = Keypair.fromSecretKey(solanaKey);
    const signTransaction = (tx: Transaction) => {
        tx.sign(solanaKeypair);
        return Promise.resolve(tx);
    };
    const solanaConnection = new Connection("http://localhost:8899", "finalized"); // Replace with your Solana endpoint
    const bridgeClient = new BridgeClient({ solanaConnection });

    const dflowKeyMnemonicPath = "/path/to/dflow/key-mnemonic.txt";
    const dflowKeyMnemonic = fs.readFileSync(dflowKeyMnemonicPath, "utf-8").trim();
    const dflowKeypair = await DirectSecp256k1HdWallet.fromMnemonic(dflowKeyMnemonic, {
        prefix: DFlowPrefix,
    });
    const dflowClient = new DFlowClient(
        "http://localhost:1317",  // Replace with your DFlow endpoint
        "http://localhost:26657", // Replace with your DFlow endpoint
        dflowKeypair,
    );
    await dflowClient.init();

    const endorsementKeyPath = "/path/to/endorsement-key.json";
    const endorsementKey = new Uint8Array(JSON.parse(fs.readFileSync(endorsementKeyPath, "utf-8")));
    const endorsementKeypair = Keypair.fromSecretKey(endorsementKey);
    const base58EndorsementKey = endorsementKeypair.publicKey.toBase58();

    const oneHourMillis = 60 * 60 * 1000;
    const auctions: AuctionCreateTemplate[] = [
        {
            network: "evm1",
            feePayerMode: EvmFeePayerMode.Legacy,
            maxDeliveryPeriod: oneHourMillis,
            minimumOrderSize:      1_00, //       $1.00
            maximumOrderSize:   5000_00, //   $5,000.00
            notionalSize:     500000_00, // $500,000.00
            clientAuctionId: "ETH-USDC-1-5000",
            baseCurrency: EVM_NATIVE_TOKEN_ADDRESS,
            quoteCurrency: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            isPaymentInLieuEnabled: true,
            isUnidirectional: false,
            extensions: "",
        },
        {
            network: "solana",
            feePayerMode: SolanaFeePayerMode.RETAIL_TRADER,
            maxDeliveryPeriod: oneHourMillis,
            minimumOrderSize:      1_00, //         $1.00
            maximumOrderSize:   5000_00, //     $5,000.00
            notionalSize:    1000000_00, // $1,000,000.00
            clientAuctionId: "SOL-USDC-1-5000",
            baseCurrency: "So11111111111111111111111111111111111111112",
            quoteCurrency: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            isPaymentInLieuEnabled: true,
            isUnidirectional: false,
            extensions: "",
        },
    ];

    // Calculate the total cost of creating the auctions
    const auctionCost = await dflowClient.getAuctionModuleParams().then(x => x.auctionCost);
    const totalCost = auctionCost * auctions.length;

    // Deposit enough USDC to cover the cost of creating the auctions
    const depositResult = await bridgeClient.deposit({
        amount: new BN(totalCost),
        recipient: await dflowClient.getDepositRecipient(),
        depositor: solanaKeypair.publicKey,
        signTransaction,
    });

    // Wait for the deposit to be processed
    const isDepositProcessed = await bridgeClient.waitForDeposit({
        depositStateAccountSeed: depositResult.depositStateAccountSeed,
        client: dflowClient,
    });
    if (!isDepositProcessed) {
        throw new Error("Deposit was not processed");
    }

    // Initialize the order flow source account and create the auctions
    const createAuctionsResult = await dflowClient.createAuctions(auctions, {
        endorsementKey: base58EndorsementKey,
    });
    if (createAuctionsResult.code !== 0) {
        throw new Error("Failed to create auctions");
    }

    // Fetch the auctions
    const allOwnedAuctions = await dflowClient.getOwnedAuctions();
    console.log(allOwnedAuctions);
}

main().then(
    () => process.exit(0),
    error => {
        console.error(error);
        process.exit(1);
    },
);
