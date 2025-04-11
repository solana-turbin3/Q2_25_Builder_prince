import bs58 from "bs58";
import promptSync from "prompt-sync";

// Initialize prompt-sync
const prompt = promptSync();

const base58ToWallet = async () => {
    // Get user input
    const privkey = prompt(` Enter your base58-encoded private key : \n`).trim();

    try {
        // Decode Base58
        const wallet = bs58.decode(privkey);

        console.log(`Your wallet file is:\n [${wallet}]`);
    } catch (error) {
        console.error("Failed to decode Base58:", error);
    }
};

base58ToWallet();


