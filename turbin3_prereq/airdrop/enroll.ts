import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import wallet from "./dev-wallet.json";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";

const keypair: Keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection: Connection = new Connection("https://api.devnet.solana.com");

const github = Buffer.from("test69", "utf-8");

const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

const program: Program<Turbin3Prereq> = new Program(IDL, provider);

const enrollment_seeds = [Buffer.from("pre"), keypair.publicKey.toBuffer()];

const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
  enrollment_seeds,
  program.programId
);

console.log(`Enrollment Key: ${enrollment_key.toBase58()}`);

(async () => {
  try {
    const txhash = await program.methods
      .submit(github)
      .accounts({ signer: keypair.publicKey })
      .signers([keypair])
      .rpc();
    console.log(`Success! Check out your TX here: \n
            https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (error) {
    console.error(`Oops! Something went wrong: ${error}`);
  }
})();
