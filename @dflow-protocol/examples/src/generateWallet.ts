import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { DFlowClient, DFlowPrefix } from "@dflow-protocol/client";
import "source-map-support/register"

/** Generates a wallet which can be used with the DFlowClient */
async function main(): Promise<void> {
    const wallet = await DirectSecp256k1HdWallet.generate(24, { prefix: DFlowPrefix });
    const mnemonic = wallet.mnemonic;
    const dflowClient = new DFlowClient("http://localhost:1317", "http://localhost:26657", wallet);
    const address = await dflowClient.getSignerAddress();
    console.log(`Address: ${address}`);
    console.log(`Mnemonic: ${mnemonic}`);
}

main().then(
    () => process.exit(0),
    error => {
        console.error(error);
        process.exit(1);
    },
);
