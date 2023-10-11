import { AccountInfo, Connection, Context, PublicKey } from "@solana/web3.js";
import { BN, Program, utils } from "@project-serum/anchor";
import * as AccountType from "./accountType";


export type Account<T> = {
    address: PublicKey
    /** Account data decoded by Anchor. Null if the account does not exist. */
    data: T | null
    context: Context
    accountInfo: AccountInfo<Buffer> | null
}

export type AddressBump = {
    address: PublicKey
    bump: number
}

export async function getAndDecode<T>(
    address: PublicKey,
    connection: Connection,
    decode: (buffer: Buffer) => T,
): Promise<Account<T>> {
    const { value, context } = await connection.getAccountInfoAndContext(address);
    return {
        address: address,
        data: value === null ? null : decode(value.data),
        context: context,
        accountInfo: value,
    };
}

export function getBridgeStateAccountAddress(
    programId: PublicKey,
): AddressBump {
    const [address, bump] = PublicKey.findProgramAddressSync(
        [
            utils.bytes.utf8.encode("bridge_state"),
        ],
        programId,
    );
    return { address, bump };
}

export async function getBridgeStateAccountByAddress(
    bridge: Program<any>,
    address: PublicKey,
): Promise<Account<AccountType.BridgeStateAccount>> {
    return await getAndDecode(
        address,
        bridge.provider.connection,
        buffer => decodeBridgeStateAccount(bridge, buffer),
    );
}

export async function getBridgeStateAccountBySeeds(
    bridge: Program<any>,
): Promise<Account<AccountType.BridgeStateAccount>> {
    const { address } = getBridgeStateAccountAddress(
        bridge.programId,
    );
    return await getBridgeStateAccountByAddress(bridge, address);
}

export function decodeBridgeStateAccount(
    bridge: Program<any>,
    data: Buffer,
): AccountType.BridgeStateAccount {
    return bridge.account.bridgeStateAccount.coder.accounts.decode(
        "bridgeStateAccount",
        data,
    );
}

export function getBridgeVaultAccountAddress(
    programId: PublicKey,
): AddressBump {
    const [address, bump] = PublicKey.findProgramAddressSync(
        [
            utils.bytes.utf8.encode("bridge_vault"),
        ],
        programId,
    );
    return { address, bump };
}

export function getDepositStateAccountAddress(
    programId: PublicKey,
    depositStateAccountSeed: BN,
): AddressBump {
    const [address, bump] = PublicKey.findProgramAddressSync(
        [
            utils.bytes.utf8.encode("deposit_state"),
            depositStateAccountSeed.toArrayLike(Buffer, "le", 8),
        ],
        programId,
    );
    return { address, bump };
}

export async function getDepositStateAccountByAddress(
    bridge: Program<any>,
    address: PublicKey,
): Promise<Account<AccountType.DepositStateAccount>> {
    return await getAndDecode(
        address,
        bridge.provider.connection,
        buffer => decodeDepositStateAccount(bridge, buffer),
    );
}

export async function getDepositStateAccountBySeeds(
    bridge: Program<any>,
    depositStateAccountSeed: BN,
): Promise<Account<AccountType.DepositStateAccount>> {
    const { address } = getDepositStateAccountAddress(
        bridge.programId,
        depositStateAccountSeed,
    );
    return await getDepositStateAccountByAddress(bridge, address);
}

export function decodeDepositStateAccount(
    bridge: Program<any>,
    data: Buffer,
): AccountType.DepositStateAccount {
    return bridge.account.depositStateAccount.coder.accounts.decode(
        "depositStateAccount",
        data,
    );
}

export function getWithdrawalStateAccountAddress(
    programId: PublicKey,
    withdrawalId: BN,
): AddressBump {
    const [address, bump] = PublicKey.findProgramAddressSync(
        [
            utils.bytes.utf8.encode("withdrawal_state"),
            withdrawalId.toArrayLike(Buffer, "le", 8),
        ],
        programId,
    );
    return { address, bump };
}

export async function getWithdrawalStateAccountByAddress(
    bridge: Program<any>,
    address: PublicKey,
): Promise<Account<AccountType.WithdrawalStateAccount>> {
    return await getAndDecode(
        address,
        bridge.provider.connection,
        buffer => decodeWithdrawalStateAccount(bridge, buffer),
    );
}

export async function getWithdrawalStateAccountBySeeds(
    bridge: Program<any>,
    withdrawalId: BN,
): Promise<Account<AccountType.WithdrawalStateAccount>> {
    const { address } = getWithdrawalStateAccountAddress(
        bridge.programId,
        withdrawalId,
    );
    return await getWithdrawalStateAccountByAddress(bridge, address);
}

export function decodeWithdrawalStateAccount(
    bridge: Program<any>,
    data: Buffer,
): AccountType.WithdrawalStateAccount {
    return bridge.account.withdrawalStateAccount.coder.accounts.decode(
        "withdrawalStateAccount",
        data,
    );
}
