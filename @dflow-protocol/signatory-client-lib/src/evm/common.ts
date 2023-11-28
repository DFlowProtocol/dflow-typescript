import { z } from "zod";

export const NATIVE_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const schemaAddress = z.string().regex(/^0x[0-9a-fA-F]{40}$/);

export const schemaBytes32 = z.string().regex(/^0x[0-9a-fA-F]{64}$/);

export const schemaHexBytes = z.string().regex(/^0x[0-9a-fA-F]*$/);

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
    name: z.optional(z.string()),
    version: z.optional(z.string()),
    chainId: z.optional(z.string()),
    verifyingContract: z.optional(z.string()),
    salt: z.optional(z.string()),
});

export type Eip712TypedDataWithMessage = z.infer<typeof schemaEip712TypedDataWithMessage>;
/** EIP-712 TypedData with a complete message. Can be passed to eth_signTypedData as is. */
export const schemaEip712TypedDataWithMessage = z.object({
    types: z.record(z.string(), z.array(schemaEip712ObjectProperty)),
    domain: schemaEip712Domain,
    primaryType: z.string(),
    message: z.any(),
});

export const schemaGaslessApproval = z.object({
    eip712: schemaEip712TypedDataWithMessage,
});
