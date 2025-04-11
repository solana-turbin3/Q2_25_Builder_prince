import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        const img = await readFile("/Users/prince/Project/prince/solana-starter/ts/cluster1/utils/capjessica.png");

        //2. Convert image to generic file.
        const genImg = createGenericFile(img,"JESSICA",{
            contentType: "image/png"
        });
        //3. Upload image

        const [myUri] = await umi.uploader.upload([genImg]);

        console.log("Your image URI: ", myUri);

        // https://devnet.irys.xyz/3NxBaw69FHBVLcxWjdSGsciAfxGo7YQ5f986ZX2tiWjD
        //captain jeff : https://devnet.irys.xyz/69QF7mtD4kEp3fQMRELcNp9GKQs8DGXmWB9cUVCs68fr
        //captain jeff : https://devnet.irys.xyz/CxTnpAn3721SAGer5ajvo2sYPGV8NjFsfB9jBbC7qfmc
        //captain jessica : https://devnet.irys.xyz/GfMjRVmCyaRkwMdfZkeooC7cGuHBEjGuJrKynTqdxKeu

        // https://arweave.net/3NxBaw69FHBVLcxWjdSGsciAfxGo7YQ5f986ZX2tiWjD
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
