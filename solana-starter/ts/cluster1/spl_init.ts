import { Keypair, Connection, Commitment, clusterApiUrl } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

if(!keypair){
    console.log("put the wallet!");
}

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection(clusterApiUrl('devnet'), commitment);
console.log("connection",connection);
(async () => {
    try {
        // Start here
        const mint = await createMint(
            connection,
            keypair,
            keypair.publicKey,
            null,
            6,
       );

        console.log("Mint Adress :",mint.toBase58()); // Mint Adress : B76YedPJNTbBut7fjBUn9pTEo93iZUma9HUcCgWiVWTC
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
