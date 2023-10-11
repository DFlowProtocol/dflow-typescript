import {
    SendTransactionPostResponse,
    SendTransactionResponseCode,
} from "@dflow-protocol/market-maker-solana-client-lib";
import { getAssociatedTokenAddressSync, NATIVE_MINT } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";

export interface ISolanaStrategy {
    getIndicativeQuote(params: IndicativeQuoteParams): Promise<IndicativeQuoteResult>
    getFirmQuote(params: FirmQuoteParams): Promise<FirmQuoteResult>
    sendTransaction(tx: Transaction): Promise<SendTransactionPostResponse>
}

export type IndicativeQuoteParams = {
    xMint: PublicKey
    yMint: PublicKey
    minFillPrice: bigint
    auctionId: bigint
    auctionEpoch: bigint
}

export type FirmQuoteParams = {
    xMint: PublicKey
    yMint: PublicKey
    xQty: bigint
    minFillQty: bigint
    auctionId: bigint
    auctionEpoch: bigint
}

type SolanaStrategyParams = {
    connection: Connection
    keypair: Keypair
}

export class SolanaStrategy implements ISolanaStrategy {
    params: SolanaStrategyParams

    constructor(params: SolanaStrategyParams) {
        this.params = params;
    }

    async getIndicativeQuote(quoteParams: IndicativeQuoteParams): Promise<IndicativeQuoteResult> {
        return { fillPrice: quoteParams.minFillPrice };
    }

    async getFirmQuote(quoteParams: FirmQuoteParams): Promise<FirmQuoteResult> {
        const { xMint, yMint, minFillQty } = quoteParams;

        const xAccount = xMint.equals(NATIVE_MINT)
            ? this.params.keypair.publicKey
            : getAssociatedTokenAddressSync(xMint, this.params.keypair.publicKey);
        const yAccount = yMint.equals(NATIVE_MINT)
            ? this.params.keypair.publicKey
            : getAssociatedTokenAddressSync(yMint, this.params.keypair.publicKey);

        return {
            fillQty: minFillQty,
            xAccount,
            yAccount,
            yTokenAccountOwner: this.params.keypair.publicKey,
            feePayer: this.params.keypair.publicKey,
        };
    }

    async sendTransaction(tx: Transaction): Promise<SendTransactionPostResponse> {
        tx.partialSign(this.params.keypair);
        const serializedTx = tx.serialize();
        try {
            const signature = await this.params.connection.sendRawTransaction(serializedTx);
            return {
                code: SendTransactionResponseCode.Sent,
                signature,
            };
        } catch (error) {
            this.error(`Failed to send transaction. Error:`, error);
            return { code: SendTransactionResponseCode.NotSent };
        }
    }

    private getLogPrefix(level: string): string {
        const timestamp = new Date().toISOString();
        return `Strategy|${timestamp}|${level}`.padEnd(48);
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

export type FirmQuoteResult = {
    fillQty: bigint
    xAccount: PublicKey
    yAccount: PublicKey
    yTokenAccountOwner: PublicKey
    feePayer: PublicKey
}
