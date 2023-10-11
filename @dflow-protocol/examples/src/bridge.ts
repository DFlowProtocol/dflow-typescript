import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
    BridgeClient,
    DFlowClient,
    DFlowPrefix,
    WaitForWithdrawalApprovalResultCode,
} from "@dflow-protocol/client";
import { BN } from "@project-serum/anchor";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import fs from "fs";
import assert from "node:assert";
import process from "process";
import "source-map-support/register"

/** Deposits USDC from Solana to DFlow and withdraws it back to Solana */
async function main(): Promise<void> {
    const solanaKeyPath = "/path/to/solana-key.json";
    const solanaKey = new Uint8Array(JSON.parse(fs.readFileSync(solanaKeyPath, "utf-8")));
    const solanaKeypair = Keypair.fromSecretKey(solanaKey);
    const signTransaction = (tx: Transaction) => {
        tx.sign(solanaKeypair);
        return Promise.resolve(tx);
    };
    const solanaConnection = new Connection("http://localhost:8899", "finalized"); // Replace with your Solana endpoint
    const bridgeClient = new BridgeClient({ solanaConnection });
    const solanaUsdcTokenAccount = getAssociatedTokenAddressSync(bridgeClient.bridgeMint, solanaKeypair.publicKey);
    const getSolanaBalance = async () => await getAccount(solanaConnection, solanaUsdcTokenAccount).then(x => x.amount);

    const dflowKeyMnemonicPath = "/path/to/dflow/key-mnemonic.txt";
    const dflowKeyMnemonic = fs.readFileSync(dflowKeyMnemonicPath, "utf-8").trim();
    const dflowKeypair = await DirectSecp256k1HdWallet.fromMnemonic(dflowKeyMnemonic, {
        prefix: DFlowPrefix,
    });
    const dflowClient = new DFlowClient(
        "http://localhost:1317",  // Replace with your DFlow endpoint
        "http://localhost:26657", // Replace with your DFlow endpoint
        dflowKeypair,
    );
    await dflowClient.init();

    // Deposit 1 USDC
    const balanceBeforeDeposit = await dflowClient.getBalance();
    const solanaBalanceBeforeDeposit = await getSolanaBalance();
    const depositAmount = 1_000000; // 1 USDC
    const depositResult = await bridgeClient.deposit({
        amount: new BN(depositAmount),
        recipient: await dflowClient.getDepositRecipient(),
        depositor: solanaKeypair.publicKey,
        signTransaction,
    });
    const solanaBalanceAfterDeposit = await getSolanaBalance();
    assert.equal(solanaBalanceAfterDeposit, solanaBalanceBeforeDeposit - BigInt(depositAmount));

    // Wait for the deposit to be processed
    const isDepositProcessed = await bridgeClient.waitForDeposit({
        depositStateAccountSeed: depositResult.depositStateAccountSeed,
        client: dflowClient,
    });
    if (!isDepositProcessed) {
        throw new Error("Deposit was not processed");
    }
    const balanceAfterDeposit = await dflowClient.getBalance();
    assert.equal(balanceAfterDeposit, balanceBeforeDeposit + BigInt(depositAmount));

    // Withdraw 1 USDC
    const withdrawalAmount = depositAmount;
    const requestWithdrawalResult = await bridgeClient.requestWithdrawal({
        client: dflowClient,
        toAccount: solanaUsdcTokenAccount,
        toAccountOwner: solanaKeypair.publicKey,
        amount: withdrawalAmount,
    });
    const balanceAfterWithdrawalRequest = await dflowClient.getBalance();
    assert.equal(balanceAfterWithdrawalRequest, balanceAfterDeposit - BigInt(withdrawalAmount));

    // Wait for the withdrawal to be approved
    const waitForWithdrawalApprovalResult = await bridgeClient.waitForWithdrawalApproval({
        withdrawId: requestWithdrawalResult.withdrawId,
        toAccount: solanaUsdcTokenAccount,
        toAccountOwner: solanaKeypair.publicKey,
        payer: solanaKeypair.publicKey,
        client: dflowClient,
    });
    if (waitForWithdrawalApprovalResult.code !== WaitForWithdrawalApprovalResultCode.Ok) {
        throw new Error("Withdrawal was not approved within timeout");
    }

    // Complete the withdrawal on Solana
    const solanaBalanceBeforeWithdrawal = await getSolanaBalance();
    await bridgeClient.withdraw({
        tx: waitForWithdrawalApprovalResult.tx,
        signTransaction,
    });
    const solanaBalanceAfterWithdrawal = await getSolanaBalance();
    assert.equal(solanaBalanceAfterWithdrawal, solanaBalanceBeforeWithdrawal + BigInt(withdrawalAmount));
}

main().then(
    () => process.exit(0),
    error => {
        console.error(error);
        process.exit(1);
    },
);
