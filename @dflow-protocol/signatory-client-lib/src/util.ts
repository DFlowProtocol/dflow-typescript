import { ErrorResponse, schemaErrorResponse } from "./error";

export const API_KEY_HEADER_NAME = "x-api-key";

export function get(
    url: string,
    query: Record<string, string|number|boolean>,
    apiKey?: string,
): Promise<Response> {
    const encodedParams = Object.entries(query).reduce((acc, curr) => {
        acc[curr[0]] = encodeURIComponent(curr[1]);
        return acc;
    }, {} as Record<string, string>);
    const urlParams = new URLSearchParams(encodedParams);
    const urlWithParams = `${url}?${urlParams}`;
    const headers: Record<string, string> = apiKey ? { [API_KEY_HEADER_NAME]: apiKey } : {};
    return fetch(urlWithParams, { headers });
}

export function post(url: string, body: string, apiKey?: string): Promise<Response> {
    const headers: Record<string, string> = apiKey ? {
        "content-type": "application/json",
        "content-length": Buffer.byteLength(body).toString(),
        [API_KEY_HEADER_NAME]: apiKey,
    } : {
        "content-type": "application/json",
        "content-length": Buffer.byteLength(body).toString(),
    };
    return fetch(url, {
        method: "POST",
        headers,
        body,
    });
}

export async function checkForError(response: Response): Promise<ErrorResponse | null> {
    if (response.ok) {
        return null;
    }

    let errorResponse;
    try {
        errorResponse = await response.text();
    } catch (error) {
        throw new Error(`HTTP ${response.status}`);
    }

    let errorResponseObj;
    try {
        errorResponseObj = JSON.parse(errorResponse);
    } catch (error) {
        const msg = errorResponse
            ? `HTTP ${response.status}: ${errorResponse}`
            : `HTTP ${response.status}`;
        throw new Error(msg);
    }

    try {
        return schemaErrorResponse.parse(errorResponseObj);
    } catch {
        const msg = errorResponse
            ? `HTTP ${response.status}: ${errorResponse}`
            : `HTTP ${response.status}`;
        throw new Error(msg);
    }
}

export type MaybeErrorResult<TOk, TError> = OkResult<TOk> | ErrorResult<TError>
type OkResult<TOkResult> = { ok: true, data: TOkResult }
type ErrorResult<TErrorResult> = { ok: false, error: TErrorResult }
