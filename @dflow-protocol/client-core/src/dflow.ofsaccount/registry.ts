import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateEndorsementKeys } from "./types/ofsaccount/tx";
import { MsgInitAccount } from "./types/ofsaccount/tx";
import { MsgSetExtensions } from "./types/ofsaccount/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/dflow.ofsaccount.MsgUpdateEndorsementKeys", MsgUpdateEndorsementKeys],
    ["/dflow.ofsaccount.MsgInitAccount", MsgInitAccount],
    ["/dflow.ofsaccount.MsgSetExtensions", MsgSetExtensions],
    
];

export { msgTypes }