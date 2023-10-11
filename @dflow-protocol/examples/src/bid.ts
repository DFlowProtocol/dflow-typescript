import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { BridgeClient, DFlowClient, DFlowPrefix } from "@dflow-protocol/client";
import { BN } from "@project-serum/anchor";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import fs from "fs";
import crypto from "node:crypto";
import process from "process";
import "source-map-support/register"

/** Bids in auctions indefinitely */
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
    const marketMakerDFlowAddress = await dflowClient.getSignerAddress();

    // Deposit 10,000 USDC to bid
    const totalFunding = 10000_000000;
    const depositResult = await bridgeClient.deposit({
        amount: new BN(totalFunding),
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

    // Bid in these auctions indefinitely
    const auctionIds = [1, 3, 4];

    // We store the bid nonce for each of our bids in memory. In production, bid nonces should be kept in persistent
    // storage rather than in memory in case the process dies after the bid is submitted but before it's revealed.
    const auctionIdToBidNonce = new Map<number, number>();

    // Poll the auctions we're bidding in
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const auctions = await dflowClient.getAuctionGridRows(auctionIds.map(BigInt));
        for (const auction of auctions) {
            // Make TypeScript compiler type checks pass
            if (auction.auctionId === undefined) {
                throw new Error("Can't happen");
            }
            if (auction.epoch === undefined) {
                throw new Error("Can't happen");
            }
            if (auction.blindBidEndTimestamp === undefined) {
                throw new Error("Can't happen");
            }
            if (auction.blindBidEndNotionalTime === undefined) {
                throw new Error("Can't happen");
            }
            if (auction.deliveredNotionalSize === undefined) {
                throw new Error("Can't happen");
            }
            if (auction.blindBids === undefined) {
                throw new Error("Can't happen");
            }

            const auctionId = Number(auction.auctionId);
            const bidEpoch = Number(auction.epoch) + 1;
            const bidAmount = 500_000000; // 500 USDC

            const nowUTCMillis = Date.now();
            const isBiddingOpen = nowUTCMillis < auction.blindBidEndTimestamp
                && auction.deliveredNotionalSize < auction.blindBidEndNotionalTime;

            const bid = auction.blindBids.find(x => x.marketMakerPublicKey === marketMakerDFlowAddress);
            if (bid === undefined) {
                // We haven't bid in the epoch yet. Submit a blind bid if bidding is open.
                if (isBiddingOpen) {
                    const nonce = generateRandomBidNonce();
                    auctionIdToBidNonce.set(auctionId, nonce);
                    const bidResult = await dflowClient.sendBlindBid(auctionId, bidEpoch, bidAmount, nonce);
                    if (bidResult.code !== 0) {
                        // Bid was not successful
                        console.log(
                            `Bid for auction ${auctionId} epoch ${bidEpoch} failed.`
                            + ` Code: ${bidResult.code}. Log: ${bidResult.rawLog}`
                        );
                        continue;
                    }
                    console.log(`Submitted blind bid for auction ${auctionId} epoch ${bidEpoch}`);
                }
            } else {
                // We've bid in the epoch. Reveal the bid if bidding has ended and we haven't already revealed.
                if (!isBiddingOpen && !bid.isRevealed) {
                    const nonce = auctionIdToBidNonce.get(auctionId);
                    if (nonce === undefined) {
                        console.log(
                            `Can't reveal bid for auction ${auctionId} epoch ${bidEpoch} because nonce is unknown`
                        );
                        continue;
                    }
                    const marketMakerUrl = "https://example-market-maker.com/api";
                    const revealResult = await dflowClient.revealBlindBid(
                        auctionId,
                        bidEpoch,
                        bidAmount,
                        nonce,
                        marketMakerUrl,
                    );
                    if (revealResult.code !== 0) {
                        // Reveal was not successful
                        console.log(
                            `Reveal for auction ${auctionId} epoch ${bidEpoch} failed.`
                            + ` Code: ${revealResult.code}. Log: ${revealResult.rawLog}`
                        );
                        continue;
                    }
                    console.log(`Revealed blind bid for auction ${auctionId} epoch ${bidEpoch}`);
                }
            }
        }

        await sleep(5_000);
    }
}

const MAX_RANDOM_INT = 2**48 - 1;
function generateRandomBidNonce(): number {
    return crypto.randomInt(MAX_RANDOM_INT);
}

async function sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

main().then(
    () => process.exit(0),
    error => {
        console.error(error);
        process.exit(1);
    },
);
