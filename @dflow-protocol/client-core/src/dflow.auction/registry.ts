import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgDeliverNotional } from "./types/auction/tx";
import { MsgUpdateAuction } from "./types/auction/tx";
import { MsgDeleteAuction } from "./types/auction/tx";
import { MsgCreateAuction } from "./types/auction/tx";
import { MsgRevealBid } from "./types/auction/tx";
import { MsgBlindBid } from "./types/auction/tx";
import { MsgReviseBlindBid } from "./types/auction/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/dflow.auction.MsgDeliverNotional", MsgDeliverNotional],
    ["/dflow.auction.MsgUpdateAuction", MsgUpdateAuction],
    ["/dflow.auction.MsgDeleteAuction", MsgDeleteAuction],
    ["/dflow.auction.MsgCreateAuction", MsgCreateAuction],
    ["/dflow.auction.MsgRevealBid", MsgRevealBid],
    ["/dflow.auction.MsgBlindBid", MsgBlindBid],
    ["/dflow.auction.MsgReviseBlindBid", MsgReviseBlindBid],
    
];

export { msgTypes }