import bs58 from "bs58";
import promptSync from "prompt-sync";

// Initialize prompt-sync
const prompt = promptSync();

const wallet_to_base58 = () => {
    // Get user input
    const privkey = prompt('Enter your wallet array :  [private key array]\n').trim();

    try {
        const wallet = bs58.encode(Buffer.from(JSON.parse(privkey as string)));
        console.log(`Your base58 encoded private key is :\n ${wallet}`);
    } catch (error) {
        console.error("Failed to encode to Base58:", error);
    };
};

wallet_to_base58();
