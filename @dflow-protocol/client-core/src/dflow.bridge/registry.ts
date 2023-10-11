import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgReviseWithdrawal } from "./types/bridge/tx";
import { MsgRequestWithdraw } from "./types/bridge/tx";
import { MsgSignWithdrawal } from "./types/bridge/tx";
import { MsgAttestTransfer } from "./types/bridge/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/dflow.bridge.MsgReviseWithdrawal", MsgReviseWithdrawal],
    ["/dflow.bridge.MsgRequestWithdraw", MsgRequestWithdraw],
    ["/dflow.bridge.MsgSignWithdrawal", MsgSignWithdrawal],
    ["/dflow.bridge.MsgAttestTransfer", MsgAttestTransfer],
    
];

export { msgTypes }