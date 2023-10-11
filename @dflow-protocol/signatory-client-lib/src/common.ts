import { z } from "zod";

/** Reason why liquidity is unavailable */
export const liquidityUnavailableReason = z.object({
    /** Reason code */
    code: z.number(),
    /** Reason description */
    msg: z.string(),
});
