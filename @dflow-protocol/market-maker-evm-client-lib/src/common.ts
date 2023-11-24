import { z } from "zod";

/** Maximum allowed order expiry. This is the largest value that can be represented by an unsigned
 * 40-bit integer. */
export const MAX_ORDER_EXPIRY = 0xffffffffff;

export const schemaAddress = z.string().regex(/^0x[0-9a-fA-F]{40}$/);

export type RFQOrderSignature = z.infer<typeof schemaRFQOrderSignature>;
export const schemaRFQOrderSignature = z.object({
    r: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
    s: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
    v: z.number(),
    /** See https://docs.0x.org/protocol/docs/signatures */
    signatureType: z.nativeEnum({
        EIP712: 2
    }),
});

export type Signature = z.infer<typeof schemaSignature>;
export const schemaSignature = z.object({
    r: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
    s: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
    v: z.union([z.literal(27), z.literal(28)]),
});

export type Eip712ObjectProperty = z.infer<typeof schemaEip712ObjectProperty>;
export const schemaEip712ObjectProperty = z.object({
    name: z.string(),
    type: z.string(),
});

export type Eip712Types = z.infer<typeof schemaEip712Types>;
export const schemaEip712Types = z.intersection(
    z.object({ EIP712Domain: z.array(schemaEip712ObjectProperty) }),
    z.record(z.string(), z.array(schemaEip712ObjectProperty)),
);

export type Eip712Domain = z.infer<typeof schemaEip712Domain>;
/** EIP-712 TypedData domain */
export const schemaEip712Domain = z.object({
    name: z.string(),
    version: z.string(),
    chainId: z.string(),
    verifyingContract: z.string(),
});

export type Eip712TypedDataWithoutMessage = z.infer<typeof schemaEip712TypedDataWithoutMessage>;
/** EIP-712 TypedData without a message. The message must be constructed and included in the
 * TypedData when calling eth_signTypedData. */
export const schemaEip712TypedDataWithoutMessage = z.object({
    types: z.record(z.string(), z.array(schemaEip712ObjectProperty)),
    domain: schemaEip712Domain,
    primaryType: z.string(),
});
