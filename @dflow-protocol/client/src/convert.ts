import type { BN } from "@project-serum/anchor";

export function bnToBigInt(bn: BN): bigint {
    return BigInt(bn.toString());
}
