// Generated by Ignite ignite.com/cli

import { StdFee } from "@cosmjs/launchpad";
import { SigningStargateClient, DeliverTxResponse } from "@cosmjs/stargate";
import { EncodeObject, GeneratedType, OfflineSigner, Registry } from "@cosmjs/proto-signing";
import { msgTypes } from './registry';
import { IgniteClient } from "../client"
import { MissingWalletError } from "../helpers"
import { Api } from "./rest";
import { MsgUpdateEndorsementKeys } from "./types/ofsaccount/tx";
import { MsgInitAccount } from "./types/ofsaccount/tx";
import { MsgSetExtensions } from "./types/ofsaccount/tx";


export { MsgUpdateEndorsementKeys, MsgInitAccount, MsgSetExtensions };

type sendMsgUpdateEndorsementKeysParams = {
  value: MsgUpdateEndorsementKeys,
  fee?: StdFee,
  memo?: string
};

type sendMsgInitAccountParams = {
  value: MsgInitAccount,
  fee?: StdFee,
  memo?: string
};

type sendMsgSetExtensionsParams = {
  value: MsgSetExtensions,
  fee?: StdFee,
  memo?: string
};


type msgUpdateEndorsementKeysParams = {
  value: MsgUpdateEndorsementKeys,
};

type msgInitAccountParams = {
  value: MsgInitAccount,
};

type msgSetExtensionsParams = {
  value: MsgSetExtensions,
};


export const registry = new Registry(msgTypes);

const defaultFee = {
  amount: [],
  gas: "200000",
};

interface TxClientOptions {
  addr: string
	prefix: string
	signer?: OfflineSigner
}

export const txClient = ({ signer, prefix, addr }: TxClientOptions = { addr: "http://localhost:26657", prefix: "cosmos" }) => {

  return {
		
		async sendMsgUpdateEndorsementKeys({ value, fee, memo }: sendMsgUpdateEndorsementKeysParams): Promise<DeliverTxResponse> {
			if (!signer) {
					throw new Error('TxClient:sendMsgUpdateEndorsementKeys: Unable to sign Tx. Signer is not present.')
			}
			try {			
				const { address } = (await signer.getAccounts())[0]; 
				const signingClient = await SigningStargateClient.connectWithSigner(addr,signer,{registry, prefix});
				let msg = this.msgUpdateEndorsementKeys({ value: MsgUpdateEndorsementKeys.fromPartial(value) })
				return await signingClient.signAndBroadcast(address, [msg], fee ? fee : defaultFee, memo)
			} catch (e: any) {
				throw new Error('TxClient:sendMsgUpdateEndorsementKeys: Could not broadcast Tx: '+ e.message)
			}
		},
		
		async sendMsgInitAccount({ value, fee, memo }: sendMsgInitAccountParams): Promise<DeliverTxResponse> {
			if (!signer) {
					throw new Error('TxClient:sendMsgInitAccount: Unable to sign Tx. Signer is not present.')
			}
			try {			
				const { address } = (await signer.getAccounts())[0]; 
				const signingClient = await SigningStargateClient.connectWithSigner(addr,signer,{registry, prefix});
				let msg = this.msgInitAccount({ value: MsgInitAccount.fromPartial(value) })
				return await signingClient.signAndBroadcast(address, [msg], fee ? fee : defaultFee, memo)
			} catch (e: any) {
				throw new Error('TxClient:sendMsgInitAccount: Could not broadcast Tx: '+ e.message)
			}
		},
		
		async sendMsgSetExtensions({ value, fee, memo }: sendMsgSetExtensionsParams): Promise<DeliverTxResponse> {
			if (!signer) {
					throw new Error('TxClient:sendMsgSetExtensions: Unable to sign Tx. Signer is not present.')
			}
			try {			
				const { address } = (await signer.getAccounts())[0]; 
				const signingClient = await SigningStargateClient.connectWithSigner(addr,signer,{registry, prefix});
				let msg = this.msgSetExtensions({ value: MsgSetExtensions.fromPartial(value) })
				return await signingClient.signAndBroadcast(address, [msg], fee ? fee : defaultFee, memo)
			} catch (e: any) {
				throw new Error('TxClient:sendMsgSetExtensions: Could not broadcast Tx: '+ e.message)
			}
		},
		
		
		msgUpdateEndorsementKeys({ value }: msgUpdateEndorsementKeysParams): EncodeObject {
			try {
				return { typeUrl: "/dflow.ofsaccount.MsgUpdateEndorsementKeys", value: MsgUpdateEndorsementKeys.fromPartial( value ) }  
			} catch (e: any) {
				throw new Error('TxClient:MsgUpdateEndorsementKeys: Could not create message: ' + e.message)
			}
		},
		
		msgInitAccount({ value }: msgInitAccountParams): EncodeObject {
			try {
				return { typeUrl: "/dflow.ofsaccount.MsgInitAccount", value: MsgInitAccount.fromPartial( value ) }  
			} catch (e: any) {
				throw new Error('TxClient:MsgInitAccount: Could not create message: ' + e.message)
			}
		},
		
		msgSetExtensions({ value }: msgSetExtensionsParams): EncodeObject {
			try {
				return { typeUrl: "/dflow.ofsaccount.MsgSetExtensions", value: MsgSetExtensions.fromPartial( value ) }  
			} catch (e: any) {
				throw new Error('TxClient:MsgSetExtensions: Could not create message: ' + e.message)
			}
		},
		
	}
};

interface QueryClientOptions {
  addr: string
}

export const queryClient = ({ addr: addr }: QueryClientOptions = { addr: "http://localhost:1317" }) => {
  return new Api({ baseUrl: addr });
};

class SDKModule {
	public query: ReturnType<typeof queryClient>;
	public tx: ReturnType<typeof txClient>;
	
	public registry: Array<[string, GeneratedType]>;

	constructor(client: IgniteClient) {		
	
		this.query = queryClient({ addr: client.env.apiURL });
		this.tx = txClient({ signer: client.signer, addr: client.env.rpcURL, prefix: client.env.prefix ?? "cosmos" });
	}
};

const Module = (test: IgniteClient) => {
	return {
		module: {
			DflowOfsaccount: new SDKModule(test)
		},
		registry: msgTypes
  }
}
export default Module;