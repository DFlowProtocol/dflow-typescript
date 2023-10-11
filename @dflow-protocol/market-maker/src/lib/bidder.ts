import { AuctionInfo, BridgeClient, DFlowClient } from "@dflow-protocol/client";
import { BN } from "@project-serum/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import { sleep } from "../coding";
import { Logger } from "../logger";
import Queue from "mnemonist/queue";
import crypto from "node:crypto";

type BidderParams = {
    client: DFlowClient

    connection: Connection
    keypair: Keypair

    bridgeClient: BridgeClient

    initialFunding: number

    bidSize: number

    shouldBid(auction: AuctionInfo, logger: Logger): boolean
    getMarketMakerURL(auction: AuctionInfo): string
    beforeBid?(auction: AuctionInfo, logger: Logger): void
    afterBid?(auction: AuctionInfo, logger: Logger): Promise<void>
}

type ReviseBidRequest = {
    auctionId: bigint
    bidEpoch: bigint
}

export class Bidder {
    readonly params: BidderParams;
    private readonly logger: Logger;
    private readonly auctionIdToAuction = new Map<bigint, AuctionInfo>();
    private readonly auctionIdToBidNonce = new Map<bigint, number>();
    /** Set of "{auction ID},{epoch}" that have been put into the revise request queue */
    private readonly reviseRequestIds = new Set<string>();
    private readonly reviseRequestQueue = new Queue<ReviseBidRequest>();

    constructor(params: BidderParams) {
        this.params = params;
        this.logger = new Logger("Bidder");
    }

    async start(): Promise<void> {
        const dflowAddress = await this.params.client.getSignerAddress();
        this.logger.info("================== Market Maker Bidder ==================");
        this.logger.info(` DFlow Key: ${dflowAddress}`);
        this.logger.info(` Solana Public Key: ${this.params.keypair.publicKey}`);
        this.logger.info(` Bridge Mint: ${this.params.bridgeClient.bridgeMint}`);
        this.logger.info(` Bridge Program ID: ${this.params.bridgeClient.programId}`);
        this.logger.info(` DFlow API URL: ${this.params.client.apiURL}`);
        this.logger.info(` DFlow RPC URL: ${this.params.client.rpcURL}`);
        this.logger.info(` Solana Endpoint: ${this.params.connection.rpcEndpoint}`);
        this.logger.info(` Solana Commitment: ${this.params.connection.commitment}`);
        this.logger.info("=========================================================");

        this.logger.info("Starting bidder...");
        if (this.params.initialFunding > 0) {
            await this.fundAccount();
            this.logger.info("Funded account");
        }
        void this.bidForever();
        this.logger.info("Started bidder");
    }

    private async fundAccount(): Promise<void> {
        this.logger.info(`Funding account with ${this.params.initialFunding} USDC (scaled)`);
        const amount = new BN(this.params.initialFunding);
        const recipient = await this.params.client.getDepositRecipient();
        const depositResult = await this.params.bridgeClient.deposit({
            amount,
            recipient,
            depositor: this.params.keypair.publicKey,
            signTransaction: async tx => {
                tx.sign(...[this.params.keypair]);
                return tx;
            },
            callbacks: {},
        });

        const isProcessed = await this.params.bridgeClient.waitForDeposit({
            depositStateAccountSeed: depositResult.depositStateAccountSeed,
            client: this.params.client,
        });

        if (!isProcessed) {
            throw new Error("Failed to fund account");
        }
    }

    private async bidForever(): Promise<void> {
        const dflowAddress = await this.params.client.getSignerAddress();
        void this.runReviseProcessor();

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const extantAuctions = await this.params.client.getAllAuctions();
            for (const extantAuction of extantAuctions) {
                const shouldStartWorker = !this.auctionIdToAuction.has(extantAuction.auctionId);
                this.auctionIdToAuction.set(extantAuction.auctionId, extantAuction);
                if (shouldStartWorker) {
                    void this.runAuctionWorker(extantAuction.auctionId, dflowAddress);
                }
            }
            const extantAuctionIds = new Set(extantAuctions.map(x => x.auctionId));
            for (const trackedAuctionId of this.auctionIdToAuction.keys()) {
                // Remove the auction from the tracked auctions if it no longer exists
                if (!extantAuctionIds.has(trackedAuctionId)) {
                    this.auctionIdToAuction.delete(trackedAuctionId);
                }
            }
            await sleep(3_000);
        }
    }

    /** Monitors the reviseRequestQueue for requests to revise bids and processes them sequentially.
     * Bid revisions must be processed sequentially because MsgReviseBlindBid relies on the sender's
     * account sequence number to prevent transaction replay. */
    private async runReviseProcessor(): Promise<void> {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const reviseOperation = this.reviseRequestQueue.dequeue();
            if (!reviseOperation) {
                await sleep(1_000);
                continue;
            }
            const { auctionId, bidEpoch } = reviseOperation;
            const auction = this.auctionIdToAuction.get(auctionId);
            if (!auction) {
                continue;
            }
            const isBiddingOpen = this.isBiddingOpenNow(auction);
            if (!isBiddingOpen) {
                continue;
            }
            try {
                await this.reviseBid(auction, bidEpoch);
            } catch (error) {
                this.logger.error(
                    `Error while revising bid for auction ${auctionId} epoch ${bidEpoch}:`,
                    error,
                );
            }
        }
    }

    /** Submits blind bids and reveals them during the reveal window for the specified auction */
    private async runAuctionWorker(auctionId: bigint, dflowAddress: string): Promise<void> {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const auction = this.auctionIdToAuction.get(auctionId);
            if (!auction) {
                // Auction has been deleted. Stop the worker.
                return;
            }
            try {
                const shouldBid = this.params.shouldBid(auction, this.logger);
                if (!shouldBid) {
                    continue;
                }
                const bidEpoch = auction.epoch + BigInt(1);
                const isBiddingOpen = this.isBiddingOpenNow(auction);
                const bid = auction.blindBids.find(x => x.marketMakerPublicKey === dflowAddress);
                const haveBidNonce = this.auctionIdToBidNonce.get(auctionId) !== undefined;
                if (bid === undefined) {
                    // We haven't bid in the epoch yet. Submit a blind bid if bidding is open.
                    if (isBiddingOpen) {
                        await this.submitBid(auction, bidEpoch);
                    } else {
                        this.logger.warn(
                            `Missed bid window for auction ${auctionId} epoch ${bidEpoch}`
                        );
                    }
                } else if (!bid.isRevealed && !haveBidNonce) {
                    // We don't know the nonce for the bid we submitted earlier. This will only
                    // happen if the bidder is restarted because the bidder tracks its bid nonces in
                    // memory.
                    this.logger.info(`No bid nonce for auction ${auctionId} epoch ${bidEpoch}`);
                    // Revise the bid if bidding is open and we haven't already added it to the
                    // revise queue.
                    if (isBiddingOpen) {
                        if (!this.hasReviseRequest(auctionId, bidEpoch)) {
                            this.queueReviseRequest(auctionId, bidEpoch);
                        }
                    } else {
                        this.logger.warn(
                            `Missed bid window for auction ${auctionId} epoch ${bidEpoch}`
                        );
                    }
                } else {
                    // We've bid in the epoch. Reveal the bid if bidding has ended and we haven't
                    // already revealed.
                    if (!isBiddingOpen && !bid.isRevealed) {
                        await this.revealBid(auction, bidEpoch);
                    }
                }
            } catch (error) {
                this.logger.error(error);
            } finally {
                await sleep(3_000);
            }
        }
    }

    private isBiddingOpenNow(auction: AuctionInfo): boolean {
        const nowUTCMillis = Date.now();
        return nowUTCMillis < auction.blindBidEndTimestamp
            && auction.deliveredNotionalSize < auction.blindBidEndNotionalTime;
    }

    private async submitBid(auction: AuctionInfo, bidEpoch: bigint): Promise<void> {
        if (this.params.beforeBid) {
            this.params.beforeBid(auction, this.logger);
        }
        const auctionId = auction.auctionId;
        const bidAmount = this.getBidSize(auctionId);
        const nonce = generateRandomBidNonce();
        this.auctionIdToBidNonce.set(auctionId, nonce);
        const bidResult = await this.params.client.sendBlindBid(
            Number(auctionId),
            Number(bidEpoch),
            bidAmount,
            nonce,
        );
        if (bidResult.code !== 0) {
            throw new Error(
                `Bid for auction ${auctionId} epoch ${bidEpoch} failed.`
                + ` Code: ${bidResult.code}. Log: ${bidResult.rawLog}`
            );
        }
        this.logger.info(`Submitted bid ${bidAmount} for auction ${auctionId} epoch ${bidEpoch}`);
        if (this.params.afterBid) {
            await this.params.afterBid(auction, this.logger);
        }
    }

    private async reviseBid(auction: AuctionInfo, bidEpoch: bigint): Promise<void> {
        if (this.params.beforeBid) {
            this.params.beforeBid(auction, this.logger);
        }
        const auctionId = auction.auctionId;
        const bidAmount = this.getBidSize(auctionId);
        const nonce = generateRandomBidNonce();
        this.auctionIdToBidNonce.set(auctionId, nonce);
        const bidResult = await this.params.client.reviseBlindBid(
            Number(auctionId),
            Number(bidEpoch),
            bidAmount,
            nonce,
        );
        if (bidResult.code !== 0) {
            throw new Error(
                `Revise bid for auction ${auctionId} epoch ${bidEpoch} failed.`
                + ` Code: ${bidResult.code}. Log: ${bidResult.rawLog}`
            );
        }
        this.logger.info(
            `Revised bid ${bidAmount} for auction ${auctionId} epoch ${bidEpoch}`
        );
        if (this.params.afterBid) {
            await this.params.afterBid(auction, this.logger);
        }
    }

    private hasReviseRequest(auctionId: bigint, bidEpoch: bigint): boolean {
        return this.reviseRequestIds.has(`${auctionId},${bidEpoch}`);
    }

    private queueReviseRequest(auctionId: bigint, bidEpoch: bigint): void {
        this.reviseRequestQueue.enqueue({ auctionId, bidEpoch });
        this.reviseRequestIds.add(`${auctionId},${bidEpoch}`);
    }

    private async revealBid(auction: AuctionInfo, bidEpoch: bigint): Promise<void> {
        const auctionId = auction.auctionId;
        const bidAmount = this.getBidSize(auctionId);
        const nonce = this.auctionIdToBidNonce.get(auctionId);
        if (nonce === undefined) {
            throw new Error(`No nonce for auction ${auctionId} epoch ${bidEpoch} when revealing`);
        }
        const marketMakerURL = this.params.getMarketMakerURL(auction);
        if (!marketMakerURL) {
            throw new Error(
                `No market maker URL registered for auction ${auction.auctionId}`
            );
        }

        const marketMakerUrl = this.params.getMarketMakerURL(auction);
        const revealResult = await this.params.client.revealBlindBid(
            Number(auctionId),
            Number(bidEpoch),
            bidAmount,
            nonce,
            marketMakerUrl,
        );
        if (revealResult.code !== 0) {
            throw new Error(
                `Reveal for auction ${auctionId} epoch ${bidEpoch} failed.`
                + ` Code: ${revealResult.code}. Log: ${revealResult.rawLog}`
            );
        }
        this.logger.info(`Revealed bid ${bidAmount} for auction ${auctionId} epoch ${bidEpoch}`);
    }

    private getBidSize(_auctionId: bigint): number {
        return this.params.bidSize;
    }
}

const MAX_RANDOM_INT = 2**48 - 1;
function generateRandomBidNonce(): number {
    return crypto.randomInt(MAX_RANDOM_INT);
}
