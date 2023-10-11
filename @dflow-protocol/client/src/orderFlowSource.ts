import { OfsaccountOrderFlowSource } from "@dflow-protocol/client-core/dist/dflow.ofsaccount/rest";
import { AccountInfo } from "./accountInfo";


export class OrderFlowSource extends AccountInfo<OfsaccountOrderFlowSource> {
    get publicKey(): string {
        if (this.data.publicKey === undefined) {
            throw new Error("publicKey undefined");
        }
        return this.data.publicKey;
    }

    get flowEndorsementKey1(): string {
        if (this.data.flowEndorsementKey1 === undefined) {
            throw new Error("flowEndorsementKey1 undefined");
        }
        return this.data.flowEndorsementKey1;
    }

    get flowEndorsementKey2(): string {
        if (this.data.flowEndorsementKey2 === undefined) {
            throw new Error("flowEndorsementKey2 undefined");
        }
        return this.data.flowEndorsementKey2;
    }

    get extensions(): string {
        if (this.data.extensions === undefined) {
            throw new Error("extensions undefined");
        }
        return this.data.extensions;
    }

    get auctions(): bigint[] {
        if (this.data.auctions === undefined) {
            throw new Error("auctions undefined");
        }
        return this.data.auctions.map(BigInt);
    }
}
