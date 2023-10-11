import { apiBasePath, flowApiPaths, evmLegacyBasePath } from "../../api-path";
import { ErrorResponse } from "../../error";
import {
    FirmQuoteRequest,
    FirmQuoteResponse,
    IndicativeQuoteRequest,
    IndicativeQuoteResponse,
    ReportTransactionRequest,
    ReportTransactionResponse,
} from "./type";
import { checkForError, MaybeErrorResult, post } from "../../util";

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

/** Error-returning variant of `reportTransaction`. Note that this will still throw if an
 * unrecognized error occurs or if the fetch request fails. */
export async function reportTransactionOrError(
    signatoryServerURL: string,
    params: ReportTransactionRequest,
    apiKey?: string,
): Promise<MaybeErrorResult<ReportTransactionResponse, ErrorResponse>> {
    const url = makeURL(signatoryServerURL, flowApiPaths.reportTransaction);
    const requestBody = JSON.stringify(params);
    const responseObj = await post(url, requestBody, apiKey);
    const error = await checkForError(responseObj);
    if (error) {
        return { ok: false, error };
    }
    const response: ReportTransactionResponse = await responseObj.json();
    return { ok: true, data: response };
}

/** Reports an executed transaction and releases payment to the order flow source. Throws on
 * error. */
export async function reportTransaction(
    signatoryServerURL: string,
    params: ReportTransactionRequest,
    apiKey?: string,
): Promise<ReportTransactionResponse> {
    const result = await reportTransactionOrError(signatoryServerURL, params, apiKey);
    if (!result.ok) {
        throw new Error(result.error.msg);
    }
    return result.data;
}

function makeURL(signatoryServerURL: string, endpoint: string): string {
    return `${signatoryServerURL}${apiBasePath}${evmLegacyBasePath}${endpoint}`;
}
