import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import getTransactionsWithinPast24Hours from "./getTransactionsWithinPast24Hours";

export default async function calculateTotalFees(address: string): Promise<number> {
    const recentTransactions = await getTransactionsWithinPast24Hours(address);

    const totalPrioFees = recentTransactions
        .map((tx) => tx.meta?.fee ?? 0)
        .reduce((acc, fee) => acc + fee, 0);

    const estimatedTotalFees = totalPrioFees / LAMPORTS_PER_SOL;

    return estimatedTotalFees;
}