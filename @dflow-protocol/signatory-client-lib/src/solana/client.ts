import { apiBasePath, flowApiPaths, solanaBasePath } from "../api-path";
import { ErrorResponse } from "../error";
import {
    FirmQuoteRequest,
    FirmQuoteResponse,
    IndicativeQuoteRequest,
    IndicativeQuoteResponse,
    SendTransactionRequest,
    SendTransactionResponse,
} from "./type";
import { checkForError, MaybeErrorResult, post } from "../util";

/** Error-returning variant of `getIndicativeQuote`. Note that this will still throw if an
 * unrecognized error occurs or if the fetch request fails. */
export async function getIndicativeQuoteOrError(
    signatoryServerURL: string,
    params: IndicativeQuoteRequest,
    apiKey?: string,
): Promise<MaybeErrorResult<IndicativeQuoteResponse, ErrorResponse>> {
    const url = makeURL(signatoryServerURL, flowApiPaths.indicativeQuote);
    const requestBody = JSON.stringify(params);
    const responseObj = await post(url, requestBody, apiKey);
    const error = await checkForError(responseObj);
    if (error) {
        return { ok: false, error };
    }
    const response: IndicativeQuoteResponse = await responseObj.json();
    return { ok: true, data: response };
}

/** Gets an indicative quote. Throws on error. */
export async function getIndicativeQuote(
    signatoryServerURL: string,
    params: IndicativeQuoteRequest,
    apiKey?: string,
): Promise<IndicativeQuoteResponse> {
    const result = await getIndicativeQuoteOrError(signatoryServerURL, params, apiKey);
    if (!result.ok) {
        throw new Error(result.error.msg);
    }
    return result.data;
}

/** Error-returning variant of `getFirmQuote`. Note that this will still throw if an
 * unrecognized error occurs or if the fetch request fails. */
export async function getFirmQuoteOrError(
    signatoryServerURL: string,
    params: FirmQuoteRequest,
    apiKey?: string,
): Promise<MaybeErrorResult<FirmQuoteResponse, ErrorResponse>> {
    const url = makeURL(signatoryServerURL, flowApiPaths.firmQuote);
    const requestBody = JSON.stringify(params);
    const responseObj = await post(url, requestBody, apiKey);
    const error = await checkForError(responseObj);
    if (error) {
        return { ok: false, error };
    }
    const response: FirmQuoteResponse = await responseObj.json();
    return { ok: true, data: response };
}

/** Gets a firm quote. Throws on error. */
export async function getFirmQuote(
    signatoryServerURL: string,
    params: FirmQuoteRequest,
    apiKey?: string,
): Promise<FirmQuoteResponse> {
    const result = await getFirmQuoteOrError(signatoryServerURL, params, apiKey);
    if (!result.ok) {
        throw new Error(result.error.msg);
    }
    return result.data;
}

/** Error-returning variant of `sendTransaction`. Note that this will still throw if an
 * unrecognized error occurs or if the fetch request fails. */
export async function sendTransactionOrError(
    signatoryServerURL: string,
    params: SendTransactionRequest,
    apiKey?: string,
): Promise<MaybeErrorResult<SendTransactionResponse, ErrorResponse>> {
    const url = makeURL(signatoryServerURL, flowApiPaths.sendTransaction);
    const requestBody = JSON.stringify(params);
    const responseObj = await post(url, requestBody, apiKey);
    const error = await checkForError(responseObj);
    if (error) {
        return { ok: false, error };
    }
    const response: SendTransactionResponse = await responseObj.json();
    return { ok: true, data: response };
}

/** Sends a transaction. Throws on error. */
export async function sendTransaction(
    signatoryServerURL: string,
    params: SendTransactionRequest,
    apiKey?: string,
): Promise<SendTransactionResponse> {
    const result = await sendTransactionOrError(signatoryServerURL, params, apiKey);
    if (!result.ok) {
        throw new Error(result.error.msg);
    }
    return result.data;
}

function makeURL(signatoryServerURL: string, endpoint: string): string {
    return `${signatoryServerURL}${apiBasePath}${solanaBasePath}${endpoint}`;
}
