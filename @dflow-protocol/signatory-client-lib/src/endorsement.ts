import { z } from "zod";

export type Endorsement = z.infer<typeof schemaEndorsement>;
export const schemaEndorsement = z.object({
    /** Base58-encoded Ed25519 public key used to sign the endorsement message. */
    endorser: z.string(),
    /** Base64-encoded Ed25519 signature of `{id},{expirationTime},{data}` */
    signature: z.string(),
    /** Base64-encoded 64-bit identifier for the endorsement. */
    id: z.string(),
    /** Expiration time as UTC. Number of seconds since Jan 1, 1970 00:00:00 UTC. */
    expirationTimeUTC: z.number(),
    /** Pipe-delimited endorsement data */
    data: z.string(),
});

/** @deprecated Pipe-delimited endorsement data, schema version 1. */
export type EndorsementDataV1 = z.infer<typeof schemaEndorsementDataV1>;
export const schemaEndorsementDataV1 = z.tuple([
    /** The schema version of the endorsement data */
    z.literal("1").describe("schemaVersion"),

    /** Optional public key of the retail trader's wallet on the settlement network, encoded using
     * the encoding scheme used for wallet addresses on the settlement network. Must be specified if
     * the endorsement will be used to request a firm quote. */
    z.string().describe("retailTrader"),

    /** Optional platform fee specified as a string of the form `{bps},{receiver}`, where `bps` is
     * the platform fee amount in basis points and `receiver` is the public key of the wallet that
     * will receive the fee. Fractional basis points are not supported. The `receiver` public key
     * must be encoded using the encoding scheme used for wallet addresses on the settlement
     * network. */
    z.string().describe("platformFee"),

    /** Optional send token address. If specified, the endorsement can only be used to request a
     * quote where the retail trader sends the specified token. */
    z.string().describe("sendToken"),

    /** Optional receive token address. If specified, the endorsement can only be used to request a
     * quote where the retail trader receives the specified token. */
    z.string().describe("receiveToken"),

    /** Optional send quantity, specified as a fixed-point number. If specified, if the
     * endorsement can only be used to request a quote where the retail trader sends exactly this
     * quantity of the send token. Cannot be specified if the send token is unspecified. Cannot be
     * specified if the max send quantity is specified. */
    z.string().describe("sendQuantity"),

    /** Optional maximum send quantity, specified as a fixed-point number. If specified, if the
     * endorsement can only be used to request a quote where the retail trader sends at most this
     * quantity of the send token. Cannot be specified if the send token is unspecified. Cannot be
     * specified if the send quantity is specified. */
    z.string().describe("maxSendQuantity"),
]);

/** @deprecated Pipe-delimited endorsement data, schema version 2. */
export type EndorsementDataV2 = z.infer<typeof schemaEndorsementDataV2>;
export const schemaEndorsementDataV2 = z.tuple([
    /** The schema version of the endorsement data */
    z.literal("2").describe("schemaVersion"),

    /** Optional public key of the retail trader's wallet on the settlement network, encoded using
     * the encoding scheme used for wallet addresses on the settlement network. Must be specified if
     * the endorsement will be used to request a firm quote. */
    z.string().describe("retailTrader"),

    /** Optional platform fee specified as a string of the form `{bps},{receiver}`, where `bps` is
     * the platform fee amount in basis points and `receiver` is the public key of the wallet that
     * will receive the fee. Fractional basis points are not supported. The `receiver` public key
     * must be encoded using the encoding scheme used for wallet addresses on the settlement
     * network. */
    z.string().describe("platformFee"),

    /** Optional send token address. If specified, the endorsement can only be used to request a
     * quote where the retail trader sends the specified token. */
    z.string().describe("sendToken"),

    /** Optional receive token address. If specified, the endorsement can only be used to request a
     * quote where the retail trader receives the specified token. */
    z.string().describe("receiveToken"),

    /** Optional send quantity, specified as a fixed-point number. If specified, if the
     * endorsement can only be used to request a quote where the retail trader sends exactly this
     * quantity of the send token. Cannot be specified if the send token is unspecified. Cannot be
     * specified if the max send quantity is specified. */
    z.string().describe("sendQuantity"),

    /** Optional maximum send quantity, specified as a fixed-point number. If specified, if the
     * endorsement can only be used to request a quote where the retail trader sends at most this
     * quantity of the send token. Cannot be specified if the send token is unspecified. Cannot be
     * specified if the send quantity is specified. */
    z.string().describe("maxSendQuantity"),

    /** Optional additional free-form data. At most 2000 characters. Must not contain the pipe
     * character `|`. */
    z.string().max(2000).describe("additionalData"),
]);

/** Pipe-delimited endorsement data, schema version 3. */
export type EndorsementDataV3 = z.infer<typeof schemaEndorsementDataV3>;
export const schemaEndorsementDataV3 = z.tuple([
    /** The schema version of the endorsement data */
    z.literal("3").describe("schemaVersion"),

    /** Optional public key of the retail trader's wallet on the settlement network, encoded using
     * the encoding scheme used for wallet addresses on the settlement network. Must be specified if
     * the endorsement will be used to request a firm quote. */
    z.string().describe("retailTrader"),

    /** Optional platform fee specified as a string of the form `{bps},{receiver}`, where `bps` is
     * the platform fee amount in basis points and `receiver` is the public key of the wallet that
     * will receive the fee. Fractional basis points are not supported. The `receiver` public key
     * must be encoded using the encoding scheme used for wallet addresses on the settlement
     * network. */
    z.string().describe("platformFee"),

    /** Optional send token address. If specified, the endorsement can only be used to request a
     * quote where the retail trader sends the specified token. */
    z.string().describe("sendToken"),

    /** Optional receive token address. If specified, the endorsement can only be used to request a
     * quote where the retail trader receives the specified token. */
    z.string().describe("receiveToken"),

    /** Optional send quantity, specified as a fixed-point number. If specified, the
     * endorsement can only be used to request a quote where the retail trader sends exactly this
     * quantity of the send token. Cannot be specified if the send token is unspecified. Cannot be
     * specified if the max send quantity is specified. */
    z.string().describe("sendQuantity"),

    /** Optional maximum send quantity, specified as a fixed-point number. If specified, the
     * endorsement can only be used to request a quote where the retail trader sends at most this
     * quantity of the send token. Cannot be specified if the send token is unspecified. Cannot be
     * specified if the send quantity is specified. */
    z.string().describe("maxSendQuantity"),

    /** Only applies to EVM standard swap endorsements. Address of the proxy contract through which
     * the retail trader wallet will execute the transaction. Specified if and only if the retail
     * trader will execute the transaction through a proxy contract. */
    z.string().describe("evmProxyContract"),

    /** Optional additional free-form data. At most 2000 characters. Must not contain the pipe
     * character `|`. */
    z.string().max(2000).describe("additionalData"),
]);

export function makeEndorsementMessage(
    id: string,
    expirationTimeUTC: number,
    data: string,
): string {
    return `${id},${expirationTimeUTC},${data}`;
}

export function serializeEndorsementData(data: EndorsementDataV3): string {
    return data.join("|");
}

export type MakeEndorsementDataParams = {
    retailTrader?: string
    platformFee?: {
        bps: number
        receiver: string
    }
    sendToken?: string
    receiveToken?: string
    sendQuantity?: string
    maxSendQuantity?: string
    evmProxyContract?: string
    additionalData?: string
}

export function makeEndorsementData(params: MakeEndorsementDataParams): string {
    const {
        retailTrader,
        platformFee,
        sendToken,
        receiveToken,
        sendQuantity,
        maxSendQuantity,
        evmProxyContract,
        additionalData,
    } = params;
    const endorsementData: EndorsementDataV3 = [
        "3",
        retailTrader ?? "",
        platformFee ? `${platformFee.bps},${platformFee.receiver}` : "",
        sendToken ?? "",
        receiveToken ?? "",
        sendQuantity ?? "",
        maxSendQuantity ?? "",
        evmProxyContract ?? "",
        additionalData ?? "",
    ];
    return serializeEndorsementData(endorsementData);
}
