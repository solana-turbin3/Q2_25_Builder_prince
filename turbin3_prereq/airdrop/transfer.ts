
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(new Uint8Array(wallet));

const to = new PublicKey("GLtaTaYiTQrgz411iPJD79rsoee59HhEy18rtRdrhEUJ");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

(async () => {
    try{
        const transaction:Transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: LAMPORTS_PER_SOL/100,
            })
        );

        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;

        transaction.feePayer = from.publicKey;

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