import { z } from "zod";

export type RFQOrderSignature = z.infer<typeof schemaRFQOrderSignature>;
export const schemaRFQOrderSignature = z.object({
    r: z.string().regex(/^0x[0-9a-fA-F]+$/),
    s: z.string().regex(/^0x[0-9a-fA-F]+$/),
    v: z.number(),
    /** See https://docs.0x.org/protocol/docs/signatures */
    signatureType: z.nativeEnum({
        EIP712: 2
    }),
});
