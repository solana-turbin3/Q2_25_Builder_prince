import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://devnet.irys.xyz/GfMjRVmCyaRkwMdfZkeooC7cGuHBEjGuJrKynTqdxKeu";
        //captain jeff : https://devnet.irys.xyz/69QF7mtD4kEp3fQMRELcNp9GKQs8DGXmWB9cUVCs68fr
        //captain nate : https://devnet.irys.xyz/CxTnpAn3721SAGer5ajvo2sYPGV8NjFsfB9jBbC7qfmc

        // const metadata = {
        //     name: "?",
        //     symbol: "?",
        //     description: "?",
        //     image: "?",
        //     attributes: [
        //         {trait_type: '?', value: '?'}
        //     ],
        //     properties: {
        //         files: [
        //             {
        //                 type: "image/png",
        //                 uri: "?"
        //             },
        //         ]
        //     },
        //     creators: []
        // };


        const metadata = {
          name: "Turbin3 Pirate - Jessica",
          symbol: "TURBIN3",
          description: "A cunning pirate known for her mastery of Walrus magic. She navigates the seas of Turbin3 with unmatched expertise and a mysterious aura.",
          image: image,
          external_url: "https://turbin3.com/",
          seller_fee_basis_points: 500,
          attributes: [
            {
              trait_type: "Faction",
              value: "Turbin3 Pirates"
            },
            {
              trait_type: "Hat",
              value: "Pirate Hat"
            },
            {
              trait_type: "Expression",
              value: "Mysterious"
            },
            {
              trait_type: "Specialty",
              value: "Walrus Magic"
            },
            {
              trait_type: "Treasure",
              value: "Ancient Scrolls"
            },
            {
              trait_type: "Background",
              value: "Turbin3 Hideout"
            }
          ],
          properties: {
            files: [
              {
                type: "image/png",
                uri: image
              }
            ],
            category: "image",
            collection: {
              name: "Turbin3 Pirates",
              family: "TURBIN3"
            },
            creators: [
              {
                address: keypair.publicKey,
                share: 100
              }
            ]
          }
        }
        

        // const metadata = {
        //     name: "Turbin3 Pirate - Jeff",
        //     symbol: "TURBIN3",
        //     description: "A notorious pirate who crushed the UMI Framework with an iron fist. His coding prowess is legendary—sail carefully!",
        //     image,
        //     external_url: "https://turbin3.com/",
        //     seller_fee_basis_points: 500,
        //     attributes: [
        //       {
        //         trait_type: "Faction",
        //         value: "Turbin3 Pirates"
        //       },
        //       {
        //         trait_type: "Hat",
        //         value: "Tricorn Hat"
        //       },
        //       {
        //         trait_type: "Expression",
        //         value: "Smirking"
        //       },
        //       {
        //         trait_type: "Beard",
        //         value: "Full Beard"
        //       },
        //       {
        //         trait_type: "Treasure",
        //         value: "Secret Blueprints"
        //       },
        //       {
        //         trait_type: "Background",
        //         value: "Stormy Ocean"
        //       }
        //     ],
        //     properties: {
        //       files: [
        //         {
        //           type: "image/png",
        //           uri: image
        //         }
        //       ],
        //       category: "image",
        //       collection: {
        //         name: "Turbin3 Pirates",
        //         family: "TURBIN3"
        //       },
        //       creators: [
        //         {
        //           address: keypair.publicKey,
        //           share: 100
        //         }
        //       ]
        //     }
        //   };
          

        // const metadata = {
        //     name: "Turbin3 Pirate - Nate",
        //     symbol: "TURBIN3",
        //     description: "Wanted for stealing and hoarding capstone ideas. Last seen with the Turbin3 Pirates.",
        //     image,
        //     external_url: "https://turbin3.com/",
        //     seller_fee_basis_points: 500,
        //     attributes: [
        //       {
        //         trait_type: "Faction",
        //         value: "Turbin3 Pirates"
        //       },
        //       {
        //         trait_type: "Hat",
        //         value: "Pirate Hat"
        //       },
        //       {
        //         trait_type: "Expression",
        //         value: "Cheerful"
        //       },
        //       {
        //         trait_type: "Beard",
        //         value: "Light Stubble"
        //       },
        //       {
        //         trait_type: "Treasure",
        //         value: "Capstone Ideas"
        //       },
        //       {
        //         trait_type: "Background",
        //         value: "Turbin3 Hideout"
        //       }
        //     ],
        //     properties: {
        //       files: [
        //         {
        //           type: "image/png",
        //           uri: image
        //         }
        //       ],
        //       category: "image",
        //       collection: {
        //         name: "Turbin3 Pirates",
        //         family: "TURBIN3"
        //       },
        //       creators: [
        //         {
        //           address: keypair.publicKey,
        //           share: 100
        //         }
        //       ]
        //     }
        //   };          
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
         
        // nate : https://devnet.irys.xyz/E5TMY9mDsLRQrJ33S1FetXTy1TNGqy7GsbKt2LQkbKA5
        // jeff : https://devnet.irys.xyz/5Et6yWKJyLmAwpj8FsCt9SWikg4kWKFU6rUYXh6y81LA
        // Jessica : https://devnet.irys.xyz/35Fq6bhoFnUZieFpGc1YHiJ38RtGPfQeEyvtJYHk43Mx

    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
