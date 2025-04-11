import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import wallet from "./dev-wallet.json";


const from = Keypair.fromSecretKey(new Uint8Array(wallet));


const to = new PublicKey("7MBcR9GQs94CWwL2SwzgSuhTa8guzb1dAVTDPCpnFzr9");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

(async () => {
    try{
        const balance = await connection.getBalance(from.publicKey);

        const transaction:Transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance,
            })
        );

        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = from.publicKey;

        const fee = (await connection.getFeeForMessage(transaction.compileMessage())).value || 0;

        transaction.instructions.pop();

        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance - fee,
            })
        );

        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        ); 
        console.log(`Success! Check out your TX here: \n
            https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (error) {
        console.error(`Oops! Something went wrong: ${error}`);
    }
})();