import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../wba-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

        //captain jeff : https://devnet.irys.xyz/69QF7mtD4kEp3fQMRELcNp9GKQs8DGXmWB9cUVCs68fr
        //captain nate : https://devnet.irys.xyz/CxTnpAn3721SAGer5ajvo2sYPGV8NjFsfB9jBbC7qfmc

        // captain nate : https://devnet.irys.xyz/E5TMY9mDsLRQrJ33S1FetXTy1TNGqy7GsbKt2LQkbKA5
        // captain jeff : https://devnet.irys.xyz/5Et6yWKJyLmAwpj8FsCt9SWikg4kWKFU6rUYXh6y81LA
        // captain jessica : https://devnet.irys.xyz/35Fq6bhoFnUZieFpGc1YHiJ38RtGPfQeEyvtJYHk43Mx

(async () => {
    let tx = createNft(umi, {
        mint,
        name: "Turbin3 Pirate - Nate",
        symbol: "TURBIN3",
        uri: "https://devnet.irys.xyz/E5TMY9mDsLRQrJ33S1FetXTy1TNGqy7GsbKt2LQkbKA5",
        sellerFeeBasisPoints: percentAmount(1),
    });

    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);

    // 8AQa4REEsHiiMteusKm15qnpo7FP3UHfjAkMbRWod4UV -> jessica
    // https://explorer.solana.com/address/8AQa4REEsHiiMteusKm15qnpo7FP3UHfjAkMbRWod4UV?cluster=devnet

    // 8rLCUbEpVxiaBMzi5QBXT6ZvzQV9JwkMjmedCt9eHtmP -> jeff -> 
    // https://explorer.solana.com/address/8rLCUbEpVxiaBMzi5QBXT6ZvzQV9JwkMjmedCt9eHtmP?cluster=devnet

    // F98FucCYkCeBa9ZYDNCu1XdwSNrep3SXVyNdagQzVnpV -> nate
    // https://explorer.solana.com/address/F98FucCYkCeBa9ZYDNCu1XdwSNrep3SXVyNdagQzVnpV?cluster=devnet

})();