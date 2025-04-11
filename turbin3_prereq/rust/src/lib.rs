mod programs;
#[cfg(test)]
mod test {
    use bs58;
    use solana_client::{nonblocking::rpc_client, rpc_client::RpcClient};
    use solana_program::{hash::hash, pubkey::Pubkey, system_instruction::transfer};
    use solana_sdk::{
        message::Message,
        signature::{read_keypair_file, Keypair, Signer},
        system_program,
        transaction::{self, Transaction},
    };
    use std::io::{self, BufRead};
    use std::str::FromStr;
    use crate::programs::Turbin3_prereq::{Turbin3PrereqProgram, CompleteArgs,UpdateArgs};

    const RPC_URL: &str = "https://api.devnet.solana.com";


    #[test]
    fn enroll(){
        let rpc_client = RpcClient::new(RPC_URL);
        let signer = read_keypair_file("turbin3-wallet.json").expect("Coudn't find wallet file");
        let prereq = Turbin3PrereqProgram::derive_program_address(&[b"prereq",signer.pubkey().to_bytes().as_ref()]);

        let args = CompleteArgs {github:  b"prince981620".to_vec()};

        let blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        let transaction = Turbin3PrereqProgram::complete(
            &[&signer.pubkey(),&prereq,&system_program::id()],&args,Some(&signer.pubkey()),&[&signer],blockhash);
        let signature = rpc_client.send_and_confirm_transaction(&transaction).expect("Failed to send transaction");
        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );



    }

    #[test]
    fn keygen() {
        let kp = Keypair::new();
        println!(
            "You've generated a new solana wallet: {}",
            kp.pubkey().to_string()
        );
        println!("");
        println!("To save your wallet, copy and paste the following into a JSON file:");
        print!("{:?}", kp.to_bytes());
    }
    #[test]
    fn airdrop() {
        let keypair = read_keypair_file("dev_wallet.json").expect("Coudn't find wallet file");
        let client = RpcClient::new(RPC_URL);
        match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {
            Ok(s) => {
                println! {"Success! check your Tx here:"};
                println! {"https://explorer.solana.com/tx/{}?cluster=devnet",s.to_string()};
            }
            Err(e) => println!("Oops, something went wrong :{}", e.to_string()),
        };
    }
    #[test]
    fn transfer_sol() {
        let keypair = read_keypair_file("dev_wallet.json").expect("Coudn't find wallet file");
        let pubkey = keypair.pubkey();
        let message_bytes = b"I verify my solana Keypair";
        let sig = keypair.sign_message(message_bytes);
        let sig_hashed = hash(sig.as_ref());

        match sig.verify(&pubkey.to_bytes(), &sig_hashed.to_bytes()) {
            true => println!("Signature verified"),
            false => println!("Signature not verified"),
        }

        let to_pubkey = Pubkey::from_str("7MBcR9GQs94CWwL2SwzgSuhTa8guzb1dAVTDPCpnFzr9").unwrap();

        let rpc_client = RpcClient::new(RPC_URL);

        let recent_blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Falied to get recent blockhash");

        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &to_pubkey, 1_000_000)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }

    #[test]
    fn empty_wallet() {
        let keypair = read_keypair_file("dev_wallet.json").expect("Coudn't find wallet file");
        let rpc_client = RpcClient::new(RPC_URL);
        let balance = rpc_client.get_balance(&keypair.pubkey()).expect("Failed to get balance");
        let to_pubkey = Pubkey::from_str("7MBcR9GQs94CWwL2SwzgSuhTa8guzb1dAVTDPCpnFzr9").unwrap();

        let recent_blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Falied to get recent blockhash");
        //  create a test tx to calculate fee

        let message = Message::new_with_blockhash(&[transfer(&keypair.pubkey(),&to_pubkey, balance)], Some(&keypair.pubkey()), &recent_blockhash);

        let fee = rpc_client.get_fee_for_message(&message).expect("Failed to get fee");

        let transaction = Transaction::new_signed_with_payer(&[transfer(&keypair.pubkey(), &to_pubkey, balance-fee)], Some(&keypair.pubkey()), &vec![&keypair], recent_blockhash);

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }

    #[test]
    fn bs58_to_wallet() {
        println!("input your private key as base58:");
        let stdin = io::stdin();
        let base58 = stdin.lock().lines().next().unwrap().unwrap();
        println!("Your wallet file is:");
        let wallet = bs58::decode(base58).into_vec().unwrap();
        println!("{:?}", wallet);
    }

    #[test]
    fn wallet_to_bs58() {
        println!("Input your private key as wallet file byte array:");
        let stdin = io::stdin();

        let wallet = stdin
            .lock()
            .lines()
            .next()
            .unwrap()
            .unwrap()
            .trim_start_matches('[')
            .trim_end_matches(']')
            .split(',')
            .map(|s| s.trim().parse::<u8>().unwrap())
            .collect::<Vec<u8>>();
        println!("Your base58 private key is:");
        let base58 = bs58::encode(wallet).into_string();
        println!("{:?}", base58);
    }
}
