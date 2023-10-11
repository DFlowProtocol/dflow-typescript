import { sleep } from "../../coding";
import { MarketMakerAPIEVMContext } from "../../context";
import ERC20ABI from "./ERC-20.json";
import { ethers } from "ethers";
import { Logger } from "../../logger";
import Queue from "mnemonist/queue";

type Allowance = {
    network: string
    token: string
    allowanceTarget: string
}

export class AllowanceGranter {
    readonly evmContext: MarketMakerAPIEVMContext;
    readonly logger: Logger;
    readonly allowanceRequestQueue: Queue<Allowance> = new Queue();
    private isStarted = false;

    constructor(evmContext: MarketMakerAPIEVMContext) {
        this.evmContext = evmContext;
        this.logger = new Logger("AllowanceGranter");
    }

    grantAllowance(allowance: Allowance): void {
        this.allowanceRequestQueue.enqueue(allowance);
        if (!this.isStarted) {
            void this.start();
        }
    }

    private async start(): Promise<void> {
        this.isStarted = true;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const request = this.allowanceRequestQueue.dequeue();
            if (request === undefined) {
                await sleep(1_000);
                continue;
            }
            const { token, network, allowanceTarget } = request;
            const evmChainContext = this.evmContext.getChainContextByNetwork(network);
            if (!evmChainContext) {
                throw new Error(`EVM chain context not registered for network ${network}`);
            }

            const wallet = evmChainContext.wallet;
            const contract = new ethers.Contract(token, ERC20ABI, wallet);
            const currentAllowance = await contract.allowance(
                wallet.address,
                allowanceTarget,
            );
            if (currentAllowance === BigInt(0)) {
                this.logger.info(
                    `Sending approve tx for token ${token}, spender ${allowanceTarget}`,
                );
                const unlimitedAllowance = BigInt(2) ** BigInt(256) - BigInt(1);
                try {
                    const approveTx = await Promise.race([
                        contract.approve(allowanceTarget, unlimitedAllowance),
                        sleep(5_000).then(() => {
                            throw new Error(`Approve tx for ${token} timed out`);
                        }),
                    ]);
                    this.logger.info(`Sent approve tx for ${token}:`, approveTx);
                } catch (err) {
                    this.logger.error(`Failed to send approve tx for ${token}:`, err);
                    this.allowanceRequestQueue.enqueue(request);
                }
            }
        }
    }
}
