import {
    FirmQuotePostResponse,
    FirmQuoteResponseCode,
    IndicativeQuoteGetResponse,
    schemaFirmQuotePostRequest,
    schemaIndicativeQuoteGetQuery,
    schemaSendTransactionPostRequest,
    SendTransactionPostResponse,
} from "@dflow-protocol/market-maker-solana-client-lib";
import { flowApiPaths } from "@dflow-protocol/signatory-client-lib";
import { PublicKey, Transaction } from "@solana/web3.js";
import { Request, Response, Router } from "express";
import { MarketMakerAPIContext, MarketMakerAPISolanaContext } from "../context";

export class MarketMakerAPISolanaRouter {
    readonly context: MarketMakerAPIContext;
    readonly solanaContext: MarketMakerAPISolanaContext;
    readonly router: Router;

    constructor(context: MarketMakerAPIContext, solanaContext: MarketMakerAPISolanaContext) {
        this.context = context;
        this.solanaContext = solanaContext;
        this.router = Router();

        this.indicativeQuote = this.indicativeQuote.bind(this);
        this.router.get(flowApiPaths.indicativeQuote, this.indicativeQuote);

        this.firmQuote = this.firmQuote.bind(this);
        this.router.post(flowApiPaths.firmQuote, this.firmQuote);

        this.sendTransaction = this.sendTransaction.bind(this);
        this.router.post(flowApiPaths.sendTransaction, this.sendTransaction);
    }

    async indicativeQuote(
        req: Request,
        res: Response<IndicativeQuoteGetResponse>,
    ): Promise<Response<IndicativeQuoteGetResponse>> {
        const params = schemaIndicativeQuoteGetQuery.parse(req.query);
        const quote = await this.solanaContext.strategy.getIndicativeQuote({
            xMint: new PublicKey(params.sendMint),
            yMint: new PublicKey(params.receiveMint),
            minFillPrice: BigInt(params.minFillPrice),
            auctionId: BigInt(params.auctionId),
            auctionEpoch: BigInt(params.auctionEpoch),
        });

        return res.json({
            fillPrice: quote.fillPrice.toString(),
        });
    }

    async firmQuote(
        req: Request,
        res: Response<FirmQuotePostResponse>,
    ): Promise<Response<FirmQuotePostResponse>> {
        const request = schemaFirmQuotePostRequest.parse(req.body);
        const quote = await this.solanaContext.strategy.getFirmQuote({
            xMint: new PublicKey(request.sendMint),
            yMint: new PublicKey(request.receiveMint),
            xQty: BigInt(request.sendQty),
            minFillQty: BigInt(request.minFillQty),
            auctionId: BigInt(request.auctionId),
            auctionEpoch: BigInt(request.auctionEpoch),
        });

        return res.json({
            code: FirmQuoteResponseCode.Ok,
            fillQty: quote.fillQty.toString(),
            xAccount: quote.xAccount.toBase58(),
            yAccount: quote.yAccount.toBase58(),
            yTokenAccountOwner: quote.yTokenAccountOwner.toBase58(),
            feePayer: quote.feePayer.toBase58(),
            quoteId: "",
        });
    }

    async sendTransaction(
        req: Request,
        res: Response<SendTransactionPostResponse>,
    ): Promise<Response<SendTransactionPostResponse>> {
        const request = schemaSendTransactionPostRequest.parse(req.body);
        const transactionBuffer = Buffer.from(request.tx, "base64");
        const transaction = Transaction.from(transactionBuffer);
        const result = await this.solanaContext.strategy.sendTransaction(transaction);

        return res.json(result);
    }
}
