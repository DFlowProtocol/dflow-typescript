import { Eip712ObjectProperty } from "@dflow-protocol/market-maker-evm-client-lib";
import {
    FirmQuotePostRequest,
    FirmQuotePostResponse,
    FirmQuoteResponseCode,
} from "@dflow-protocol/market-maker-evm-client-lib/standard";
import { MarketMakerEVMChainContext } from "../../context";
import { randomUUID } from "crypto";
import { Signature } from "ethers";

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

export class EVMStandardStrategy {
    async getIndicativeQuote(quoteParams: IndicativeQuoteParams): Promise<IndicativeQuoteResult> {
        return { fillPrice: quoteParams.minFillPrice };
    }

    async getFirmQuote(
        quoteParams: FirmQuotePostRequest,
        context: MarketMakerEVMChainContext,
    ): Promise<FirmQuotePostResponse> {
        const fillQty = quoteParams.minFillQty;
        const expiry = quoteParams.minExpiry;
        const expiryFlagsAndNonce
            = BigInt(expiry) << BigInt(192)
            | BigInt(quoteParams.flags)
            | BigInt(quoteParams.nonceBucket) << BigInt(64)
            | BigInt(quoteParams.nonce);

        const order = {
            txOrigin: quoteParams.txOrigin,
            taker: quoteParams.taker,
            makerToken: quoteParams.makerToken,
            takerToken: quoteParams.takerToken,
            makerAmountAndTakerAmount: quoteParams.useMakerAmountAndTakerAmount
                ? BigInt(fillQty) << BigInt(128) | BigInt(quoteParams.sendQty)
                : undefined,
            makerAmount: quoteParams.useMakerAmountAndTakerAmount ? undefined : fillQty,
            takerAmount: quoteParams.useMakerAmountAndTakerAmount ? undefined : quoteParams.sendQty,
            expiryFlagsAndNonce: expiryFlagsAndNonce,
            platformFeeReceiver: quoteParams.platformFeeReceiver,
            platformFee: quoteParams.platformFee,
        };

        const { domain, types } = quoteParams.eip712;
        // Ethers signTypedData doesn't allow the EIP712Domain type to be specified in the types
        const typesWithoutEip712Domain = Object.keys(types).reduce((acc, key) => {
            if (key !== "EIP712Domain") {
                acc[key] = types[key];
            }
            return acc;
        }, {} as Record<string, Eip712ObjectProperty[]>);

        const rawSignature = await context.wallet.signTypedData(
            domain,
            typesWithoutEip712Domain,
            order,
        );
        const signature = Signature.from(rawSignature);

        return {
            code: FirmQuoteResponseCode.Ok,
            fillQty: fillQty,
            maker: context.wallet.address,
            expiry: expiry,
            orderSignature: {
                r: signature.r,
                s: signature.s,
                v: signature.v,
            },
            quoteId: randomUUID(),
        };
    }

    private getLogPrefix(level: string): string {
        const timestamp = new Date().toISOString();
        return `StandardStrategy|${timestamp}|${level}`.padEnd(48);
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
