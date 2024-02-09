import { z } from "zod";

export enum ErrorCode {
    // Common errors
    Unspecified = 1000,
    InvalidQuoteRequest = 1001,
    SendQtyStringFormatError = 1002,
    InsufficientTokenBalance = 1003,
    OrderFlowSourceNotFound = 1004,
    NoPricingSource = 1005,
    NoAuctionFound = 1006,
    NoAuctionWinner = 1007,
    InvalidPlatformFeeReceiver = 1008,
    FetchTokenDecimalsError = 1009,
    FetchDBBOError = 1010,
    NoDBBORoute = 1011,
    RequestNotEndorsed = 1012,
    RequestEndorsementExpired = 1013,
    RequestEndorsementExpirationTooFarOut = 1014,
    MarketMakerQuoteAPIError = 1015,
    ZeroReceiveQty = 1016,
    InvalidMarketMakerFeePayer = 1017,
    InvalidFillPrice = 1018,
    InvalidSendTransactionRequest = 1019,
    InvalidSendTransactionIdentifier = 1020,
    InvalidSendTransactionTransaction = 1021,
    TransactionNotSigned = 1022,
    TransactionExpired = 1023,
    MarketMakerSendTransactionAPIError = 1024,
    DeliverNotionalError = 1025,
    InvalidPaymentInLieuToken = 1026,
    InvalidPaymentInLieuRequest = 1027,
    PaymentInLieuNotApproved = 1028,
    InvalidEndorsementData = 1029,
    UnrecognizedAuctionFeePayer = 1030,
    SponsoredSwapCannotSendNativeToken = 1031,
    MinReceiveQtyLessThanReimbursementMaxAllowedRecv = 1032,
    InvalidMarketsRequest = 1033,
    MarketMakerInsufficientBalance = 1034,

    // Solana errors
    InsufficientLamports = 2000,
    WalletBelowRentExemptMinimumAfterTx = 2001,
    RetailTokenAccountNotSetUp = 2002,
    RetailTokenAccountInvalid = 2003,
    RetailTokenAccountFrozen = 2004,
    MarketMakerTokenAccountNotSetUp = 2005,
    MarketMakerTokenAccountInvalid = 2006,
    MarketMakerTokenAccountFrozen = 2007,
    MarketMakerInvalidYAccountOwner = 2008,
    MarketMakerXAccountBelowRentExemptMinimumAfterTx = 2009,
    MarketMakerYAccountBelowRentExemptMinimumAfterTx = 2010,
    MarketMakerFeePayerBelowRentExemptMinimumAfterTx = 2011,
    MarketMakerInsufficientXAccountLamports = 2012,
    MarketMakerInsufficientFeePayerLamports = 2013,
    RetailWalletCannotSendNativeSol = 2014,

    // EVM errors
    UnsupportedChainId = 3000,
    InvalidMarketMakerOrderExpiry = 3001,
    InvalidMarketMakerOrderSignature = 3002,
    InvalidReportTransactionRequest = 3003,
    InvalidReportTransactionTransaction = 3004,
    MissingLastAllowedBlockTimestamp = 3005,
    InvalidMarketMakerOrderNotFillable = 3006,
    SponsoredSwapOrderNotSigned = 3007,
}

// Common errors
export const unspecifiedError = z.object({
    code: z.literal(ErrorCode.Unspecified),
    msg: z.string(),
});
export const invalidQuoteRequest = z.object({
    code: z.literal(ErrorCode.InvalidQuoteRequest),
    msg: z.string(),
});
export const sendQtyStringFormatError = z.object({
    code: z.literal(ErrorCode.SendQtyStringFormatError),
    msg: z.string(),
});
export const insufficientTokenBalance = z.object({
    code: z.literal(ErrorCode.InsufficientTokenBalance),
    msg: z.string(),
    token: z.string(),
    walletBalance: z.string(),
    requiredBalance: z.string(),
});
export const orderFlowSourceNotFound = z.object({
    code: z.literal(ErrorCode.OrderFlowSourceNotFound),
    msg: z.string(),
});
export const noPricingSource = z.object({
    code: z.literal(ErrorCode.NoPricingSource),
    msg: z.string(),
});
export const noAuctionFound = z.object({
    code: z.literal(ErrorCode.NoAuctionFound),
    msg: z.string(),
});
export const noAuctionWinner = z.object({
    code: z.literal(ErrorCode.NoAuctionWinner),
    msg: z.string(),
});
export const invalidPlatformFeeReceiver = z.object({
    code: z.literal(ErrorCode.InvalidPlatformFeeReceiver),
    msg: z.string(),
});
export const fetchTokenDecimalsError = z.object({
    code: z.literal(ErrorCode.FetchTokenDecimalsError),
    msg: z.string(),
    token: z.string(),
});
export const fetchDBBOError = z.object({
    code: z.literal(ErrorCode.FetchDBBOError),
    msg: z.string(),
});
export const noDBBORoute = z.object({
    code: z.literal(ErrorCode.NoDBBORoute),
    msg: z.string(),
});
export const requestNotEndorsed = z.object({
    code: z.literal(ErrorCode.RequestNotEndorsed),
    msg: z.string(),
});
export const requestEndorsementExpired = z.object({
    code: z.literal(ErrorCode.RequestEndorsementExpired),
    msg: z.string(),
});
export const requestEndorsementExpirationTooFarOut = z.object({
    code: z.literal(ErrorCode.RequestEndorsementExpirationTooFarOut),
    msg: z.string(),
});
export const marketMakerQuoteAPIError = z.object({
    code: z.literal(ErrorCode.MarketMakerQuoteAPIError),
    msg: z.string(),
});
export const zeroReceiveQty = z.object({
    code: z.literal(ErrorCode.ZeroReceiveQty),
    msg: z.string(),
});
export const invalidMarketMakerFeePayer = z.object({
    code: z.literal(ErrorCode.InvalidMarketMakerFeePayer),
    msg: z.string(),
});
export const invalidFillPrice = z.object({
    code: z.literal(ErrorCode.InvalidFillPrice),
    msg: z.string(),
});
export const invalidSendTransactionRequest = z.object({
    code: z.literal(ErrorCode.InvalidSendTransactionRequest),
    msg: z.string(),
});
export const invalidSendTransactionIdentifier = z.object({
    code: z.literal(ErrorCode.InvalidSendTransactionIdentifier),
    msg: z.string(),
});
export const invalidSendTransactionTransaction = z.object({
    code: z.literal(ErrorCode.InvalidSendTransactionTransaction),
    msg: z.string(),
});
export const transactionNotSigned = z.object({
    code: z.literal(ErrorCode.TransactionNotSigned),
    msg: z.string(),
});
export const transactionExpired = z.object({
    code: z.literal(ErrorCode.TransactionExpired),
    msg: z.string(),
});
export const marketMakerSendTransactionAPIError = z.object({
    code: z.literal(ErrorCode.MarketMakerSendTransactionAPIError),
    msg: z.string(),
});
export const deliverNotionalError = z.object({
    code: z.literal(ErrorCode.DeliverNotionalError),
    msg: z.string(),
});
export const invalidPaymentInLieuToken = z.object({
    code: z.literal(ErrorCode.InvalidPaymentInLieuToken),
    msg: z.string(),
});
export const invalidPaymentInLieuRequest = z.object({
    code: z.literal(ErrorCode.InvalidPaymentInLieuRequest),
    msg: z.string(),
});
export const paymentInLieuNotApproved = z.object({
    code: z.literal(ErrorCode.PaymentInLieuNotApproved),
    msg: z.string(),
});
export const invalidEndorsementData = z.object({
    code: z.literal(ErrorCode.InvalidEndorsementData),
    msg: z.string(),
});
export const unrecognizedAuctionFeePayer = z.object({
    code: z.literal(ErrorCode.UnrecognizedAuctionFeePayer),
    msg: z.string(),
});
export const sponsoredSwapCannotSendNativeToken = z.object({
    code: z.literal(ErrorCode.SponsoredSwapCannotSendNativeToken),
    msg: z.string(),
});
export const minReceiveQtyLessThanReimbursementMaxAllowedRecv = z.object({
    code: z.literal(ErrorCode.MinReceiveQtyLessThanReimbursementMaxAllowedRecv),
    msg: z.string(),
    minReceiveQty: z.string(),
});
export const invalidMarketsRequest = z.object({
    code: z.literal(ErrorCode.InvalidMarketsRequest),
    msg: z.string(),
});
export const marketMakerInsufficientBalance = z.object({
    code: z.literal(ErrorCode.MarketMakerInsufficientBalance),
    msg: z.string(),
});

// Solana errors
export const insufficientLamports = z.object({
    code: z.literal(ErrorCode.InsufficientLamports),
    msg: z.string(),
    walletLamports: z.string(),
    requiredLamports: z.string(),
});
export const walletBelowRentExemptMinimumAfterTx = z.object({
    code: z.literal(ErrorCode.WalletBelowRentExemptMinimumAfterTx),
    msg: z.string(),
    lamportsAfterTx: z.string(),
    rentExemptMinimum: z.string(),
});
export const retailTokenAccountNotSetUp = z.object({
    code: z.literal(ErrorCode.RetailTokenAccountNotSetUp),
    msg: z.string(),
    mint: z.string(),
});
export const retailTokenAccountInvalid = z.object({
    code: z.literal(ErrorCode.RetailTokenAccountInvalid),
    msg: z.string(),
    mint: z.string(),
});
export const retailTokenAccountFrozen = z.object({
    code: z.literal(ErrorCode.RetailTokenAccountFrozen),
    msg: z.string(),
    mint: z.string(),
});
export const marketMakerTokenAccountNotSetUp = z.object({
    code: z.literal(ErrorCode.MarketMakerTokenAccountNotSetUp),
    msg: z.string(),
    mint: z.string(),
});
export const marketMakerTokenAccountInvalid = z.object({
    code: z.literal(ErrorCode.MarketMakerTokenAccountInvalid),
    msg: z.string(),
    mint: z.string(),
});
export const marketMakerTokenAccountFrozen = z.object({
    code: z.literal(ErrorCode.MarketMakerTokenAccountFrozen),
    msg: z.string(),
    mint: z.string(),
});
export const marketMakerInvalidYAccountOwner = z.object({
    code: z.literal(ErrorCode.MarketMakerInvalidYAccountOwner),
    msg: z.string(),
    actualOwner: z.string(),
    expectedOwner: z.string(),
});
export const marketMakerXAccountBelowRentExemptMinimumAfterTx = z.object({
    code: z.literal(ErrorCode.MarketMakerXAccountBelowRentExemptMinimumAfterTx),
    msg: z.string(),
    lamportsAfterTx: z.string(),
    rentExemptMinimum: z.string(),
});
export const marketMakerYAccountBelowRentExemptMinimumAfterTx = z.object({
    code: z.literal(ErrorCode.MarketMakerYAccountBelowRentExemptMinimumAfterTx),
    msg: z.string(),
    lamportsAfterTx: z.string(),
    rentExemptMinimum: z.string(),
});
export const marketMakerFeePayerBelowRentExemptMinimumAfterTx = z.object({
    code: z.literal(ErrorCode.MarketMakerFeePayerBelowRentExemptMinimumAfterTx),
    msg: z.string(),
    lamportsAfterTx: z.string(),
    rentExemptMinimum: z.string(),
});
export const marketMakerInsufficientXAccountLamports = z.object({
    code: z.literal(ErrorCode.MarketMakerInsufficientXAccountLamports),
    msg: z.string(),
    walletLamports: z.string(),
    requiredLamports: z.string(),
});
export const marketMakerInsufficientFeePayerLamports = z.object({
    code: z.literal(ErrorCode.MarketMakerInsufficientFeePayerLamports),
    msg: z.string(),
    walletLamports: z.string(),
    requiredLamports: z.string(),
});
export const retailWalletCannotSendNativeSol = z.object({
    code: z.literal(ErrorCode.RetailWalletCannotSendNativeSol),
    msg: z.string(),
});

// EVM errors
export const unsupportedChainId = z.object({
    code: z.literal(ErrorCode.UnsupportedChainId),
    msg: z.string(),
});
export const invalidMarketMakerOrderExpiry = z.object({
    code: z.literal(ErrorCode.InvalidMarketMakerOrderExpiry),
    msg: z.string(),
});
export const invalidMarketMakerOrderSignature = z.object({
    code: z.literal(ErrorCode.InvalidMarketMakerOrderSignature),
    msg: z.string(),
});
export const invalidReportTransactionRequest = z.object({
    code: z.literal(ErrorCode.InvalidReportTransactionRequest),
    msg: z.string(),
});
export const invalidReportTransactionTransaction = z.object({
    code: z.literal(ErrorCode.InvalidReportTransactionTransaction),
    msg: z.string(),
});
export const missingLastAllowedBlockTimestamp = z.object({
    code: z.literal(ErrorCode.MissingLastAllowedBlockTimestamp),
    msg: z.string(),
});
export const invalidMarketMakerOrderNotFillable = z.object({
    code: z.literal(ErrorCode.InvalidMarketMakerOrderNotFillable),
    msg: z.string(),
});
export const sponsoredSwapOrderNotSigned = z.object({
    code: z.literal(ErrorCode.SponsoredSwapOrderNotSigned),
    msg: z.string(),
});

export type ErrorResponse = z.infer<typeof schemaErrorResponse>;
export const schemaErrorResponse = z.discriminatedUnion("code", [
    // Common errors
    unspecifiedError,
    invalidQuoteRequest,
    sendQtyStringFormatError,
    insufficientTokenBalance,
    orderFlowSourceNotFound,
    noPricingSource,
    noAuctionFound,
    noAuctionWinner,
    invalidPlatformFeeReceiver,
    fetchTokenDecimalsError,
    fetchDBBOError,
    noDBBORoute,
    requestNotEndorsed,
    requestEndorsementExpired,
    requestEndorsementExpirationTooFarOut,
    marketMakerQuoteAPIError,
    zeroReceiveQty,
    invalidMarketMakerFeePayer,
    invalidFillPrice,
    invalidSendTransactionRequest,
    invalidSendTransactionIdentifier,
    invalidSendTransactionTransaction,
    transactionNotSigned,
    transactionExpired,
    marketMakerSendTransactionAPIError,
    deliverNotionalError,
    invalidPaymentInLieuToken,
    invalidPaymentInLieuRequest,
    paymentInLieuNotApproved,
    invalidEndorsementData,
    unrecognizedAuctionFeePayer,
    sponsoredSwapCannotSendNativeToken,
    minReceiveQtyLessThanReimbursementMaxAllowedRecv,
    invalidMarketsRequest,
    marketMakerInsufficientBalance,

    // Solana errors
    insufficientLamports,
    walletBelowRentExemptMinimumAfterTx,
    retailTokenAccountNotSetUp,
    retailTokenAccountInvalid,
    retailTokenAccountFrozen,
    marketMakerTokenAccountNotSetUp,
    marketMakerTokenAccountInvalid,
    marketMakerTokenAccountFrozen,
    marketMakerInvalidYAccountOwner,
    marketMakerXAccountBelowRentExemptMinimumAfterTx,
    marketMakerYAccountBelowRentExemptMinimumAfterTx,
    marketMakerFeePayerBelowRentExemptMinimumAfterTx,
    marketMakerInsufficientXAccountLamports,
    marketMakerInsufficientFeePayerLamports,
    retailWalletCannotSendNativeSol,

    // EVM errors
    unsupportedChainId,
    invalidMarketMakerOrderExpiry,
    invalidMarketMakerOrderSignature,
    invalidReportTransactionRequest,
    invalidReportTransactionTransaction,
    missingLastAllowedBlockTimestamp,
    invalidMarketMakerOrderNotFillable,
    sponsoredSwapOrderNotSigned,
]);
