import {
    AccountMeta,
    PublicKey,
    SystemProgram,
    SYSVAR_INSTRUCTIONS_PUBKEY,
    SYSVAR_RENT_PUBKEY,
    Transaction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN, Program, utils } from "@project-serum/anchor";


/**
 * @param m The value for M for the M of N multisig formed
 *     by the bridge authorities
 * @param authorities The list of bridge authorities of the form [master
 *     key 1, signing key 1, master key 2, signing key 2, ...]
 * @param mint The SPL mint of the asset being bridged.
 * @param payer The payer for the transaction. This account is
 *     a signer for the instruction. This account is expected to be
 *     mutable
 */
export type InitBridgeTransactionArgs = {
    bridge: Program<any>,
    // Function Args
    m: number,
    authorities: PublicKey[],
    // Non-PDA Non-Seed Dep Accounts
    mint: PublicKey,
    payer: PublicKey,
}
/**
 * This instruction creates the bridge.
 * @return This function returns an instruction to include in the transaction.
 */
export async function initBridgeTransaction(
    args: InitBridgeTransactionArgs,
): Promise<Transaction> {
    const {
        bridge,
        m,
        authorities,
        mint,
        payer,
    } = args;
    const transaction = new Transaction();
    const [bridgeStateAccount, bridgeStateAccountBump] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("bridge_state"),
        ],
        bridge.programId
    );
    const [bridgeVaultAccount, bridgeVaultAccountBump] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("bridge_vault"),
        ],
        bridge.programId
    );
    const instruction = bridge.instruction.initBridgeInstruction(
        // Bumps
        bridgeStateAccountBump,
        bridgeVaultAccountBump,
        // Function Arguments
        m,
        authorities,
        {
            accounts: {
                bridgeStateAccount: bridgeStateAccount,
                bridgeVaultAccount: bridgeVaultAccount,
                mint: mint,
                payer: payer,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
                tokenProgram: TOKEN_PROGRAM_ID
            },
        }
    );
    transaction.add(instruction);
    return transaction;
}

/**
 * @param depositStateAccountSeed An unsigned 64 bit integer.
 * @param amount The amount to move to the DFlow network.
 * @param recipient The secp256k1 public key of the recipient of the
 *     tokens on the DFlow network.
 * @param depositor This account pays for the transaction and rent
 *     exemption. This account is a signer for the instruction. This
 *     account is expected to be mutable
 * @param fromAccount The SPL token account from which tokens are transferred
 *     to the bridge. This account is expected to be mutable
 */
export type DepositTransactionArgs = {
    bridge: Program<any>,
    // Seed Deps
    depositStateAccountSeed: BN,
    // Function Args
    amount: BN,
    recipient: Uint8Array,
    // Non-PDA Non-Seed Dep Accounts
    depositor: PublicKey,
    fromAccount: PublicKey,
}
/**
 * This instruction moves tokens to the DFlow network.
 * @return This function returns an instruction to include in the transaction.
 */
export async function depositTransaction(
    args: DepositTransactionArgs,
): Promise<Transaction> {
    const {
        bridge,
        depositStateAccountSeed,
        amount,
        recipient,
        depositor,
        fromAccount,
    } = args;
    const transaction = new Transaction();
    const [bridgeStateAccount, bridgeStateAccountBump] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("bridge_state"),
        ],
        bridge.programId
    );
    const [bridgeVaultAccount, bridgeVaultAccountBump] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("bridge_vault"),
        ],
        bridge.programId
    );
    const [depositStateAccount, depositStateAccountBump] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("deposit_state"),
            depositStateAccountSeed.toArrayLike(Buffer, "le", 8),
        ],
        bridge.programId
    );
    const instruction = bridge.instruction.depositInstruction(
        // Bumps
        bridgeStateAccountBump,
        bridgeVaultAccountBump,
        depositStateAccountBump,
        // Seed Dependencies
        depositStateAccountSeed,
        // Function Arguments
        amount,
        recipient,
        {
            accounts: {
                bridgeStateAccount: bridgeStateAccount,
                bridgeVaultAccount: bridgeVaultAccount,
                depositor: depositor,
                fromAccount: fromAccount,
                depositStateAccount: depositStateAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY
            },
        }
    );
    transaction.add(instruction);
    return transaction;
}

/**
 * @param withdrawalId An unsigned 64 bit integer. The withdrawal ID.
 * @param toAccount The SPL token account from which tokens are transferred
 *     to the bridge. This account is expected to be mutable
 * @param payer The payer for the transaction. This account is
 *     a signer for the instruction. This account is expected to be
 *     mutable
 */
export type WithdrawTransactionArgs = {
    bridge: Program<any>,
    // Seed Deps
    withdrawalId: BN,
    // Non-PDA Non-Seed Dep Accounts
    toAccount: PublicKey,
    payer: PublicKey,
}
/**
 * This instruction moves tokens from the DFlow network.
 * @return This function returns an instruction to include in the transaction.
 */
export async function withdrawTransaction(
    args: WithdrawTransactionArgs,
): Promise<Transaction> {
    const {
        bridge,
        withdrawalId,
        toAccount,
        payer,
    } = args;
    const transaction = new Transaction();
    const [bridgeStateAccount, bridgeStateAccountBump] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("bridge_state"),
        ],
        bridge.programId
    );
    const [bridgeVaultAccount, bridgeVaultAccountBump] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("bridge_vault"),
        ],
        bridge.programId
    );
    const [withdrawalStateAccount, withdrawalStateAccountBump] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("withdrawal_state"),
            withdrawalId.toArrayLike(Buffer, "le", 8),
        ],
        bridge.programId
    );
    const instruction = bridge.instruction.withdrawInstruction(
        // Bumps
        bridgeStateAccountBump,
        bridgeVaultAccountBump,
        withdrawalStateAccountBump,
        // Seed Dependencies
        withdrawalId,
        {
            accounts: {
                bridgeStateAccount: bridgeStateAccount,
                bridgeVaultAccount: bridgeVaultAccount,
                toAccount: toAccount,
                withdrawalStateAccount: withdrawalStateAccount,
                payer: payer,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
                instructions: SYSVAR_INSTRUCTIONS_PUBKEY
            },
        }
    );
    transaction.add(instruction);
    return transaction;
}

/**
 * @param newSigningKey The authority's new signing key.
 * @param authority The authority's master key or current signing
 *     key. You should use the current signing key if possible. This
 *     account is a signer for the instruction
 * @param payer The payer for the transaction. This account is
 *     a signer for the instruction. This account is expected to be
 *     mutable
 */
export type UpdateSigningKeyTransactionArgs = {
    bridge: Program<any>,
    // Function Args
    newSigningKey: PublicKey,
    // Non-PDA Non-Seed Dep Accounts
    authority: PublicKey,
    payer: PublicKey,
}
/**
 * This instruction updates the calling authority's
 * signing key.
 * @return This function returns an instruction to include in the transaction.
 */
export async function updateSigningKeyTransaction(
    args: UpdateSigningKeyTransactionArgs,
): Promise<Transaction> {
    const {
        bridge,
        newSigningKey,
        authority,
        payer,
    } = args;
    const transaction = new Transaction();
    const [bridgeStateAccount, bridgeStateAccountBump] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("bridge_state"),
        ],
        bridge.programId
    );
    const instruction = bridge.instruction.updateSigningKeyInstruction(
        // Bumps
        bridgeStateAccountBump,
        // Function Arguments
        newSigningKey,
        {
            accounts: {
                bridgeStateAccount: bridgeStateAccount,
                authority: authority,
                payer: payer
            },
        }
    );
    transaction.add(instruction);
    return transaction;
}
