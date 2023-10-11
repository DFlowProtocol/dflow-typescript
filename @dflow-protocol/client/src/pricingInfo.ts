import {
    QueryPricingInfoResponsePricingInfo,
} from "@dflow-protocol/client-core/dist/dflow.auction/rest";


export class PricingInfo {
    auctionExistsForPair: boolean
    flowEndorsementKey1: string
    flowEndorsementKey2: string
    ofsAccountExtensions: string

    constructor(raw: QueryPricingInfoResponsePricingInfo) {
        if (raw.auctionExistsForPair === undefined) {
            throw new Error("auctionExistsForPair undefined");
        }
        this.auctionExistsForPair = raw.auctionExistsForPair;
        if (raw.flowEndorsementKey1 === undefined) {
            throw new Error("flowEndorsementKey1 undefined");
        }
        this.flowEndorsementKey1 = raw.flowEndorsementKey1;
        if (raw.flowEndorsementKey2 === undefined) {
            throw new Error("flowEndorsementKey2 undefined");
        }
        this.flowEndorsementKey2 = raw.flowEndorsementKey2;
        if (raw.ofsAccountExtensions === undefined) {
            throw new Error("ofsAccountExtensions undefined");
        }
        this.ofsAccountExtensions = raw.ofsAccountExtensions;
    }
}
