import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VaultAnchor } from "../target/types/vault_anchor";

describe("vault-anchor", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.VaultAnchor as Program<VaultAnchor>;

  // Derive PDAs
  const vaultState = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("state"), provider.publicKey.toBytes()],
    program.programId
  )[0];

  const vault = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultState.toBytes()],
    program.programId
  )[0];

  // Store listener IDs
  let listenerIds: number[] = [];

  // Add event listeners
  before(() => {
    // Initialize listener
    const initListener = program.addEventListener("initializeEvent", (event, slot, signature) => {
      console.log("Initialize Event:", event, "Slot:", slot, "Signature:", signature);
    });
    listenerIds.push(initListener);

    // Deposit listener
    const depositListener = program.addEventListener("depositEvent", (event, slot, signature) => {
      console.log("Deposit Event:", event, "Slot:", slot, "Signature:", signature);
    });
    listenerIds.push(depositListener);

    // Withdraw listener
    const withdrawListener = program.addEventListener("withdrawEvent", (event, slot, signature) => {
      console.log("Withdraw Event:", event, "Slot:", slot, "Signature:", signature);
    });
    listenerIds.push(withdrawListener);

    // Close listener
    const closeListener = program.addEventListener("closeEvent", (event, slot, signature) => {
      console.log("Close Event:", event, "Slot:", slot, "Signature:", signature);
    });
    listenerIds.push(closeListener);
  });

  it("Is initialized!", async () => {
    const balance = await provider.connection.getBalance(provider.publicKey);
    console.log("Balance is:", balance / anchor.web3.LAMPORTS_PER_SOL);

    const tx = await program.methods
      .initialize()
      .accountsPartial({
        user: provider.wallet.publicKey,
        vaultState,
        vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("\nYour transaction signature", tx);
    console.log("Vault info:", await provider.connection.getAccountInfo(vault));
  });

  it("Deposit 2 SOL", async () => {
    const tx = await program.methods
      .deposit(new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL))
      .accountsPartial({
        user: provider.wallet.publicKey,
        vaultState,
        vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("\nYour transaction signature", tx);
    console.log("Vault info:", await provider.connection.getAccountInfo(vault));
    console.log("Vault Balance:", await provider.connection.getBalance(vault));
  });

  it("Withdraw 1 SOL", async () => {
    const tx = await program.methods
      .withdraw(new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL))
      .accountsPartial({
        user: provider.wallet.publicKey,
        vaultState,
        vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("\nYour transaction signature", tx);
    console.log("Vault info:", await provider.connection.getAccountInfo(vault));
    console.log("Vault Balance:", await provider.connection.getBalance(vault));
  });

  it("Close Vault", async () => {
    const tx = await program.methods
      .close()
      .accountsPartial({
        user: provider.wallet.publicKey,
        vaultState,
        vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("\nYour transaction signature", tx);
    console.log("Vault Balance:", await provider.connection.getBalance(vault));
  });

  // Cleanup listeners
  after(async () => {
    for (const listenerId of listenerIds) {
      await program.removeEventListener(listenerId);
    }
    listenerIds = [];
  });
});