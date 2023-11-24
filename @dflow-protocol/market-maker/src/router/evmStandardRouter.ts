import {
    FirmQuotePostResponse,
    IndicativeQuoteGetResponse,
    schemaFirmQuotePostRequest,
    schemaIndicativeQuoteGetQuery,
} from "@dflow-protocol/market-maker-evm-client-lib/standard";
import { flowApiPaths } from "@dflow-protocol/signatory-client-lib";
import { Request, Response, Router } from "express";
import { MarketMakerAPIContext, MarketMakerAPIEVMContext } from "../context";

export class MarketMakerAPIEVMStandardRouter {
    readonly context: MarketMakerAPIContext;
    readonly evmContext: MarketMakerAPIEVMContext;
    readonly router: Router;

    constructor(context: MarketMakerAPIContext, evmContext: MarketMakerAPIEVMContext) {
        this.context = context;
        this.evmContext = evmContext;
        this.router = Router();

        this.indicativeQuote = this.indicativeQuote.bind(this);
        this.router.get(flowApiPaths.indicativeQuote, this.indicativeQuote);

        this.firmQuote = this.firmQuote.bind(this);
        this.router.post(flowApiPaths.firmQuote, this.firmQuote);
    }

    async indicativeQuote(
        req: Request,
        res: Response<IndicativeQuoteGetResponse>,
    ): Promise<Response<IndicativeQuoteGetResponse>> {
        const params = schemaIndicativeQuoteGetQuery.parse(req.query);
        const quote = await this.evmContext.standardStrategy.getIndicativeQuote({
            xToken: params.sendToken,
            yToken: params.receiveToken,
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
        const chainContext = this.evmContext.getChainContextByAuction(BigInt(request.auctionId));
        if (!chainContext) {
            throw new Error(`No chain context for auction ${request.auctionId}`);
        }

        const quote = await this.evmContext.standardStrategy.getFirmQuote(request, chainContext);

        return res.json(quote);
    }
}
