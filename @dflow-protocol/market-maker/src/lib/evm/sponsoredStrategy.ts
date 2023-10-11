import { RfqOrder, SignatureType } from "@0x/protocol-utils";
import { BigNumber } from "@0x/utils";
import {
    FirmQuotePostRequest,
    FirmQuotePostResponse,
    FirmQuoteResponseCode,
    SendTransactionPostResponse,
    SendTransactionResponseCode,
} from "@dflow-protocol/market-maker-evm-client-lib/sponsored";
import { MarketMakerEVMChainContext } from "../../context";
import { randomUUID } from "crypto";
import { ethers } from "ethers";

export type IndicativeQuoteParams = {
    xToken: string
    yToken: string
    minFillPrice: bigint
    auctionId: bigint
    auctionEpoch: bigint
}

export type FirmQuoteParams = {
    xToken: string
    yToken: string
    xQty: bigint
    minFillQty: bigint
    retailTrader: string
    chainId: number
    verifyingContract: string
    auctionId: bigint
    auctionEpoch: bigint
    evmChainContext: MarketMakerEVMChainContext
}

export class EVMSponsoredStrategy {
    async getIndicativeQuote(quoteParams: IndicativeQuoteParams): Promise<IndicativeQuoteResult> {
        return { fillPrice: quoteParams.minFillPrice };
    }

    async getFirmQuote(
        quoteParams: FirmQuotePostRequest,
        context: MarketMakerEVMChainContext,
    ): Promise<FirmQuotePostResponse> {
        const fillQty = quoteParams.minFillQty;
        const salt = new BigNumber(1);
        const order = new RfqOrder({
            chainId: quoteParams.chainId,
            verifyingContract: quoteParams.verifyingContract,
            maker: context.wallet.address,
            taker: quoteParams.taker,
            makerToken: quoteParams.receiveToken,
            takerToken: quoteParams.sendToken,
            makerAmount: new BigNumber(fillQty),
            takerAmount: new BigNumber(quoteParams.sendQty),
            txOrigin: context.wallet.address,
            expiry: new BigNumber(quoteParams.minExpiry),
            salt,
        });

        const signature = order.getSignatureWithKey(
            context.wallet.privateKey,
            SignatureType.EIP712,
        );

        return {
            code: FirmQuoteResponseCode.Ok,
            fillQty: fillQty,
            maker: order.maker,
            txOrigin: order.txOrigin,
            expiry: order.expiry.toString(16),
            salt: order.salt.toString(16),
            rfqOrderSignature: signature,
            quoteId: randomUUID(),
        };
    }

    async sendTransaction(
        tx: ethers.Transaction,
        context: MarketMakerEVMChainContext,
    ): Promise<SendTransactionPostResponse> {
        try {
            const [nonce, feeData] = await Promise.all([
                context.wallet.getNonce(),
                context.provider.getFeeData(),
            ]);
            tx.nonce = nonce;
            tx.gasLimit = 500_000;
            tx.maxFeePerGas = feeData.maxFeePerGas;
            const signedTx = await context.wallet.signTransaction(tx);
            const result = await context.provider.broadcastTransaction(signedTx);
            return { code: SendTransactionResponseCode.Sent, txHash: result.hash };
        } catch (error) {
            this.error(`Failed to send transaction. Error:`, error);
            return { code: SendTransactionResponseCode.NotSent };
        }
    }

    private getLogPrefix(level: string): string {
        const timestamp = new Date().toISOString();
        return `SponsoredStrategy|${timestamp}|${level}`.padEnd(48);
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

export type IndicativeQuoteResult = {
    fillPrice: bigint
}
