import express, { Express, NextFunction, Request, Response } from "express";
import "express-async-errors";
import helmet from "helmet";
import http from "http";
import StatusCodes from "http-status-codes";
import morgan from "morgan";
import {
    MarketMakerAPIContext,
    MarketMakerAPIEVMContext,
    MarketMakerAPISolanaContext,
} from "./context";
import { MarketMakerAPIEVMLegacyRouter } from "./router/evmLegacyRouter";
import { MarketMakerAPIEVMSponsoredRouter } from "./router/evmSponsoredRouter";
import { MarketMakerAPISolanaRouter } from "./router/solanaRouter";

type MarketMakerServerParams = {
    context: MarketMakerAPIContext
    solanaContext?: MarketMakerAPISolanaContext
    evmContext?: MarketMakerAPIEVMContext
}

export class MarketMakerServer {
    readonly app: Express;
    listeningServer: http.Server | undefined;

    constructor(params: MarketMakerServerParams) {
        const { context, solanaContext, evmContext } = params;

        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(morgan("combined"));
        this.app.use(helmet());
        this.app.use(apiPath.healthCheck, (_req: Request, res: Response, _next: NextFunction) => {
            return res.json("healthy");
        });

        if (solanaContext) {
            const solanaAPI = new MarketMakerAPISolanaRouter(context, solanaContext);
            this.app.use(apiPath.solana, solanaAPI.router);
        }

        if (evmContext) {
            const evmSponsoredAPI = new MarketMakerAPIEVMSponsoredRouter(context, evmContext);
            this.app.use(apiPath.evmSponsored, evmSponsoredAPI.router);
            const evmLegacyAPI = new MarketMakerAPIEVMLegacyRouter(context, evmContext);
            this.app.use(apiPath.evmLegacy, evmLegacyAPI.router);
        }

        this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
            context.logger.error(err);
            const status = StatusCodes.BAD_REQUEST;
            return res.status(status).json({
                error: err.message,
            });
        });
    }

    listen(port: number, opts?: ListenOpts) {
        this.listeningServer = this.app.listen(port, opts?.callback);
        if (opts?.keepAliveTimeout !== undefined) {
            this.listeningServer.keepAliveTimeout = opts.keepAliveTimeout;
        }
    }

    stop() {
        this.listeningServer?.close();
    }
}

export const apiPath = {
    healthCheck: "/health-check",
    solana: "/solana",
    evmLegacy: "/evm/legacy",
    evmSponsored: "/evm/sponsored",
} as const;

type ListenOpts = {
    callback?: () => void
    /** HTTP keep-alive timeout in milliseconds */
    keepAliveTimeout?: number
}
