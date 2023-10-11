import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgInitSsaccount } from "./types/ssaccount/tx";
import { MsgSetSigningKeys } from "./types/ssaccount/tx";
import { MsgCreateNetworkAccount } from "./types/ssaccount/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/dflow.ssaccount.MsgInitSsaccount", MsgInitSsaccount],
    ["/dflow.ssaccount.MsgSetSigningKeys", MsgSetSigningKeys],
    ["/dflow.ssaccount.MsgCreateNetworkAccount", MsgCreateNetworkAccount],
    
];

export { msgTypes }