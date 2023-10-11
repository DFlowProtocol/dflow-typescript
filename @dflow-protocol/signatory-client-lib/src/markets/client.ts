import { apiBasePath, marketsBasePath } from "../api-path";
import { ErrorResponse } from "../error";
import { MarketsRequest, MarketsResponse } from "./type";
import { checkForError, get, MaybeErrorResult } from "../util";

/** Error-returning variant of `getMarkets`. Note that this will still throw if an
 * unrecognized error occurs or if the fetch request fails. */
export async function getMarketsOrError(
    signatoryServerURL: string,
    params: MarketsRequest,
    apiKey?: string,
): Promise<MaybeErrorResult<MarketsResponse, ErrorResponse>> {
    const url = `${signatoryServerURL}${apiBasePath}${marketsBasePath}`;
    const responseObj = await get(url, params, apiKey);
    const error = await checkForError(responseObj);
    if (error) {
        return { ok: false, error };
    }
    const response: MarketsResponse = await responseObj.json();
    return { ok: true, data: response };
}

/** Gets available markets. Throws on error. */
export async function getMarkets(
    signatoryServerURL: string,
    params: MarketsRequest,
    apiKey?: string,
): Promise<MarketsResponse> {
    const result = await getMarketsOrError(signatoryServerURL, params, apiKey);
    if (!result.ok) {
        throw new Error(result.error.msg);
    }
    return result.data;
}
