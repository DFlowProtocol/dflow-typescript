import { encodeSecp256k1Pubkey, pubkeyToAddress } from "@cosmjs/amino";
import { AccountData } from "@cosmjs/proto-signing";
import { logs } from "@cosmjs/stargate";
import {
    Bridge,
    BridgeStateAccount,
    ed25519Instruction,
    fetcher,
    IDL,
    txBuilder,
    WITHDRAW_MESSAGE_SIZE,
} from "@dflow-protocol/bridge-sdk";
import {
    BridgeWithdrawTxMap,
} from "@dflow-protocol/client-core/dist/dflow.bridge/rest";
import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import {
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
    Commitment,
    Connection,
    PublicKey,
    RpcResponseAndContext,
    SignatureResult,
    Transaction,
    TransactionSignature,
} from "@solana/web3.js";
import { decode as base58Decode } from "bs58";
import { DFlowClient } from "./client";
import { checkSafeInteger, makeMapUseFirst, sleep } from "./coding";
import { DFlowPrefix } from "./constant";
import { bnToBigInt } from "./convert";
import { randomBytes } from "crypto";

export type BridgeClientParams = {
    solanaConnection: Connection
    /** The program ID of the Solana bridge program. If unspecified,
     * DFeiAuvz585g8U2z4jmBpDceBFoS2VYjEqTJWbKep99p will be used. */
    bridgeProgramId?: string | PublicKey
    /** The SPL mint of USDC on Solana. If unspecified,
     * EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v will be used. */
    bridgeMint?: string | PublicKey
}

export const BRIDGE_PROGRAM_ID = "DFeiAuvz585g8U2z4jmBpDceBFoS2VYjEqTJWbKep99p";
const SOLANA_USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const SOLANA_COMMITMENT = "finalized";

export class BridgeClient {
    private readonly connection: Connection;
    private readonly bridge: Program<Bridge>;
    /** The SPL mint of the Solana token used by the bridge client */
    public readonly bridgeMint: PublicKey;

    /** Construct a bridge client, which can be used to bridge funds between DFlow and Solana. */
    constructor(params: BridgeClientParams) {
        this.connection = params.solanaConnection;
        const bridgeProgramId = params.bridgeProgramId ?? BRIDGE_PROGRAM_ID;
        this.bridge = makeBridgeProgram(bridgeProgramId, params.solanaConnection);
        const bridgeMint = params.bridgeMint;
        const bridgeMintParam = bridgeMint ?? SOLANA_USDC_MINT;
        this.bridgeMint = typeof bridgeMintParam === "string"
            ? new PublicKey(bridgeMintParam)
            : bridgeMintParam;
    }

    /** The program ID of the Solana bridge program */
    get programId(): PublicKey {
        return this.bridge.programId;
    }

    /** Transfer USDC from Solana to DFlow. This deposits USDC with the Solana bridge program. */
    async deposit(params: DepositParams): Promise<DepositResult> {
        const { tx, depositStateAccountSeed } = await this.depositTx(params);

        await signSendAndConfirmSolanaTx({
            feePayer: params.depositor,
            confirmCommitment: SOLANA_COMMITMENT,
            connection: this.connection,
            makeTx: () => Promise.resolve(tx),
            signTransaction: params.signTransaction,
            callbacks: params.callbacks,
        });

        return { depositStateAccountSeed };
    }

    /** Returns a Solana bridge program deposit transaction */
    async depositTx({
        amount,
        recipient,
        depositor,
    }: DepositTxParams): Promise<DepositTxResult> {
        const depositStateAccountSeed = new BN(randomBytes(8));
        const fromAccount = getAssociatedTokenAddressSync(this.bridgeMint, depositor);
        const tx = await txBuilder.depositTransaction({
            bridge: this.bridge,
            depositStateAccountSeed,
            amount,
            recipient: recipient.secp256k1PublicKey,
            depositor,
            fromAccount,
        });
        return { tx, depositStateAccountSeed };
    }

    /** Returns true iff the deposit was processed on DFlow within the timeout. Note that this will
     * typically take about 30 seconds to return and will time out after about 60 seconds. */
    async waitForDeposit(params: WaitForDepositParams): Promise<boolean> {
        let depositStateAccountNonce: BN | undefined;
        // Try a few times in case it's not fetchable immediately after the Solana deposit
        // transaction is confirmed.
        for (let i = 0; i < 3; i += 1) {
            const depositStateAccount = await fetcher.getDepositStateAccountBySeeds(
                this.bridge,
                params.depositStateAccountSeed,
            );
            if (depositStateAccount.data === null) {
                await sleep(1_000);
                continue;
            }
            depositStateAccountNonce = depositStateAccount.data.nonce;
        }
        if (depositStateAccountNonce === undefined) {
            throw new Error("Failed to fetch deposit on Solana");
        }

        // Wait for the nonce on DFlow to exceed the deposit's nonce.
        for (let i = 0; i < 10; i += 1) {
            const nonce = await params.client.fetchBridgeNonce();
            const depositNonce = bnToBigInt(depositStateAccountNonce);
            if (nonce > depositNonce) {
                return true;
            }
            await sleep(6_000);
        }

        return false;
    }

    /** Request a withdrawal of USDC from DFlow to Solana. Returns the withdrawal ID if the
     * withdrawal request succeeded. */
    async requestWithdrawal({
        client,
        toAccount,
        toAccountOwner,
        amount,
    }: RequestWithdrawalParams): Promise<RequestWithdrawalResult> {
        checkSafeInteger(amount, "amount");
        const result = await client.requestWithdrawal(toAccount, toAccountOwner, amount);
        if (result.code !== 0) {
            throw new Error(
                `Error when processing withdrawal request. Code ${result.code}.`
            );
        }
        if (result.msgResponses.length !== 1) {
            throw new Error(
                "Failed to parse withdrawal ID. Transaction contains multiple messages."
            );
        }
        const initWithdrawCeremonyEvents = result.events
            .filter(x => x.type === "dflow.bridge.InitWithdrawCeremony");
        if (initWithdrawCeremonyEvents.length === 0) {
            throw new Error(
                "Failed to parse withdrawal ID. Did not find InitWithdrawCeremony event."
            );
        }
        if (initWithdrawCeremonyEvents.length > 1) {
            throw new Error(
                "Failed to parse withdrawal ID. Transaction contains multiple InitWithdrawCeremony"
                + " events."
            );
        }
        const rawWithdrawalId = initWithdrawCeremonyEvents[0].attributes
            .find(x => x.key === "wid")
            ?.value;
        if (rawWithdrawalId === undefined || rawWithdrawalId === "") {
            throw new Error(
                "Failed to parse withdrawal ID. Did not find Withdrawal ID attribute."
            );
        }
        try {
            const withdrawId = new BN(rawWithdrawalId.replace(/"/g, ""));
            return { withdrawId };
        } catch (error) {
            throw new Error(`Failed to parse withdrawal ID. ${error}`);
        }
    }

    /** Revise the Solana destination of a withdrawal of USDC from DFlow to Solana. */
    async reviseWithdrawal({
        client,
        withdrawId,
        newToAccount,
        newToAccountOwner,
    }: ReviseWithdrawalParams): Promise<void> {
        const wid = withdrawId.toNumber();
        const result = await client.reviseWithdrawal(wid, newToAccount, newToAccountOwner);
        if (result.code !== 0) {
            throw new Error(
                `Error when revising withdrawal. Code ${result.code}. Log: ${result.rawLog}`
            );
        }
    }

    /** Wait for the specified withdrawal from DFlow to be approved. Note that this will time out
     * after about 60 seconds. */
    async waitForWithdrawalApproval({
        withdrawId,
        toAccount,
        toAccountOwner,
        payer,
        client,
    }: WaitForWithdrawalApprovalParams): Promise<WaitForWithdrawalApprovalResult> {
        let bridgeState;
        try {
            const rawBridgeState = await fetcher.getBridgeStateAccountBySeeds(this.bridge);
            if (rawBridgeState.data === null) {
                throw new Error("Failed to fetch Solana bridge state");
            }
            bridgeState = rawBridgeState.data;
        } catch (error) {
            return {
                code: WaitForWithdrawalApprovalResultCode.Retry,
                message: `Failed to fetch Solana bridge state. Error: ${error}`,
            };
        }

        let shouldCreateToAccount = false;
        try {
            const toAccountInfo = await this.connection.getAccountInfo(
                toAccount,
            );
            if (toAccountInfo === null) {
                shouldCreateToAccount = true;
            }
        } catch (error) {
            return {
                code: WaitForWithdrawalApprovalResultCode.Retry,
                message: `Failed to fetch to account. Error: ${error}`,
            };
        }

        for (let attempts = 0; attempts < 12; attempts += 1) {
            const response = await client.client.DflowBridge.query
                .queryWithdrawTxMap(withdrawId.toString());
            if (response.status === 404) {
                return {
                    code: WaitForWithdrawalApprovalResultCode.Retry,
                    message: `Withdrawal ID ${withdrawId} not found`,
                };
            }
            if (!response.ok) {
                return {
                    code: WaitForWithdrawalApprovalResultCode.Retry,
                    message: response.error.message ?? "Failed to fetch withdrawal",
                };
            }

            const withdrawal = response.data.withdrawTxMap;
            if (withdrawal === undefined) {
                throw new Error("Invalid withdrawal data");
            }

            const withdrawalTx = await this.getWithdrawalSolanaTx({
                withdrawal,
                bridgeState,
                shouldCreateToAccount,
                toAccountOwner,
                payer,
            });

            if (withdrawalTx === undefined) {
                await sleep(5_000);
                continue;
            }

            if (!withdrawalTx.withdrawalId.eq(withdrawId)) {
                throw new Error("Invalid withdrawal message withdrawal ID");
            }
            if (!withdrawalTx.toAccount.equals(toAccount)) {
                throw new Error("Invalid withdrawal message to account");
            }

            return {
                code: WaitForWithdrawalApprovalResultCode.Ok,
                tx: withdrawalTx.tx,
            };
        }

        return {
            code: WaitForWithdrawalApprovalResultCode.TimedOut,
        };
    }

    /** Returns a Solana bridge program withdrawal transaction */
    async getWithdrawalSolanaTx(
        params: GetWithdrawalSolanaTxParams,
    ): Promise<WithdrawalSolanaTx | undefined> {
        const {
            withdrawal,
            bridgeState,
            shouldCreateToAccount,
            toAccountOwner,
            payer,
        } = params;

        if (withdrawal.signatures === undefined
            || withdrawal.message === undefined
            || withdrawal.withdrawId === undefined)
        {
            throw new Error("Invalid withdrawal data");
        }

        if (withdrawal.signatures.length >= bridgeState.m) {
            const withdrawalMessage = parseWithdrawalMessage(withdrawal.message);
            const { withdrawalId, amount, toAccount } = withdrawalMessage;

            const signatureInfos: ed25519Instruction.SignatureInfo[] = [];
            for (const [idx, signature] of withdrawal.signatures.entries()) {
                if (signature.ed25519PublicKey === undefined
                    || signature.signature === undefined)
                {
                    throw new Error("Invalid withdrawal data");
                }
                try {
                    const signer = new PublicKey(signature.ed25519PublicKey);
                    const signatureBuffer = base58Decode(signature.signature);
                    if (bridgeState.authorities.find(x => x.signingKey.equals(signer))) {
                        signatureInfos.push({
                            signature: signatureBuffer,
                            publicKey: signer.toBytes(),
                        });
                    }
                } catch (error) {
                    throw new Error(`Failed to parse message signature ${idx}`);
                }
            }

            if (signatureInfos.length >= bridgeState.m) {
                const ed25519Ix = ed25519Instruction.makeEd25519Instruction({
                    message: withdrawalMessage.buffer,
                    signatureInfos: signatureInfos,
                });
                const withdrawTx = await txBuilder.withdrawTransaction({
                    bridge: this.bridge,
                    withdrawalId,
                    toAccount,
                    payer,
                });
                const tx = new Transaction();
                tx.add(ed25519Ix);
                if (shouldCreateToAccount) {
                    const createTokenAccountIx = createAssociatedTokenAccountInstruction(
                        payer,
                        toAccount,
                        toAccountOwner,
                        bridgeState.mint,
                    );
                    tx.add(createTokenAccountIx);
                }
                tx.add(withdrawTx);
                tx.feePayer = payer;
                return { withdrawalId, amount, toAccount, tx };
            }
        }

        return undefined;
    }

    /** Complete an approved withdrawal. This withdraws USDC from the Solana bridge program. */
    async withdraw({
        tx,
        signTransaction,
        callbacks,
    }: WithdrawParams): Promise<void> {
        await signSendAndConfirmSolanaTx({
            confirmCommitment: SOLANA_COMMITMENT,
            connection: this.connection,
            makeTx: () => Promise.resolve(tx),
            signTransaction,
            callbacks,
        });
    }

    /** Fetches pending withdrawals that have not yet been completed on Solana */
    async fetchPendingWithdrawals({
        client,
        payer,
    }: FetchPendingWithdrawalsParams): Promise<PendingWithdrawal[]> {
        const withdrawerDFlowAddress = await client.getSignerAddress();
        const [queryResponse, bridgeState] = await Promise.all([
            client.client.DflowBridge.query.queryPendingWithdrawals(withdrawerDFlowAddress),
            fetcher.getBridgeStateAccountBySeeds(this.bridge),
        ]);
        const userWithdrawTxMaps = queryResponse.data.withdrawTxMaps;
        if (userWithdrawTxMaps === undefined) {
            throw new Error("Failed to fetch withdrawals");
        }
        if (bridgeState.data === null) {
            throw new Error("Failed to fetch bridge state");
        }

        const withdrawals = [];
        for (const withdrawTxMap of userWithdrawTxMaps) {
            if (withdrawTxMap.withdrawId === undefined
                || withdrawTxMap.withdrawId === ""
                || withdrawTxMap.amt === undefined
                || withdrawTxMap.amt === ""
                || !withdrawTxMap.dst
                || !withdrawTxMap.dstOwner) {
                throw new Error("Invalid withdrawal data");
            }
            const withdrawalId = new BN(withdrawTxMap.withdrawId);
            const amount = new BN(withdrawTxMap.amt);
            const toAccount = new PublicKey(withdrawTxMap.dst);
            const toAccountOwner = new PublicKey(withdrawTxMap.dstOwner);
            const address = fetcher.getWithdrawalStateAccountAddress(
                this.bridge.programId,
                withdrawalId,
            ).address;
            withdrawals.push({
                withdrawTxMap,
                withdrawalId,
                amount,
                toAccount,
                toAccountOwner,
                address,
            });
        }

        const toAccountToExists = makeMapUseFirst(
            withdrawals,
            x => x.toAccount.toBase58(),
            _ => false,
        );
        const toAccountAddresses = Array.from(toAccountToExists.keys()).map(x => new PublicKey(x));

        const withdrawalAndToAccounts = await this.connection.getMultipleAccountsInfo(
            withdrawals.map(x => x.address).concat(toAccountAddresses),
        );
        const withdrawalAccounts = withdrawalAndToAccounts.slice(0, withdrawals.length);
        const toAccounts = withdrawalAndToAccounts.slice(
            withdrawals.length,
            withdrawals.length + toAccountAddresses.length,
        );

        for (const [i, toAccount] of toAccounts.entries()) {
            const address = toAccountAddresses[i];
            toAccountToExists.set(address.toBase58(), toAccount !== null);
        }

        const pendingWithdrawals: PendingWithdrawal[] = [];
        for (const [i, withdrawalAccount] of withdrawalAccounts.entries()) {
            if (withdrawalAccount !== null) {
                continue;
            }

            const withdrawal = withdrawals[i];
            const toAccountExists = toAccountToExists.get(withdrawal.toAccount.toBase58());
            if (toAccountExists === undefined) {
                throw new Error("Can't happen");
            }
            const withdrawalTx = await this.getWithdrawalSolanaTx({
                withdrawal: withdrawal.withdrawTxMap,
                bridgeState: bridgeState.data,
                shouldCreateToAccount: !toAccountExists,
                toAccountOwner: withdrawal.toAccountOwner,
                payer,
            });

            pendingWithdrawals.push({
                withdrawTxMap: withdrawal.withdrawTxMap,
                withdrawalId: withdrawal.withdrawalId,
                amount: withdrawal.amount,
                toAccount: withdrawal.toAccount,
                tx: withdrawalTx?.tx,
            });
        }

        return pendingWithdrawals;
    }
}

export class DepositRecipient {
    /** Secp256k1 public key */
    readonly secp256k1PublicKey: Uint8Array;
    /** Bech32 address of the DFlow account associated with the Secp256k1 public key */
    readonly address: string;

    constructor(secp256k1PublicKey: Uint8Array) {
        this.secp256k1PublicKey = secp256k1PublicKey;
        this.address = makeBech32Address(secp256k1PublicKey, DFlowPrefix);
    }

    static fromAccountData(accountData: AccountData): DepositRecipient {
        return new DepositRecipient(accountData.pubkey);
    }
}

export function makeBech32Address(secp256k1Pubkey: Uint8Array, prefix: string): string {
    if (secp256k1Pubkey.length !== 33) {
        throw new Error(`Invalid Secp256k1 public key length ${secp256k1Pubkey.length}`);
    }
    const secp256k1 = encodeSecp256k1Pubkey(secp256k1Pubkey);
    const bech32 = pubkeyToAddress(secp256k1, prefix);
    return bech32;
}

function makeBridgeProgram(
    bridgeProgramId: string | PublicKey,
    connection: Connection,
): Program<Bridge> {
    const programId = typeof bridgeProgramId === "string"
        ? new PublicKey(bridgeProgramId)
        : bridgeProgramId;

    // In order to attach a Connection to the Program, we need to include a Provider in the Program
    // constructor. We don't use the Program to sign transactions, so we pass in a dummy wallet that
    // satisfies the interface but cannot actually sign.
    const nonSigningWallet = {
        signTransaction(_: Transaction): Promise<Transaction> {
            throw new Error("Cannot sign transactions");
        },
        signAllTransactions(_: Transaction[]): Promise<Transaction[]> {
            throw new Error("Cannot sign transactions");
        },
        publicKey: new PublicKey(0),
    };
    const provider = new AnchorProvider(connection, nonSigningWallet, {});
    return new Program(IDL, programId, provider);
}

export type DepositParams = {
    /** The amount of USDC to deposit. Note that this is a scaled amount. USDC has 6 decimals on
     * Solana, so to deposit 1 USDC, specify 1000000. */
    amount: BN
    /** The recipient of the deposit on the DFlow network */
    recipient: DepositRecipient
    /** The depositor's Solana public key. USDC will be deposited from this Solana account's USDC
     * associated token account. This Solana account must sign the transaction. */
    depositor: PublicKey
    /** Callback for the depositor to sign the transaction */
    signTransaction(tx: Transaction): Promise<Transaction>
    callbacks?: SolanaTransactionCallbacks<Transaction>
}

export type DepositResult = {
    /** The unique ID for the deposit on Solana */
    depositStateAccountSeed: BN
}

export type DepositTxParams = {
    /** The amount of USDC to deposit. Note that this is a scaled amount. USDC has 6 decimals on
     * Solana, so to deposit 1 USDC, specify 1000000. */
    amount: BN
    /** The recipient of the deposit on the DFlow network */
    recipient: DepositRecipient
    /** The depositor's Solana public key. USDC will be deposited from this Solana account's USDC
     * associated token account. This Solana account must sign the transaction. */
    depositor: PublicKey
}

export type DepositTxResult = {
    /** The Solana bridge program deposit transaction */
    tx: Transaction
    /** The seed for the deposit state account that will be created by the transaction. This is the
     * unique ID that will be used to identify the deposit on Solana. */
    depositStateAccountSeed: BN
}

export type WaitForDepositParams = {
    /** The unique ID for the deposit on Solana */
    depositStateAccountSeed: BN
    client: DFlowClient
}

export type RequestWithdrawalParams = {
    client: DFlowClient
    /** Solana SPL token account that will receive the funds */
    toAccount: PublicKey
    /** Solana wallet that owns the `toAccount` */
    toAccountOwner: PublicKey
    /** The amount to withdraw. Note that this is a scaled amount. */
    amount: number
}

export type RequestWithdrawalResult = {
    /** The unique ID of the withdrawal */
    withdrawId: BN
}

export type ReviseWithdrawalParams = {
    client: DFlowClient
    /** The withdrawId returned by the withrawal request */
    withdrawId: BN
    /** Solana SPL token account that will receive the funds */
    newToAccount: PublicKey
    /** Solana wallet that owns the `newToAccount` */
    newToAccountOwner: PublicKey
}

export type WaitForWithdrawalApprovalParams = {
    /** The withdrawId returned by the withrawal request */
    withdrawId: BN
    /** Solana SPL token account that will receive the funds */
    toAccount: PublicKey
    /** Solana wallet that owns the `toAccount` */
    toAccountOwner: PublicKey
    /** The Solana wallet that will pay for the withdrawal transaction on Solana. This Solana
     * account must sign the transaction. */
    payer: PublicKey
    client: DFlowClient
}

export type WaitForWithdrawalApprovalResult =
    WaitForWithdrawalApprovalOk
    | WaitForWithdrawalApprovalRetry
    | WaitForWithdrawalApprovalTimedOut

export enum WaitForWithdrawalApprovalResultCode {
    /** The withdrawal was approved */
    Ok = 0,
    /** An error occurred when waiting for withdrawal approval. The client should try to wait for
     * approval again. */
    Retry = 1,
    /** Timed out while waiting for withdrawal approval */
    TimedOut = 2,
}

export type WaitForWithdrawalApprovalOk = {
    code: WaitForWithdrawalApprovalResultCode.Ok
    tx: Transaction
}

export type WaitForWithdrawalApprovalRetry = {
    code: WaitForWithdrawalApprovalResultCode.Retry
    message: string
}

export type WaitForWithdrawalApprovalTimedOut = {
    code: WaitForWithdrawalApprovalResultCode.TimedOut
}

export type GetWithdrawalSolanaTxParams = {
    withdrawal: BridgeWithdrawTxMap
    bridgeState: BridgeStateAccount
    shouldCreateToAccount: boolean
    /** Solana wallet that owns the `toAccount` */
    toAccountOwner: PublicKey
    /** The Solana wallet that will pay for the withdrawal transaction on Solana. This Solana
     * account must sign the transaction. */
    payer: PublicKey
}

export type WithdrawalSolanaTx = {
    /** The DFlow network withdrawal ID of the withdrawal */
    withdrawalId: BN
    /** The USDC amount of the withdrawal */
    amount: BN
    /** The USDC SPL token account that will receive the USDC on Solana */
    toAccount: PublicKey
    /** The Solana bridge program withdrawal transaction. Note that this will include an instruction
     * to create the `toAccount` token account if it does not exist. */
    tx: Transaction
}

type ParsedWithdrawalMessage = {
    buffer: Uint8Array
    withdrawalId: BN
    amount: BN
    toAccount: PublicKey
}

function parseWithdrawalMessage(message: string): ParsedWithdrawalMessage {
    let withdrawalMessage;
    try {
        withdrawalMessage = Buffer.from(message, "base64");
    } catch (error) {
        throw new Error(
            `Failed to construct withdrawal message from`
            + ` buffer ${message}. Error: ${error}`
        );
    }

    if (withdrawalMessage.length !== WITHDRAW_MESSAGE_SIZE) {
        throw new Error("Invalid withdrawal message");
    }

    const withdrawalId = new BN(withdrawalMessage.subarray(0, 8), "le");
    const amount = new BN(withdrawalMessage.subarray(8, 16), "le");
    const toAccount = new PublicKey(withdrawalMessage.subarray(16));
    return { buffer: withdrawalMessage, withdrawalId, amount, toAccount };
}

export type WithdrawParams = {
    tx: Transaction
    signTransaction(tx: Transaction): Promise<Transaction>
    callbacks?: SolanaTransactionCallbacks<Transaction>
}

export type FetchPendingWithdrawalsParams = {
    client: DFlowClient
    payer: PublicKey
}

export type PendingWithdrawal = {
    /** The withdrawal details on DFlow */
    withdrawTxMap: BridgeWithdrawTxMap
    /** The DFlow network withdrawal ID of the withdrawal */
    withdrawalId: BN
    /** The USDC amount of the withdrawal */
    amount: BN
    /** The USDC SPL token account that will receive the USDC on Solana */
    toAccount: PublicKey
    /** The Solana bridge program withdrawal transaction. Note that this will include an instruction
     * to create the `toAccount` token account if it does not exist. Undefined if the withdrawal
     * request is not yet approved. */
    tx?: Transaction
}

export type CreateTxPendingCallback = () => void
export type CreateTxFulfilledCallback<T> = (createTxResult: T) => void
export type CreateTxErrorCallback = (error: unknown) => void
export type SignPendingCallback<T> = (createTxResult: T) => void
export type SignFulfilledCallback<T> = (createTxResult: T) => void
export type SignErrorCallback<T> = (error: unknown, createTxResult: T) => void
export type SendPendingCallback<T> = (createTxResult: T) => void
export type SendFulfilledCallback<T> = (signature: TransactionSignature, createTxResult: T) => void
export type SendErrorCallback<T> = (error: unknown, createTxResult: T) => void
export type ConfirmPendingCallback<T> = (signature: TransactionSignature, createTxResult: T) => void
export type ConfirmFulfilledCallback<T> = (
    confirm: RpcResponseAndContext<SignatureResult>,
    signature: TransactionSignature,
    createTxResult: T,
) => void
export type ConfirmErrorCallback<T> = (
    error: unknown,
    signature: TransactionSignature,
    createTxResult: T
) => void

export type SolanaTransactionCallbacks<T> = {
    onCreateTxPending?: CreateTxPendingCallback
    onCreateTxFulfilled?: CreateTxFulfilledCallback<T>
    /** Note that the error will not be thrown if this callback is specified */
    onCreateTxError?: CreateTxErrorCallback
    onSignPending?: SignPendingCallback<T>
    onSignFulfilled?: SignFulfilledCallback<T>
    /** Note that the error will not be thrown if this callback is specified */
    onSignError?: SignErrorCallback<T>
    onSendPending?: SendPendingCallback<T>
    onSendFulfilled?: SendFulfilledCallback<T>
    /** Note that the error will not be thrown if this callback is specified */
    onSendError?: SendErrorCallback<T>
    onConfirmPending?: ConfirmPendingCallback<T>
    onConfirmFulfilled?: ConfirmFulfilledCallback<T>
    /** Note that the error will not be thrown if this callback is specified */
    onConfirmError?: ConfirmErrorCallback<T>
}

type SignSendAndConfirmParams<T> = {
    feePayer?: PublicKey
    useNonce?: true
    confirmCommitment: Commitment
    connection: Connection
    makeTx(): Promise<Transaction>
    signTransaction(tx: Transaction): Promise<Transaction>
    callbacks?: SolanaTransactionCallbacks<T>
}

async function signSendAndConfirmSolanaTx({
    feePayer,
    useNonce,
    confirmCommitment,
    connection,
    makeTx,
    signTransaction,
    callbacks,
}: SignSendAndConfirmParams<Transaction>): Promise<void> {
    if (callbacks?.onCreateTxPending) {
        callbacks.onCreateTxPending();
    }
    let tx, blockhash, lastValidBlockHeight;
    try {
        if (useNonce) {
            tx = await makeTx();
        } else {
            [tx, { blockhash, lastValidBlockHeight }] = await Promise.all([
                makeTx(),
                connection.getLatestBlockhash(),
            ]);
            tx.recentBlockhash = blockhash;
        }
        if (feePayer) {
            tx.feePayer = feePayer;
        }
    } catch (error) {
        if (callbacks?.onCreateTxError) {
            callbacks.onCreateTxError(error);
            return;
        }
        throw error;
    }
    if (callbacks?.onCreateTxFulfilled) {
        callbacks.onCreateTxFulfilled(tx);
    }
    if (callbacks?.onSignPending) {
        callbacks.onSignPending(tx);
    }
    let signedTx;
    try {
        signedTx = await signTransaction(tx);
    } catch (error) {
        if (callbacks?.onSignError) {
            callbacks.onSignError(error, tx);
            return;
        }
        throw error;
    }
    if (callbacks?.onSignFulfilled) {
        callbacks.onSignFulfilled(tx);
    }
    if (callbacks?.onSendPending) {
        callbacks.onSendPending(tx);
    }
    let signature;
    try {
        const serializedTx = signedTx.serialize();
        signature = await connection.sendRawTransaction(serializedTx);
    } catch (error) {
        if (callbacks?.onSendError) {
            callbacks.onSendError(error, tx);
            return;
        }
        throw error;
    }
    if (callbacks?.onSendFulfilled) {
        callbacks.onSendFulfilled(signature, tx);
    }
    if (callbacks?.onConfirmPending) {
        callbacks.onConfirmPending(signature, tx);
    }
    let confirmResult;
    try {
        if (blockhash !== undefined && lastValidBlockHeight !== undefined) {
            // The transaction is using a normal blockhash. Confirm using the
            // block-height-based strategy.
            confirmResult = await connection.confirmTransaction({
                signature,
                blockhash,
                lastValidBlockHeight,
            }, confirmCommitment);
        } else {
            // The transaction is using a nonce. Confirm using the timeout-based strategy.
            confirmResult = await connection.confirmTransaction(
                signature,
                confirmCommitment,
            );
        }
        if (confirmResult.value.err) {
            throw new Error(confirmResult.value.err.toString());
        }
    } catch (error) {
        if (callbacks?.onConfirmError) {
            callbacks.onConfirmError(error, signature, tx);
            return;
        }
        throw error;
    }
    if (callbacks?.onConfirmFulfilled) {
        callbacks.onConfirmFulfilled(confirmResult, signature, tx);
    }
}
