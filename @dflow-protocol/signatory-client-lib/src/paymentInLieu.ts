import { apiBasePath, commonBasePath, flowApiPaths } from "./api-path";
import { Endorsement, schemaEndorsement } from "./endorsement";
import { ErrorResponse } from "./error";
import { MaybeErrorResult, checkForError, post } from "./util";
import { z } from "zod";

export type PaymentInLieuToken = z.infer<typeof schemaPaymentInLieuToken>;
export const schemaPaymentInLieuToken = z.object({
    /** Base58-encoded Ed25519 public key used to sign the payment in lieu message. */
    issuer: z.string(),
    /** Issuer's Base64-encoded signature of
     * `"{id},{notional},{auctionId},{auctionEpoch},{marketMaker},{endorsement.signature}"` */
    signature: z.string(),
    /** Unique identifier for the payment in lieu token. */
    id: z.string(),
    notional: z.number(),
    auctionId: z.number(),
    auctionEpoch: z.number(),
    /** DFlow network public key identifying the market maker. */
    marketMaker: z.string(),
    /** The order flow source's endorsement of the firm quote request. */
    endorsement: schemaEndorsement,
});

export function makePaymentInLieuMessage({
    id,
    notional,
    auctionId,
    auctionEpoch,
    marketMaker,
    endorsement,
}: {
    id: string,
    notional: number,
    auctionId: number,
    auctionEpoch: number,
    marketMaker: string,
    endorsement: Endorsement,
}): string {
    return [
        `${id}`,
        `${notional}`,
        `${auctionId}`,
        `${auctionEpoch}`,
        `${marketMaker}`,
        `${endorsement.signature}`,
    ].join(",");
}

export type PaymentInLieuRequest = z.infer<typeof schemaPaymentInLieuRequest>;
export const schemaPaymentInLieuRequest = z.object({
    paymentInLieuToken: schemaPaymentInLieuToken,
    /** Base58-encoded Ed25519 public key used to sign the approval message. */
    approver: z.string(),
    /** Approver's Base64-encoded approval signature of `paymentInLieuToken.signature` */
    approval: z.string(),
});

export type PaymentInLieuResponse = z.infer<typeof schemaPaymentInLieuResponse>;
export const schemaPaymentInLieuResponse = z.object({
    /** Deliver notional transaction hash */
    txHash: z.string(),
});

export function makePaymentInLieuApprovalMessage(paymentInLieuToken: PaymentInLieuToken): string {
    return paymentInLieuToken.signature;
}

/** Error-returning variant of `acceptPaymentInLieu`. Note that this will still throw if an
 * unrecognized error occurs or if the fetch request fails. */
export async function acceptPaymentInLieuOrError(
    signatoryServerURL: string,
    params: PaymentInLieuRequest,
    apiKey?: string,
): Promise<MaybeErrorResult<PaymentInLieuResponse, ErrorResponse>> {
    const url = `${signatoryServerURL}${apiBasePath}${commonBasePath}${flowApiPaths.paymentInLieu}`;
    const requestBody = JSON.stringify(params);
    const responseObj = await post(url, requestBody, apiKey);
    const error = await checkForError(responseObj);
    if (error) {
        return { ok: false, error };
    }
    const response: PaymentInLieuResponse = await responseObj.json();
    return { ok: true, data: response };
}

/** Accepts a payment in lieu. Throws on error. */
export async function acceptPaymentInLieu(
    signatoryServerURL: string,
    params: PaymentInLieuRequest,
    apiKey?: string,
): Promise<PaymentInLieuResponse> {
    const result = await acceptPaymentInLieuOrError(signatoryServerURL, params, apiKey);
    if (!result.ok) {
        throw new Error(result.error.msg);
    }
    return result.data;
}
