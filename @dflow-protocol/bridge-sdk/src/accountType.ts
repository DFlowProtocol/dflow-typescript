import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";


export type BridgeAuthority = {
    masterKey: PublicKey,
    signingKey: PublicKey,
}

export type BridgeStateAccount = {
    nonce: BN,
    mint: PublicKey,
    m: number,
    authorities: BridgeAuthority[],
}

export type DepositStateAccount = {
    seed: BN,
    nonce: BN,
    amount: BN,
    recipient: number[],
}

export type WithdrawalStateAccount = {
    withdrawalId: BN,
    nonce: BN,
}

