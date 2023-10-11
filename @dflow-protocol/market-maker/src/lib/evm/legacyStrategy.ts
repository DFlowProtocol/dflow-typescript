import { RfqOrder, SignatureType } from "@0x/protocol-utils";
import { BigNumber } from "@0x/utils";
import {
    FirmQuotePostRequest,
    FirmQuotePostResponse,
    FirmQuoteResponseCode,
} from "@dflow-protocol/market-maker-evm-client-lib/legacy";
import { MarketMakerEVMChainContext } from "../../context";
import { randomUUID } from "crypto";

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

export class EVMLegacyStrategy {
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
            txOrigin: quoteParams.txOrigin,
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
            expiry: order.expiry.toString(16),
            salt: order.salt.toString(16),
            rfqOrderSignature: signature,
            quoteId: randomUUID(),
        };
    }

    private getLogPrefix(level: string): string {
        const timestamp = new Date().toISOString();
        return `LegacyStrategy|${timestamp}|${level}`.padEnd(48);
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
