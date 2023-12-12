import { AccountData } from "@cosmjs/amino";
import { EncodeObject, OfflineSigner, Registry } from "@cosmjs/proto-signing";
// Fix
// The inferred type of 'client' cannot be named without a reference to
// 'dflow-client-ts/node_modules/@cosmjs/stargate'.
import * as stargate from "@cosmjs/stargate";
import { Client } from "@dflow-protocol/client-core";
import { TxRaw } from "@dflow-protocol/client-core/dist/cosmos.tx.v1beta1"
import { HttpResponse, RpcStatus } from "@dflow-protocol/client-core/dist/cosmos.auth.v1beta1/rest";
import { AuctionQueryOverlapResponse } from "@dflow-protocol/client-core/dist/dflow.auction/rest";
import { Endorsement } from "@dflow-protocol/client-core/dist/dflow.auction/types/auction/tx";
import { MsgUpdateEndorsementKeys } from "@dflow-protocol/client-core/dist/dflow.ofsaccount/module";
import { PublicKey } from "@solana/web3.js";
import {
    AuctionCreateTemplate,
    AuctionGridDataRow,
    AuctionInfo,
    AuctionModuleParams,
    Network,
} from "./auction";
import BN from "bn.js";
import { DepositRecipient } from "./bridgeClient";
import base58 from "bs58";
import { checkSafeInteger } from "./coding";
import { bridgeDenom, DFlowPrefix } from "./constant";
import * as crypto from "crypto";
import { OrderFlowSource } from "./orderFlowSource";
import { PricingInfo } from "./pricingInfo";

export type ClientMsgCallbacks = {
    onSignFulfilled?: (txResult: TxRaw) => void;
    /** Note that the error will not be thrown if this callback is specified */
    onSignError?: (error: unknown) => void;
    /** Note that the error will not be thrown if this callback is specified */
    onSendError?: (error: unknown) => void;
}

export class DFlowClient {
    readonly client;
    readonly signer: OfflineSigner;
    readonly apiURL: string;
    readonly rpcURL: string;

    private _signingClient?: stargate.SigningStargateClient;
    public get signingClient(): stargate.SigningStargateClient {
        if (!this._signingClient) {
            throw new Error("_signingClient not set. Did you forget to call init?");
        }
        return this._signingClient;
    }

    /** Construct a DFlow Client, which can be used to query the network and send transactions.
     * Note that you must also call `init()` if using the client to send transactions. */
    constructor(apiURL: string, rpcURL: string, signer: OfflineSigner) {
        this.signer = signer;
        this.apiURL = apiURL;
        this.rpcURL = rpcURL;
        this.client = new Client(
            {
                apiURL,
                rpcURL,
                prefix: DFlowPrefix,
            },
            signer,
        );
    }

    async init(options?: stargate.SigningStargateClientOptions): Promise<DFlowClient> {
        if (this._signingClient) {
            return this;
        }
        const registry = new Registry(this.client.registry);
        this._signingClient = await stargate.SigningStargateClient.connectWithSigner(
            this.rpcURL,
            this.signer,
            {...options, registry},
        );
        return this;
    }

    async signTx(tx: EncodeObject[], fee: stargate.StdFee): Promise<TxRaw> {
        const signerAddress = await this.getSignerAddress();
        return await this.signingClient.sign(signerAddress, tx, fee, "");
    }

    async sendTx(signedTx: TxRaw): Promise<stargate.DeliverTxResponse> {
        const encodedTx = TxRaw.encode(signedTx).finish();
        // Time out after 3 blocks
        const timeoutMillis = 18_000;
        return await this.signingClient.broadcastTx(encodedTx, timeoutMillis);
    }

    async signAndSendTx(
        tx: EncodeObject[],
        callbacks?: ClientMsgCallbacks,
        fee: stargate.StdFee = this.calculateFee(),
    ): Promise<stargate.DeliverTxResponse> {
        let signResult: TxRaw;
        try {
            signResult = await this.signTx(tx, fee);
            if (callbacks?.onSignFulfilled) {
                callbacks.onSignFulfilled(signResult);
            }
        } catch (e) {
            if (callbacks?.onSignError) {
                callbacks.onSignError(e);
            }
            throw e;
        }
        try {
            return this.sendTx(signResult);
        } catch (e) {
            if (callbacks?.onSendError) {
                callbacks.onSendError(e);
            }
            throw e;
        }
    }

    calculateFee(): stargate.StdFee {
        return stargate.calculateFee(0, "0stake");
    }

    async getSignerAccount(): Promise<AccountData> {
        const accounts = await this.client.signer.getAccounts();
        if (accounts.length !== 1) {
            throw new Error("Cannot get signer account for multi-account signer");
        }
        return accounts[0];
    }

    async getSignerPublicKey(): Promise<Uint8Array> {
        const account = await this.getSignerAccount();
        return account.pubkey;
    }

    async getSignerAddress(): Promise<string> {
        const account = await this.getSignerAccount();
        return account.address;
    }

    /** Returns the bridge deposit recipient associated with the client's signer. */
    async getDepositRecipient(): Promise<DepositRecipient> {
        const signerPublicKey = await this.getSignerPublicKey();
        return new DepositRecipient(signerPublicKey);
    }

    async getBalance(): Promise<bigint> {
        const address = await this.getSignerAddress();
        const result = await this.client.CosmosBankV1Beta1.query.queryBalance(address, {
            denom: bridgeDenom,
        });
        return BigInt(result.data.balance?.amount ?? 0);
    }

    async fetchBridgeNonce(): Promise<bigint> {
        const result = await this.client.DflowNoncedbank.query.queryNoncedBridgeState();
        const nextNonce = result.data.NoncedBridgeState?.nextNonce;
        if (nextNonce === undefined) {
            throw new Error("Failed to fetch bridge nonce");
        }
        return BigInt(nextNonce);
    }

    async deliverNotional(
        ssPublicKey: string,
        auctionId: number,
        auctionEpoch: number,
        notional: number,
        endorsement: Endorsement,
        isForPaymentInLieu: boolean,
        extensions: string,
    ): Promise<stargate.DeliverTxResponse> {
        checkSafeInteger(auctionId, "auctionId");
        checkSafeInteger(auctionEpoch, "auctionEpoch");
        checkSafeInteger(notional, "notional");
        const signerPublicKey = await this.getSignerAddress();
        const msg = this.client.DflowAuction.tx.msgDeliverNotional({
            value: {
                signerPublicKey,
                ssPublicKey,
                auctionId,
                auctionEpoch,
                notional,
                endorsement,
                isForPaymentInLieu,
                extensions,
            },
        });
        const txResult = await this.signAndSendTx([msg]);
        return txResult;
    }

    /** Check that an endorsement key is valid. Throws if the endorsement key is invalid. */
    checkEndorsementKey(endorsementKey: string): void {
        let decodedEndorsementKey;
        try {
            decodedEndorsementKey = base58.decode(endorsementKey);
        } catch {
            throw new Error(`Invalid endorsement key "${endorsementKey}". Must be base58-encoded.`);
        }
        try {
            if (!PublicKey.isOnCurve(decodedEndorsementKey)) {
                throw new Error();
            }
        } catch {
            throw new Error(
                `Invalid endorsement key "${endorsementKey}". Not a valid Ed25519 public key.`
            );
        }
    }

    initOFSAccountMsg(
        ofsPublicKey: string,
        flowEndorsementKey: string,
        extensions: string,
    ): EncodeObject {
        this.checkEndorsementKey(flowEndorsementKey);
        return this.client.DflowOfsaccount.tx.msgInitAccount({
            value: {
                ofsPublicKey,
                flowEndorsementKey,
                extensions,
            },
        });
    }

    /** Create an order flow source account */
    async createOFSAccount({
        flowEndorsementKey,
        extensions,
        callbacks,
    }: {
        /** Base58-encoded endorsement key public key */
        flowEndorsementKey: string
        /** Order flow source account extensions */
        extensions: string
        callbacks?: ClientMsgCallbacks
    }): Promise<stargate.DeliverTxResponse> {
        const ofsPublicKey = await this.getSignerAddress();
        const msg = this.initOFSAccountMsg(ofsPublicKey, flowEndorsementKey, extensions);
        const txResult = await this.signAndSendTx([msg], callbacks);
        return txResult;
    }

    /** Set the endorsement keys for this client's order flow source account */
    async setEndorsementKeys(
        params: MsgUpdateEndorsementKeys,
        callbacks?: ClientMsgCallbacks,
    ): Promise<stargate.DeliverTxResponse> {
        if (params.flowEndorsementKey1 !== "") {
            this.checkEndorsementKey(params.flowEndorsementKey1);
        }
        if (params.flowEndorsementKey2 !== "") {
            this.checkEndorsementKey(params.flowEndorsementKey2);
        }
        const msg = this.client.DflowOfsaccount.tx.msgUpdateEndorsementKeys({
            value: params,
        });
        const txResult = await this.signAndSendTx([msg], callbacks);
        return txResult;
    }

    async getOrderFlowSource(ofsPublicKey: string): Promise<OrderFlowSource> {
        const orderFlowSource = await this.client.DflowOfsaccount.query
            .queryOrderFlowSource(ofsPublicKey);
        if (orderFlowSource.data.orderFlowSource === undefined) {
            throw new Error("Failed to fetch order flow source");
        }
        return new OrderFlowSource(orderFlowSource.data.orderFlowSource);
    }

    async getAllAuctions(limitNumResults = 10000): Promise<AuctionInfo[]> {
        const auctions = await this.client.DflowAuction.query.queryOrderFlowAuctionAll({
            "pagination.limit": limitNumResults.toString(),
        });
        if (auctions.data.orderFlowAuction === undefined) {
            throw new Error("Failed to fetch auctions");
        }
        return auctions.data.orderFlowAuction.map(x => new AuctionInfo(x));
    }

    async getAuctionGrid(limitNumResults = 10000): Promise<AuctionGridDataRow[]> {
        const auctions = await this.client.DflowAuction.query.queryGrid({
            "pagination.limit": limitNumResults.toString(),
        });
        if (auctions.data.rows === undefined) {
            throw new Error("Failed to fetch auctions");
        }
        return auctions.data.rows.map(x => new AuctionGridDataRow(x));
    }

    async getAuctionGridRows(auctionIds: bigint[]): Promise<AuctionGridDataRow[]> {
        const auctions = await this.client.DflowAuction.query.queryGridRows({
            auctionIds: auctionIds.map(x => x.toString()).join(","),
        });
        if (auctions.data.rows === undefined) {
            throw new Error("Failed to fetch auctions");
        }
        return auctions.data.rows.map(x => new AuctionGridDataRow(x));
    }

    async getPricingInfo(
        ofsPublicKey: string,
        network: Network,
        currency1: string,
        currency2: string,
    ): Promise<PricingInfo | null> {
        const result = await this.client.DflowAuction.query.queryPricingInfo({
            ofsPublicKey,
            network,
            currency1,
            currency2,
        });
        if (!result.ok || !result.data) {
            throw new Error("Failed to fetch pricing info");
        }
        return result.data.pricingInfo
            ? new PricingInfo(result.data.pricingInfo)
            : null;
    }

    /** Returns a list of auctions matching the given parameters. */
    async getAuctions(
        ofsPublicKey: string,
        network: Network | undefined,
        currency1: string | undefined,
        currency2: string | undefined,
        orderSize: number | undefined,
    ): Promise<AuctionInfo[]> {
        const result = await this.client.DflowAuction.query.queryOrderFlowAuctions({
            ofsPublicKey,
            network: network ?? "",
            currency1: currency1 ?? "",
            currency2: currency2 ?? "",
            orderSize: orderSize?.toString() ?? "",
        });
        return result.data.orderFlowAuctions?.map(x => new AuctionInfo(x)) ?? [];
    }

    /** Returns all auctions owned by the order flow source associated with this client */
    async getOwnedAuctions(): Promise<AuctionInfo[]> {
        const ofsPublicKey = await this.getSignerAddress();
        return await this.getAuctions(ofsPublicKey, undefined, undefined, undefined, undefined);
    }

    async getAuctionById(id: bigint) {
        const result = await this.client.DflowAuction.query.queryOrderFlowAuction(id.toString());
        if (!result.ok || !result.data.orderFlowAuction) {
            throw new Error(`Failed to fetch auction ${id}`);
        }
        return new AuctionInfo(result.data.orderFlowAuction);
    }

    async getAuctionModuleParams(): Promise<AuctionModuleParams> {
        const response = await this.client.DflowAuction.query.queryParams();
        const params = response.data.params;
        if (params?.auctionCost === undefined || params?.minDeliveryPeriod === undefined
            || params?.endorsementMaxRelativeExpiration === undefined
            || params?.endorsementMaxRelativeExpirationGrace === undefined) {
            throw new Error("Failed to fetch auction module params");
        }
        return {
            auctionCost: Number(params.auctionCost),
            minDeliveryPeriod: Number(params.minDeliveryPeriod),
            endorsementMaxRelativeExpiration: Number(params.endorsementMaxRelativeExpiration),
            endorsementMaxRelativeExpirationGrace:
                Number(params.endorsementMaxRelativeExpirationGrace),
        };
    }

    /** Checks a list of nonexistent auctions for overlap with each other and an order flow source's
     * existing auctions. */
    async checkOverlapWithExistingAuctions(
        checkAuctions: AuctionCreateTemplate[],
    ): Promise<HttpResponse<AuctionQueryOverlapResponse, RpcStatus>> {
        const ofsPublicKey = await this.getSignerAddress();
        const queryAuctions = checkAuctions.map(x => {
            return JSON.stringify({
                network: x.network,
                currency1: x.baseCurrency,
                currency2: x.quoteCurrency,
                minimumOrderSize: x.minimumOrderSize.toString(),
                maximumOrderSize: x.maximumOrderSize.toString(),
                isUnidirectional: x.isUnidirectional,
                feePayerMode: x.feePayerMode,
            });
        });
        const result = await this.client.DflowAuction.query.queryOverlap({
            ofsPublicKey,
            auctions: queryAuctions,
        });
        return result;
    }

    /** Create an auction. If the client doesn't have an order flow source account, the
     * caller must provide the `initOFSAccount` param and the transaction will initialize the
     * client's order flow source account. */
    async createAuction(
        auctionTemplate: AuctionCreateTemplate,
        initOFSAccount?: {
            /** Base58-encoded endorsement key public key */
            endorsementKey: string
            /** Order flow source account extensions */
            extensions?: string
        },
        callbacks?: ClientMsgCallbacks,
    ): Promise<stargate.DeliverTxResponse> {
        DFlowClient.checkAuctionTemplate(auctionTemplate);
        const txMessages = [];
        const ofsPublicKey = await this.getSignerAddress();
        if (initOFSAccount) {
            const initOFSAccountMsg = this.initOFSAccountMsg(
                ofsPublicKey,
                initOFSAccount.endorsementKey,
                initOFSAccount.extensions ?? "",
            );
            txMessages.push(initOFSAccountMsg);
        }
        const createAuctionMsg = this.client.DflowAuction.tx.msgCreateAuction({
            value: {
                ...auctionTemplate,
                ofsPublicKey,
            },
        });
        txMessages.push(createAuctionMsg);
        const txResult = await this.signAndSendTx(txMessages, callbacks);
        return txResult;
    }

    /** Create multiple auctions. If the client doesn't have an order flow source account, the
     * caller must provide the `initOFSAccount` param and the transaction will initialize the
     * client's order flow source account. */
    async createAuctions(
        auctionTemplates: AuctionCreateTemplate[],
        initOFSAccount?: {
            /** Base58-encoded endorsement key public key */
            endorsementKey: string
            /** Order flow source account extensions */
            extensions?: string
        },
    ): Promise<stargate.DeliverTxResponse> {
        const txMessages = [];
        const ofsPublicKey = await this.getSignerAddress();
        if (initOFSAccount) {
            const initOFSAccountMsg = this.initOFSAccountMsg(
                ofsPublicKey,
                initOFSAccount.endorsementKey,
                initOFSAccount.extensions ?? "",
            );
            txMessages.push(initOFSAccountMsg);
        }
        for (const auctionTemplate of auctionTemplates) {
            DFlowClient.checkAuctionTemplate(auctionTemplate);
            const createAuctionMsg = this.client.DflowAuction.tx.msgCreateAuction({
                value: {
                    ...auctionTemplate,
                    ofsPublicKey,
                },
            });
            txMessages.push(createAuctionMsg);
        }
        const txResult = await this.signAndSendTx(txMessages);
        return txResult;
    }

    private static checkAuctionTemplate(auctionTemplate: AuctionCreateTemplate): void {
        checkSafeInteger(auctionTemplate.minimumOrderSize, "minimumOrderSize");
        checkSafeInteger(auctionTemplate.maximumOrderSize, "maximumOrderSize");
        checkSafeInteger(auctionTemplate.notionalSize, "notionalSize");
        checkSafeInteger(auctionTemplate.maxDeliveryPeriod, "maxDeliveryPeriod");
    }

    async requestWithdrawal(
        /** Solana SPL token account that will receive the funds */
        toAccount: PublicKey,
        /** Solana wallet that owns the `toAccount` */
        toAccountOwner: PublicKey,
        /** The amount to withdraw, specified as a scaled integer */
        amount: number,
    ): Promise<stargate.DeliverTxResponse> {
        checkSafeInteger(amount, "amount");
        const withdrawerDFlowAddress = await this.getSignerAddress();
        const msg = this.client.DflowBridge.tx.msgRequestWithdraw({
            value: {
                withdrawerPublicKey: withdrawerDFlowAddress,
                dst: toAccount.toBase58(),
                dstOwner: toAccountOwner.toBase58(),
                amount,
            },
        });
        const txResult = await this.signAndSendTx([msg]);
        return txResult;
    }

    async reviseWithdrawal(
        withdrawId: number,
        /** Solana SPL token account that will receive the funds */
        newToAccount: PublicKey,
        /** Solana wallet that owns the `newToAccount` */
        newToAccountOwner: PublicKey,
    ): Promise<stargate.DeliverTxResponse> {
        checkSafeInteger(withdrawId, "withdrawId");
        const withdrawerDFlowAddress = await this.getSignerAddress();
        const msg = this.client.DflowBridge.tx.msgReviseWithdrawal({
            value: {
                withdrawerPublicKey: withdrawerDFlowAddress,
                withdrawId,
                dst: newToAccount.toBase58(),
                dstOwner: newToAccountOwner.toBase58(),
            },
        });
        const txResult = await this.signAndSendTx([msg]);
        return txResult;
    }

    async revealBlindBid(
        auctionId: number,
        bidEpoch: number,
        bidAmount: number,
        nonce: number,
        mmUrl: string,
    ): Promise<stargate.DeliverTxResponse> {
        checkSafeInteger(auctionId, "auctionId");
        checkSafeInteger(bidEpoch, "bidEpoch");
        checkSafeInteger(bidAmount, "bidAmount");
        checkSafeInteger(nonce, "nonce");
        const mmPublicKey = await this.getSignerAddress();
        const msgRevealBid = this.client.DflowAuction.tx.msgRevealBid({
            value: {
                mmPublicKey,
                auctionId,
                bid: bidAmount,
                nonce,
                mmUrl,
                bidEpoch,
            },
        });
        const txResult = await this.signAndSendTx([msgRevealBid]);
        return txResult;
    }

    async sendBlindBid(
        auctionId: number,
        bidEpoch: number,
        bidAmount: number,
        nonce: number,
    ): Promise<stargate.DeliverTxResponse> {
        checkSafeInteger(auctionId, "auctionId");
        checkSafeInteger(bidEpoch, "bidEpoch");
        checkSafeInteger(bidAmount, "bidAmount");
        checkSafeInteger(nonce, "nonce");
        const mmPublicKey = await this.getSignerAddress();
        const bid = new BN(bidAmount);
        const bigNonce = new BN(nonce);
        const hash = this.generateHash(bid, bigNonce);
        const msgBlindBid = this.client.DflowAuction.tx.msgBlindBid({
            value: {
                mmPublicKey,
                auctionId,
                bidHash: hash,
                bidEpoch,
            },
        });
        const txResult = await this.signAndSendTx([msgBlindBid]);
        return txResult;
    }

    async reviseBlindBid(
        auctionId: number,
        bidEpoch: number,
        bidAmount: number,
        nonce: number,
    ): Promise<stargate.DeliverTxResponse> {
        checkSafeInteger(auctionId, "auctionId");
        checkSafeInteger(bidEpoch, "bidEpoch");
        checkSafeInteger(bidAmount, "bidAmount");
        checkSafeInteger(nonce, "nonce");
        const mmPublicKey = await this.getSignerAddress();
        const bid = new BN(bidAmount);
        const bigNonce = new BN(nonce);
        const hash = this.generateHash(bid, bigNonce);
        const msgReviseBlindBid = this.client.DflowAuction.tx.msgReviseBlindBid({
            value: {
                mmPublicKey,
                auctionId: auctionId,
                bidHash: hash,
                bidEpoch,
            },
        });
        const txResult = await this.signAndSendTx([msgReviseBlindBid]);
        return txResult;
    }

    bufferToHex(buffer: ArrayBuffer): string {
        return [...new Uint8Array(buffer)]
            .map(b => b.toString (16).padStart (2, "0"))
            .join("");
    }

    generateHash(bid: BN, nonce: BN): string {
        const buf = new Uint8Array(16);
        buf.set(bid.toBuffer("le", 8));
        buf.set(nonce.toBuffer("le", 8), 8);
        const hash = crypto.createHash("sha256").update(Buffer.from(buf.buffer)).digest();
        return this.bufferToHex(hash);
    }

    async deleteAuction(params: {
        auctionId: number
    }): Promise<stargate.DeliverTxResponse> {
        checkSafeInteger(params.auctionId, "auctionId");
        const ofsPublicKey = await this.getSignerAddress();
        const msg = this.client.DflowAuction.tx.msgDeleteAuction({
            value: {
                ofsPublicKey,
                auctionId: params.auctionId,
            },
        });
        const txResult = await this.signAndSendTx([msg]);
        return txResult;
    }

    async updateAuction(params: {
        auctionId: number
        clientAuctionId: string
    }): Promise<stargate.DeliverTxResponse> {
        checkSafeInteger(params.auctionId, "auctionId");
        const ofsPublicKey = await this.getSignerAddress();
        const msg = this.client.DflowAuction.tx.msgUpdateAuction({
            value: {
                ofsPublicKey,
                auctionId: params.auctionId,
                clientAuctionId: params.clientAuctionId,
            },
        });
        const txResult = await this.signAndSendTx([msg]);
        return txResult;
    }
}
