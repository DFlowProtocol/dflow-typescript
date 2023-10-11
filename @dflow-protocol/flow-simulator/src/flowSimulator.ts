import { AuctionCreateTemplate, BridgeClient, DFlowClient } from "@dflow-protocol/client";
import * as EndorsementClient from "@dflow-protocol/endorsement-client-lib";
import {
    Endorsement,
    acceptPaymentInLieu,
    PaymentInLieuToken,
} from "@dflow-protocol/signatory-client-lib";
import { NATIVE_TOKEN_ADDRESS } from "@dflow-protocol/signatory-client-lib/evm";
import * as EVMLegacyClient from "@dflow-protocol/signatory-client-lib/evm/legacy";
import * as EVMSponsoredClient from "@dflow-protocol/signatory-client-lib/evm/sponsored";
import * as SolanaClient from "@dflow-protocol/signatory-client-lib/solana";
import { BN } from "@project-serum/anchor";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import { AuctionConfig, OFSConfig, OrderConfig, SponsoredSwapParams } from "./config";
import ERC20ABI from "./ERC-20.json";
import { ethers } from "ethers";
import assert from "node:assert";

export type FlowSimulatorParams = {
    ofsDFlowClient: DFlowClient
    endorsementKeypair: Keypair
    ofsSolanaKeypair: Keypair
    ofsConfig?: OFSConfig
    auctions: AuctionConfig[]
    orderConfigs: OrderConfig[]

    rtSolanaKeypair: Keypair

    solanaConnection: Connection

    bridgeClient: BridgeClient

    signatoryServerURL: string
    endorsementServerURL: string

    evm?: Map<number, FlowSimulatorEVMChainParams>
}

export type FlowSimulatorEVMChainParams = {
    rpcURL: string
    provider: ethers.Provider
    wethContractAddress: string
    wallet: ethers.Wallet
}

export class FlowSimulator {
    readonly params: FlowSimulatorParams
    private isStopped: boolean

    constructor(params: FlowSimulatorParams) {
        this.params = params;
        if (params.evm) {
            for (const [chainId, evmParams] of params.evm) {
                if (!ethers.isAddress(evmParams.wethContractAddress)) {
                    throw new Error("Invalid WETH contract address for chainId: " + chainId);
                }
            }
        }
        this.isStopped = false;
    }

    async start(): Promise<void> {
        const ofsDFlowAddress = await this.params.ofsDFlowClient.getSignerAddress();
        this.info("===================== Flow Simulator ====================");
        this.info(` OFS DFlow Key: ${ofsDFlowAddress}`);
        this.info(` OFS Endorsement Key: ${this.params.endorsementKeypair.publicKey}`);
        this.info(` OFS Solana Key: ${this.params.ofsSolanaKeypair.publicKey}`);
        this.info(` Retail Trader Solana Key: ${this.params.rtSolanaKeypair.publicKey}`);
        this.info(` Bridge Mint: ${this.params.bridgeClient.bridgeMint}`);
        this.info(` Bridge Program ID: ${this.params.bridgeClient.programId}`);
        this.info(` DFlow API URL: ${this.params.ofsDFlowClient.apiURL}`);
        this.info(` DFlow RPC URL: ${this.params.ofsDFlowClient.rpcURL}`);
        this.info(` Signatory Server URL: ${this.params.signatoryServerURL}`);
        this.info(` Endorsement Server URL: ${this.params.endorsementServerURL}`);
        this.info(` Solana Endpoint: ${this.params.solanaConnection.rpcEndpoint}`);
        this.info(` Solana Commitment: ${this.params.solanaConnection.commitment}`);
        if (this.params.evm) {
            for (const [chainId, evmParams] of this.params.evm) {
                this.info(` EVM Chain ID: ${chainId}`);
                this.info(`     RPC URL: ${evmParams.rpcURL}`);
                this.info(`     Retail Trader Address: ${evmParams.wallet.address}`);
            }
        }
        this.info("=========================================================");

        this.info("Starting flow simulator...");
        await this.params.ofsDFlowClient.init();
        if (this.params.auctions.length > 0) {
            await this.fundOFS();
            this.info("Funded OFS account");
            await this.createOFSAccountIfNeeded();
            await this.createAuctions();
            this.info("Created auctions");
        }
        this.validateOrderConfigs();
        this.sendOrdersForever();
    }

    private async fundOFS(): Promise<void> {
        const ofsFunding = new BN(this.params.auctions.length).mul(new BN(990000));
        const ofsRecipient = await this.params.ofsDFlowClient.getDepositRecipient();
        const depositResult = await this.params.bridgeClient.deposit({
            amount: ofsFunding,
            recipient: ofsRecipient,
            depositor: this.params.ofsSolanaKeypair.publicKey,
            signTransaction: async tx => {
                tx.sign(...[this.params.ofsSolanaKeypair]);
                return tx;
            },
            callbacks: {},
        });

        const isProcessed = await this.params.bridgeClient.waitForDeposit({
            depositStateAccountSeed: depositResult.depositStateAccountSeed,
            client: this.params.ofsDFlowClient,
        });

        if (!isProcessed) {
            throw new Error("Failed to fund OFS");
        }
    }

    private async createOFSAccountIfNeeded(): Promise<void> {
        const ofsPublicKey = await this.params.ofsDFlowClient.getSignerAddress();
        const extensions = this.params.ofsConfig?.extensions ?? "";
        try {
            await this.params.ofsDFlowClient.getOrderFlowSource(ofsPublicKey);
            this.info("OFS account already exists");
            return;
        } catch {
            // pass
        }
        const result = await this.params.ofsDFlowClient.createOFSAccount({
            flowEndorsementKey: this.params.endorsementKeypair.publicKey.toBase58(),
            extensions,
        });
        if (result.code !== 0) {
            this.error(result);
            throw new Error("Failed to create OFS account");
        }
        this.info("Created OFS account");
    }

    private async createAuctions(): Promise<void> {
        const auctions: AuctionCreateTemplate[] = this.params.auctions;
        const result = await this.params.ofsDFlowClient.createAuctions(auctions);
        if (result.code !== 0) {
            this.error(result);
            throw new Error(`Failed to create auctions`);
        }
    }

    private validateOrderConfigs(): void {
        for (const orderConfig of this.params.orderConfigs) {
            if (orderConfig.platformFeeBps && !orderConfig.platformFeeReceiver) {
                const orderId = `order network ${orderConfig.network} ID ${orderConfig.id}`;
                throw new Error(`Invalid platform fee order config for ${orderId}`);
            }
        }
    }

    private sendOrdersForever(): void {
        if (this.params.orderConfigs.length === 0) {
            this.info("Flow simulator is configured to not send orders. Exiting.");
            process.exit(0);
        }

        this.info("Sending orders");
        for (const orderConfig of this.params.orderConfigs) {
            void this.startOrderWorker(orderConfig);
        }
    }

    private async startOrderWorker(orderConfig: OrderConfig): Promise<void> {
        const orderWorkerId = `${orderConfig.network}|${orderConfig.id}`
        this.info(`Starting order worker ${orderWorkerId}`);
        const orderFlowSource = await this.params.ofsDFlowClient.getSignerAddress();
        const endorsementPlatformFeeParams = {
            platformFeeBps: orderConfig.platformFeeBps?.toString(),
            platformFeeReceiver: orderConfig.platformFeeReceiver,
        };
        while (!this.isStopped) {
            const getEndorsementAndSendOrder = async () => {
                switch (orderConfig.network) {
                    case "evm1":
                    case "evm10":
                    case "evm56":
                    case "evm137":
                    case "evm8453":
                    case "evm42161": {
                        const chainId = parseInt(orderConfig.network.substring(3));
                        const evmContext = this.params.evm?.get(chainId);
                        if (!evmContext) {
                            throw new Error(`No EVM config for chain ID ${chainId}`);
                        }
                        const retailTrader = evmContext.wallet.address;
                        const endorsement = await EndorsementClient.getEndorsement(
                            this.params.endorsementServerURL,
                            { retailTrader, ...endorsementPlatformFeeParams },
                        );
                        if (orderConfig.sponsoredSwap) {
                            await this.sendEVMSponsoredOrder({
                                sponsoredSwapParams: orderConfig.sponsoredSwap,
                                chainId: chainId,
                                id: orderWorkerId,
                                sendToken: orderConfig.sendCurrency,
                                receiveToken: orderConfig.receiveCurrency,
                                sendQty: orderConfig.sendQty,
                                orderFlowSource: orderFlowSource,
                                endorsement,
                                assertBalances: orderConfig.assertBalances,
                            });
                        } else {
                            await this.sendEVMOrder({
                                chainId: chainId,
                                id: orderWorkerId,
                                sendToken: orderConfig.sendCurrency,
                                receiveToken: orderConfig.receiveCurrency,
                                sendQty: orderConfig.sendQty,
                                orderFlowSource: orderFlowSource,
                                endorsement,
                                assertBalances: orderConfig.assertBalances,
                            });
                        }
                        break;
                    }
                    case "solana": {
                        const retailTrader = this.params.rtSolanaKeypair.publicKey.toBase58();
                        const endorsement = await EndorsementClient.getEndorsement(
                            this.params.endorsementServerURL,
                            { retailTrader, ...endorsementPlatformFeeParams },
                        );
                        await this.sendSolanaOrder({
                            id: orderWorkerId,
                            sendMint: orderConfig.sendCurrency,
                            receiveMint: orderConfig.receiveCurrency,
                            sendQty: orderConfig.sendQty,
                            useNativeToken: orderConfig.useNativeToken,
                            orderFlowSource: orderFlowSource,
                            endorsement,
                            feePayer: orderConfig.feePayer,
                        });
                        break;
                    }
                    default: {
                        const orderConfigStr = JSON.stringify(orderConfig);
                        throw new Error(`Unsupported network in order config ${orderConfigStr}`);
                    }
                }
            };
            try {
                await getEndorsementAndSendOrder();
            } catch (error) {
                this.error(orderConfig.id, `Failed to send order. Error:`, error);
            }
            await sleep(orderConfig.interval);
        }
    }

    private async sendSolanaOrder(params: SolanaOrderParams): Promise<void> {
        const firmQuoteRequest: SolanaClient.FirmQuoteRequest = {
            sendMint: params.sendMint,
            receiveMint: params.receiveMint,
            sendQty: params.sendQty,
            useNativeSOL: params.useNativeToken,
            orderFlowSource: params.orderFlowSource,
            endorsement: params.endorsement,
            feePayer: params.feePayer,
        };
        this.info(params.id, "Firm quote request", JSON.stringify(firmQuoteRequest));
        const firmQuoteResponse = await SolanaClient.getFirmQuote(
            this.params.signatoryServerURL,
            firmQuoteRequest,
        );
        this.info(params.id, "Firm quote response", firmQuoteResponse);
        switch (firmQuoteResponse.type) {
            case SolanaClient.FirmQuoteResponseType.Ok: {
                break;
            }
            case SolanaClient.FirmQuoteResponseType.PaymentInLieu: {
                await this.handlePaymentInLieuOffer({
                    id: params.id,
                    paymentInLieuToken: firmQuoteResponse.data.paymentInLieuToken,
                });
                return;
            }
            case SolanaClient.FirmQuoteResponseType.Unavailable: {
                this.error(params.id, "Firm quote unavailable");
                return;
            }
            default: {
                const _exhaustiveCheck: never = firmQuoteResponse;
                throw new Error("Can't happen");
            }
        }

        const firmQuote = firmQuoteResponse.data;
        const txBuffer = Buffer.from(firmQuote.tx, "base64");
        const tx = Transaction.from(txBuffer);
        tx.partialSign(this.params.rtSolanaKeypair);
        const sendTxRequest: SolanaClient.SendTransactionRequest = {
            tx: tx.serialize({ requireAllSignatures: false }).toString("base64"),
            requestId: firmQuote.requestId,
        };
        this.info(params.id, "Send transaction request", JSON.stringify(sendTxRequest));
        const sendTxResponse = await SolanaClient.sendTransaction(
            this.params.signatoryServerURL,
            sendTxRequest,
        );
        switch (sendTxResponse.type) {
            case SolanaClient.SendTransactionResponseType.Sent: {
                break;
            }
            case SolanaClient.SendTransactionResponseType.NotSent: {
                throw new Error("Transaction was not sent");
            }
            default: {
                const _exhaustiveCheck: never = sendTxResponse;
                throw new Error("Can't happen");
            }
        }
        this.info(params.id, "Send transaction response", JSON.stringify(sendTxResponse));
    }

    private async sendEVMOrder(params: EVMOrderParams): Promise<void> {
        if (!this.params.evm) {
            throw new Error(`No EVM config for chain ID ${params.chainId}`);
        }

        const evmParams = this.params.evm.get(params.chainId);
        if (!evmParams) {
            throw new Error(`No EVM config for chain ID ${params.chainId}`);
        }

        const {
            provider,
            wallet: retailTraderWallet,
            wethContractAddress,
        } = evmParams;

        const firmQuoteRequest: EVMLegacyClient.FirmQuoteRequest = {
            chainId: params.chainId,
            sendToken: params.sendToken,
            receiveToken: params.receiveToken,
            sendQty: params.sendQty,
            orderFlowSource: params.orderFlowSource,
            endorsement: params.endorsement,
        };
        this.info(params.id, "Firm quote request", JSON.stringify(firmQuoteRequest));
        const firmQuoteResponse = await EVMLegacyClient.getFirmQuote(
            this.params.signatoryServerURL,
            firmQuoteRequest,
        );
        this.info(params.id, "Firm quote response", firmQuoteResponse);
        switch (firmQuoteResponse.type) {
            case EVMLegacyClient.FirmQuoteResponseType.Ok: {
                break;
            }
            case EVMLegacyClient.FirmQuoteResponseType.PaymentInLieu: {
                await this.handlePaymentInLieuOffer({
                    id: params.id,
                    paymentInLieuToken: firmQuoteResponse.data.paymentInLieuToken,
                });
                return;
            }
            case EVMLegacyClient.FirmQuoteResponseType.Unavailable: {
                this.error(params.id, "Firm quote unavailable");
                return;
            }
            default: {
                const _exhaustiveCheck: never = firmQuoteResponse;
                throw new Error("Can't happen");
            }
        }

        const firmQuote = firmQuoteResponse.data;
        const allowanceTarget = firmQuote.allowanceTarget;
        const allowanceToken = params.sendToken.toLowerCase() === NATIVE_TOKEN_ADDRESS
            ? null
            : params.sendToken;
        if (allowanceTarget && allowanceToken) {
            const token = new ethers.Contract(allowanceToken, ERC20ABI, retailTraderWallet);
            const currentAllowance = await token.allowance(
                retailTraderWallet.address,
                allowanceTarget,
            );
            if (currentAllowance === BigInt(0)) {
                this.info(
                    params.id,
                    `Sending approve tx for token ${allowanceToken}, spender ${allowanceTarget}`,
                );
                const unlimitedAllowance = BigInt(2) ** BigInt(256) - BigInt(1);
                // Race to avoid blocking forever if approve tx isn't processed
                const approveTx = await Promise.race([
                    token.approve(allowanceTarget, unlimitedAllowance),
                    sleep(5_000).then(() => { throw new Error("Approve tx timed out"); }),
                ]);
                this.info(params.id, "approve tx", approveTx);
            }
        }

        const hasPlatformFee = firmQuote.platformFee;
        const fr = firmQuote.platformFee?.receiver ?? "";
        const mm = "0xcFDf762425a714f47d6632536982F8D8853acE5e";
        const rt = retailTraderWallet.address;
        const rtSendToken = params.sendToken;
        const rtRecvToken = params.receiveToken;

        const sendToken = params.sendToken === NATIVE_TOKEN_ADDRESS
            ? new ethers.Contract(wethContractAddress, ERC20ABI, retailTraderWallet)
            : new ethers.Contract(rtSendToken, ERC20ABI, retailTraderWallet);
        const recvToken = params.receiveToken === NATIVE_TOKEN_ADDRESS
            ? new ethers.Contract(wethContractAddress, ERC20ABI, retailTraderWallet)
            : new ethers.Contract(rtRecvToken, ERC20ABI, retailTraderWallet);
        const [
            rtSendBefore,
            mmSendBefore,
            rtRecvBefore,
            mmRecvBefore,
            frRecvBefore,
            rtEthBefore,
            mmEthBefore,
            frEthBefore,
        ] = await Promise.all([
            sendToken.balanceOf(rt),
            sendToken.balanceOf(mm),
            recvToken.balanceOf(rt),
            recvToken.balanceOf(mm),
            hasPlatformFee ? recvToken.balanceOf(fr) : BigInt(0),
            provider.getBalance(rt),
            provider.getBalance(mm),
            hasPlatformFee ? provider.getBalance(fr) : BigInt(0),
        ]);

        const [nonce, feeData, estimatedGas] = await Promise.all([
            retailTraderWallet.getNonce(),
            provider.getFeeData(),
            provider.estimateGas(firmQuote.tx),
        ]);
        const sendTransactionResult = await retailTraderWallet.sendTransaction({
            ...firmQuote.tx,
            nonce,
            maxFeePerGas: feeData.maxFeePerGas,
            gasLimit: estimatedGas,
        });

        const receipt = await provider.waitForTransaction(sendTransactionResult.hash);
        this.info(params.id, "Tx receipt", receipt);

        if (receipt?.status === 1) {
            const reportTxRequest: EVMLegacyClient.ReportTransactionRequest = {
                txHash: sendTransactionResult.hash,
                requestId: firmQuote.requestId,
            };
            this.info(params.id, "Report transaction request", JSON.stringify(reportTxRequest));
            const reportTxResponse = await EVMLegacyClient.reportTransaction(
                this.params.signatoryServerURL,
                reportTxRequest,
            );
            switch (reportTxResponse.type) {
                case EVMLegacyClient.ReportTransactionResponseType.Paid: {
                    break;
                }
                case EVMLegacyClient.ReportTransactionResponseType.NotPaid: {
                    throw new Error("Payment was not made");
                }
                default: {
                    const _exhaustiveCheck: never = reportTxResponse;
                    throw new Error("Can't happen");
                }
            }
            this.info(params.id, "Report transaction response", JSON.stringify(reportTxResponse));
        }

        // Sleep to give ETH balance queries time to reflect updated values
        await sleep(1_000);

        const [
            rtSend,
            mmSend,
            rtRecv,
            mmRecv,
            frRecv,
            rtEth,
            mmEth,
            frEth,
        ] = await Promise.all([
            sendToken.balanceOf(rt),
            sendToken.balanceOf(mm),
            recvToken.balanceOf(rt),
            recvToken.balanceOf(mm),
            hasPlatformFee ? recvToken.balanceOf(fr) : BigInt(0),
            provider.getBalance(rt),
            provider.getBalance(mm),
            hasPlatformFee ? provider.getBalance(fr) : BigInt(0),
        ]);

        const rtSendDiff = rtSend - rtSendBefore;
        const rtRecvDiff = rtRecv - rtRecvBefore;
        const rtEthDiff = rtEth - rtEthBefore;
        const mmSendDiff = mmSend - mmSendBefore;
        const mmRecvDiff = mmRecv - mmRecvBefore;
        const mmEthDiff = mmEth - mmEthBefore;
        const frRecvDiff = frRecv - frRecvBefore;
        const frEthDiff = frEth - frEthBefore;

        const rtSendQty = BigInt(params.sendQty);
        const rtRecvQty = BigInt(firmQuote.receiveQty);

        this.info(params.id, "rt       send", rtSendQty.toString(), rtSendToken);
        this.info(params.id, "rt       recv", rtRecvQty.toString(), rtRecvToken);

        this.info(params.id, "rtSend before", rtSendBefore.toString());
        this.info(params.id, "rtRecv before", rtRecvBefore.toString());
        this.info(params.id, "rtEth  before", rtEthBefore.toString());
        this.info(params.id, "mmSend before", mmSendBefore.toString());
        this.info(params.id, "mmRecv before", mmRecvBefore.toString());
        this.info(params.id, "mmEth  before", mmEthBefore.toString());

        this.info(params.id, "rtSend  after", rtSend.toString());
        this.info(params.id, "rtRecv  after", rtRecv.toString());
        this.info(params.id, "rtEth   after", rtEth.toString());
        this.info(params.id, "mmSend  after", mmSend.toString());
        this.info(params.id, "mmRecv  after", mmRecv.toString());
        this.info(params.id, "mmEth   after", mmEth.toString());

        this.info(params.id, "rtSend   diff", rtSendDiff.toString());
        this.info(params.id, "rtRecv   diff", rtRecvDiff.toString());
        this.info(params.id, "rtEth    diff", rtEthDiff.toString());
        this.info(params.id, "mmSend   diff", mmSendDiff.toString());
        this.info(params.id, "mmRecv   diff", mmRecvDiff.toString());
        this.info(params.id, "mmEth    diff", mmEthDiff.toString());
        this.info(params.id, "frRecv   diff", frRecvDiff.toString());
        this.info(params.id, "frEth    diff", frEthDiff.toString());

        if (!params.assertBalances) {
            return;
        }
        if (!receipt) {
            throw new Error("Failed to get receipt");
        }
        const gasCost = receipt.gasPrice * receipt.gasUsed;
        const quotePlatformFee = BigInt(firmQuote.platformFee?.qty ?? 0);
        if (params.sendToken === NATIVE_TOKEN_ADDRESS) {
            assert.equal(rtEth, rtEthBefore - BigInt(firmQuote.sendQty) - gasCost);
            assert.equal(rtSend, rtSendBefore);
        } else if (params.receiveToken === NATIVE_TOKEN_ADDRESS) {
            assert.equal(rtEth, rtEthBefore + BigInt(firmQuote.receiveQty) - gasCost);
            assert.equal(rtRecv, rtRecvBefore);
            assert.equal(frEth, frEthBefore + quotePlatformFee);
            assert.equal(frRecv, frRecvBefore);
        } else {
            assert.equal(rtEth, rtEthBefore - gasCost);
            assert.equal(rtSend, rtSendBefore - BigInt(firmQuote.sendQty));
            assert.equal(rtRecv, rtRecvBefore + BigInt(firmQuote.receiveQty));
        }
        assert.equal(mmEth, mmEthBefore);
        assert.equal(mmSend, mmSendBefore + BigInt(firmQuote.sendQty));
        assert.equal(mmRecv, mmRecvBefore - BigInt(firmQuote.receiveQty) - quotePlatformFee);
        if (params.receiveToken === NATIVE_TOKEN_ADDRESS) {
            assert.equal(frEth, frEthBefore + quotePlatformFee);
            assert.equal(frRecv, frRecvBefore);
        } else {
            assert.equal(frEth, frEthBefore);
            assert.equal(frRecv, frRecvBefore + quotePlatformFee);
        }
    }

    private async sendEVMSponsoredOrder(params: EVMSponsoredOrderParams): Promise<void> {
        if (!this.params.evm) {
            throw new Error(`No EVM config for chain ID ${params.chainId}`);
        }

        const evmParams = this.params.evm.get(params.chainId);
        if (!evmParams) {
            throw new Error(`No EVM config for chain ID ${params.chainId}`);
        }

        const {
            provider,
            wallet: retailTraderWallet,
            wethContractAddress,
        } = evmParams;

        let feeMode: EVMSponsoredClient.FeeMode;
        switch (params.sponsoredSwapParams.mode) {
            case "RTSend": {
                feeMode = {
                    mode: EVMSponsoredClient.SponsoredSwapFeeMode[params.sponsoredSwapParams.mode],
                    maxAllowedSend: params.sponsoredSwapParams.maxAllowedSend,
                };
                break;
            }
            case "RTRecv": {
                feeMode = {
                    mode: EVMSponsoredClient.SponsoredSwapFeeMode[params.sponsoredSwapParams.mode],
                    maxAllowedSend: params.sponsoredSwapParams.maxAllowedSend,
                    maxAllowedRecv: params.sponsoredSwapParams.maxAllowedRecv,
                };
                break;
            }
            default: {
                const _exhaustiveCheck: never = params.sponsoredSwapParams;
                throw new Error(
                    `Unrecognized fee mode ${JSON.stringify(params.sponsoredSwapParams)}`
                );
            }
        }
        const firmQuoteRequest: EVMSponsoredClient.FirmQuoteRequest = {
            chainId: params.chainId,
            sendToken: params.sendToken,
            receiveToken: params.receiveToken,
            sendQty: params.sendQty,
            orderFlowSource: params.orderFlowSource,
            endorsement: params.endorsement,
            feeMode,
        };
        this.info(params.id, "Sponsored firm quote request", JSON.stringify(firmQuoteRequest));
        const firmQuoteResponse = await EVMSponsoredClient.getFirmQuote(
            this.params.signatoryServerURL,
            firmQuoteRequest,
        );
        this.info(params.id, "Sponsored firm quote response", firmQuoteResponse);
        switch (firmQuoteResponse.type) {
            case EVMSponsoredClient.FirmQuoteResponseType.Ok: {
                break;
            }
            case EVMSponsoredClient.FirmQuoteResponseType.PaymentInLieu: {
                await this.handlePaymentInLieuOffer({
                    id: params.id,
                    paymentInLieuToken: firmQuoteResponse.data.paymentInLieuToken,
                });
                return;
            }
            case EVMSponsoredClient.FirmQuoteResponseType.Unavailable: {
                this.error(params.id, "Firm quote unavailable");
                return;
            }
            default: {
                const _exhaustiveCheck: never = firmQuoteResponse;
                throw new Error("Can't happen");
            }
        }

        const firmQuote = firmQuoteResponse.data;
        const allowanceTarget = firmQuote.allowanceTarget;
        const paramSendToken = params.sendToken;
        const allowanceToken = paramSendToken.toLowerCase() === NATIVE_TOKEN_ADDRESS
            ? null
            : paramSendToken;
        if (allowanceTarget && allowanceToken) {
            const token = new ethers.Contract(allowanceToken, ERC20ABI, retailTraderWallet);
            const currentAllowance = await token.allowance(
                retailTraderWallet.address,
                allowanceTarget,
            );
            if (currentAllowance === BigInt(0)) {
                this.info(
                    params.id,
                    `Sending approve tx for token ${allowanceToken}, spender ${allowanceTarget}`,
                );
                const unlimitedAllowance = BigInt(2) ** BigInt(256) - BigInt(1);
                // Race to avoid blocking forever if approve tx isn't processed
                const approveTx = await Promise.race([
                    token.approve(allowanceTarget, unlimitedAllowance),
                    sleep(5_000).then(() => { throw new Error("Approve tx timed out"); }),
                ]);
                this.info(params.id, "approve tx", approveTx);
            }
        }

        const hasPlatformFee = firmQuote.platformFee;
        const fr = firmQuote.platformFee?.receiver ?? "";
        const mm = "0xcFDf762425a714f47d6632536982F8D8853acE5e";
        const rt = retailTraderWallet.address;
        const rtSendToken = params.sendToken;
        const rtRecvToken = params.receiveToken;

        const sendToken = params.sendToken === NATIVE_TOKEN_ADDRESS
            ? new ethers.Contract(wethContractAddress, ERC20ABI, retailTraderWallet)
            : new ethers.Contract(rtSendToken, ERC20ABI, retailTraderWallet);
        const recvToken = params.receiveToken === NATIVE_TOKEN_ADDRESS
            ? new ethers.Contract(wethContractAddress, ERC20ABI, retailTraderWallet)
            : new ethers.Contract(rtRecvToken, ERC20ABI, retailTraderWallet);
        const [
            rtSendBefore,
            mmSendBefore,
            rtRecvBefore,
            mmRecvBefore,
            frRecvBefore,
            rtEthBefore,
            mmEthBefore,
            frEthBefore,
        ] = await Promise.all([
            sendToken.balanceOf(rt),
            sendToken.balanceOf(mm),
            recvToken.balanceOf(rt),
            recvToken.balanceOf(mm),
            hasPlatformFee ? recvToken.balanceOf(fr) : BigInt(0),
            provider.getBalance(rt),
            provider.getBalance(mm),
            hasPlatformFee ? provider.getBalance(fr) : BigInt(0),
        ]);

        const eip712order = firmQuote.order;
        const orderSignature = await retailTraderWallet.signTypedData(
            eip712order.domain,
            eip712order.types,
            eip712order.value,
        );

        const sendTxRequest: EVMSponsoredClient.SendTransactionRequest = {
            orderSignature: orderSignature,
            requestId: firmQuote.requestId,
        };
        this.info(params.id, "Sponsored send transaction request", JSON.stringify(sendTxRequest));
        const sendTxResponse = await EVMSponsoredClient.sendTransaction(
            this.params.signatoryServerURL,
            sendTxRequest,
        );
        switch (sendTxResponse.type) {
            case EVMSponsoredClient.SendTransactionResponseType.Sent: {
                break;
            }
            case EVMSponsoredClient.SendTransactionResponseType.NotSent: {
                throw new Error("Transaction was not sent");
            }
            default: {
                const _exhaustiveCheck: never = sendTxResponse;
                throw new Error("Can't happen");
            }
        }
        this.info(params.id, "Sponsored send transaction response", JSON.stringify(sendTxResponse));

        const receipt = await provider.waitForTransaction(sendTxResponse.data.txHash);
        this.info(params.id, "Tx receipt", receipt);

        // Sleep to give ETH balance queries time to reflect updated values
        await sleep(1_000);

        const [
            rtSend,
            mmSend,
            rtRecv,
            mmRecv,
            frRecv,
            rtEth,
            mmEth,
            frEth,
        ] = await Promise.all([
            sendToken.balanceOf(rt),
            sendToken.balanceOf(mm),
            recvToken.balanceOf(rt),
            recvToken.balanceOf(mm),
            hasPlatformFee ? recvToken.balanceOf(fr) : BigInt(0),
            provider.getBalance(rt),
            provider.getBalance(mm),
            hasPlatformFee ? provider.getBalance(fr) : BigInt(0),
        ]);

        const rtSendDiff = rtSend - rtSendBefore;
        const rtRecvDiff = rtRecv - rtRecvBefore;
        const rtEthDiff = rtEth - rtEthBefore;
        const mmSendDiff = mmSend - mmSendBefore;
        const mmRecvDiff = mmRecv - mmRecvBefore;
        const mmEthDiff = mmEth - mmEthBefore;
        const frRecvDiff = frRecv - frRecvBefore;
        const frEthDiff = frEth - frEthBefore;

        const rtSendQty = BigInt(params.sendQty);
        const rtRecvQty = BigInt(firmQuote.receiveQty);

        this.info(params.id, "rt       send", rtSendQty.toString(), rtSendToken);
        this.info(params.id, "rt       recv", rtRecvQty.toString(), rtRecvToken);

        this.info(params.id, "rtSend before", rtSendBefore.toString());
        this.info(params.id, "rtRecv before", rtRecvBefore.toString());
        this.info(params.id, "rtEth  before", rtEthBefore.toString());
        this.info(params.id, "mmSend before", mmSendBefore.toString());
        this.info(params.id, "mmRecv before", mmRecvBefore.toString());
        this.info(params.id, "mmEth  before", mmEthBefore.toString());

        this.info(params.id, "rtSend  after", rtSend.toString());
        this.info(params.id, "rtRecv  after", rtRecv.toString());
        this.info(params.id, "rtEth   after", rtEth.toString());
        this.info(params.id, "mmSend  after", mmSend.toString());
        this.info(params.id, "mmRecv  after", mmRecv.toString());
        this.info(params.id, "mmEth   after", mmEth.toString());

        this.info(params.id, "rtSend   diff", rtSendDiff.toString());
        this.info(params.id, "rtRecv   diff", rtRecvDiff.toString());
        this.info(params.id, "rtEth    diff", rtEthDiff.toString());
        this.info(params.id, "mmSend   diff", mmSendDiff.toString());
        this.info(params.id, "mmRecv   diff", mmRecvDiff.toString());
        this.info(params.id, "mmEth    diff", mmEthDiff.toString());
        this.info(params.id, "frRecv   diff", frRecvDiff.toString());
        this.info(params.id, "frEth    diff", frEthDiff.toString());

        if (!params.assertBalances) {
            return;
        }
        if (!receipt) {
            throw new Error("Failed to get receipt");
        }
        const gasCost = receipt.gasPrice * receipt.gasUsed;
        const quotePlatformFee = BigInt(firmQuote.platformFee?.qty ?? 0);
        if (params.sendToken === NATIVE_TOKEN_ADDRESS) {
            assert.equal(rtEth, rtEthBefore - BigInt(firmQuote.sendQty) - gasCost);
            assert.equal(rtSend, rtSendBefore);
        } else if (params.receiveToken === NATIVE_TOKEN_ADDRESS) {
            assert.equal(rtEth, rtEthBefore + BigInt(firmQuote.receiveQty) - gasCost);
            assert.equal(rtRecv, rtRecvBefore);
            assert.equal(frEth, frEthBefore + quotePlatformFee);
            assert.equal(frRecv, frRecvBefore);
        } else {
            assert.equal(rtEth, rtEthBefore - gasCost);
            assert.equal(rtSend, rtSendBefore - BigInt(firmQuote.sendQty));
            assert.equal(rtRecv, rtRecvBefore + BigInt(firmQuote.receiveQty));
        }
        assert.equal(mmEth, mmEthBefore);
        assert.equal(mmSend, mmSendBefore + BigInt(firmQuote.sendQty));
        assert.equal(mmRecv, mmRecvBefore - BigInt(firmQuote.receiveQty) - quotePlatformFee);
        if (params.receiveToken === NATIVE_TOKEN_ADDRESS) {
            assert.equal(frEth, frEthBefore + quotePlatformFee);
            assert.equal(frRecv, frRecvBefore);
        } else {
            assert.equal(frEth, frEthBefore);
            assert.equal(frRecv, frRecvBefore + quotePlatformFee);
        }
    }

    private async handlePaymentInLieuOffer(params: HandlePaymentInLieuParams): Promise<void> {
        const paymentInLieuToken = params.paymentInLieuToken;
        const approval = await EndorsementClient.getPaymentInLieuApproval(
            this.params.endorsementServerURL,
            { paymentInLieuToken },
        );
        try {
            const result = await acceptPaymentInLieu(this.params.signatoryServerURL, {
                paymentInLieuToken,
                approver: approval.approver,
                approval: approval.approval,
            });
            this.info(params.id, "Payment in lieu tx hash", result.txHash);
        } catch (error) {
            this.error(params.id, "Payment in lieu failed. Error:", error);
        }
    }

    private getLogPrefix(level: string): string {
        const timestamp = new Date().toISOString();
        return `FlowSimulator|${timestamp}|${level}`.padEnd(48);
    }

    private debug(...data: any[]): void {
        const timestamp = this.getLogPrefix("DEBUG");
        console.debug(timestamp, ...data);
    }

    private info(...data: any[]): void {
        const timestamp = this.getLogPrefix("INFO");
        console.info(timestamp, ...data);
    }

    private error(...data: any[]): void {
        const timestamp = this.getLogPrefix("ERROR");
        console.error(timestamp, ...data);
    }
}

type SolanaOrderParams = {
    id: string
    sendMint: string
    receiveMint: string
    sendQty: string
    useNativeToken?: boolean
    orderFlowSource: string
    endorsement: Endorsement
    feePayer?: SolanaClient.FeePayer
}

type EVMOrderParams = {
    chainId: number
    id: string
    sendToken: string
    receiveToken: string
    sendQty: string
    orderFlowSource: string
    endorsement: Endorsement
    assertBalances?: boolean
}

type EVMSponsoredOrderParams = {
    sponsoredSwapParams: SponsoredSwapParams
    chainId: number
    id: string
    sendToken: string
    receiveToken: string
    sendQty: string
    orderFlowSource: string
    endorsement: Endorsement
    assertBalances?: boolean
}

type HandlePaymentInLieuParams = {
    id: string
    paymentInLieuToken: PaymentInLieuToken
}

async function sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
