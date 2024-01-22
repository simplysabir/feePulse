import { Connection, PublicKey, ParsedTransactionWithMeta } from "@solana/web3.js";
// change with your own rpc
const connection = new Connection("https://api.mainnet-beta.solana.com");

export default async function getTransactionsWithinPast24Hours(address: string): Promise<ParsedTransactionWithMeta[]> {
    
    const currentSlot = await connection.getSlot();
    const past24HoursSlot = currentSlot - (24 * 60 * 60 * 4);
    const walletAddress = new PublicKey(address);

    const transactions: ParsedTransactionWithMeta[] = [];
    let before: string | undefined = undefined;

    while (true) {
        const signatures = await connection.getSignaturesForAddress(
            walletAddress,
            { before, limit: 1000 }
        );

        if (signatures.length === 0) {
            break;
        }

        const parsedTransactions = await Promise.all(
            signatures.map((sig) => connection.getParsedTransaction(sig.signature, { "maxSupportedTransactionVersion": 0 }))
        );

        const filteredTransactions = parsedTransactions.filter(
            (tx: ParsedTransactionWithMeta | null): tx is ParsedTransactionWithMeta =>
                tx !== null && tx.slot >= past24HoursSlot
        );

        transactions.push(...filteredTransactions.filter((tx) => tx !== null));

        before = signatures[signatures.length - 1].slot.toString();

        if (before < past24HoursSlot.toString()) {
            break;
        }
    }

    return transactions;
}