const { Connection, clusterApiUrl, Keypair, PublicKey, Transaction} = require('@solana/web3.js')
const { TOKEN_2022_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction,createTransferInstruction  } = require('@solana/spl-token')

const mintToken = async (connection, mintAuthority, tokenMint, destinationWallet, amount) => {
  console.log(TOKEN_2022_PROGRAM_ID)
  const destTokenAccount = await getAssociatedTokenAddress(tokenMint, destinationWallet, true, TOKEN_2022_PROGRAM_ID);
  const accountInfo = await connection.getAccountInfo(destTokenAccount)
  const tx = new Transaction()
  if (!accountInfo) {
    tx.add(createAssociatedTokenAccountInstruction(mintAuthority.publicKey, destTokenAccount, destinationWallet, tokenMint, TOKEN_2022_PROGRAM_ID))
  }
  tx.add(createMintToInstruction(tokenMint, destTokenAccount, mintAuthority.publicKey, amount, [], TOKEN_2022_PROGRAM_ID))
  const signature = await connection.sendTransaction(tx, [mintAuthority])
  await connection.confirmTransaction(signature, 'confirmed')
  return signature
}

const mintSPLToken = async (destinationWalletAddress, tokenMintString, bosSecret) => {
  const destinationWallet = new PublicKey(destinationWalletAddress)
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
  const tokenMint = new PublicKey(tokenMintString)
  const bosSecretKey = Uint8Array.from(bosSecret)
  const mintAuthority = Keypair.fromSecretKey(bosSecretKey)
  const amount = 10 * 1000000000
  return await mintToken(connection, mintAuthority, tokenMint, destinationWallet, amount)
}

const transferToken = async (connection, senderWallet, tokenMint, destinationWallet, amount) => {
  const senderTokenAccount = await getAssociatedTokenAddress(tokenMint, senderWallet.publicKey, true, TOKEN_2022_PROGRAM_ID);
  const destTokenAccount = await getAssociatedTokenAddress(tokenMint, destinationWallet, true, TOKEN_2022_PROGRAM_ID);
  
  const accountInfo = await connection.getAccountInfo(destTokenAccount);
  const tx = new Transaction();
  if (!accountInfo) {
    tx.add(createAssociatedTokenAccountInstruction(senderWallet.publicKey, destTokenAccount, destinationWallet, tokenMint, TOKEN_2022_PROGRAM_ID));
  }
  tx.add(createTransferInstruction(senderTokenAccount, destTokenAccount, senderWallet.publicKey, amount, [], TOKEN_2022_PROGRAM_ID));
  
  const signature = await connection.sendTransaction(tx, [senderWallet]);
  await connection.confirmTransaction(signature, 'confirmed');
  return signature;
};

const transferSPLToken = async (destinationWalletAddress, tokenMintString, bosSecret) => {
  const destinationWallet = new PublicKey(destinationWalletAddress);
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const tokenMint = new PublicKey(tokenMintString);
  const bosSecretKey = Uint8Array.from(bosSecret)
  const bosKeeperWallet = Keypair.fromSecretKey(bosSecretKey);
  const amount = 10 * 1000000000; 
  return await transferToken(connection, bosKeeperWallet, tokenMint, destinationWallet, amount);
};

const checkMySPLBalance = async (connection, tokenMint, destinationWallet) => {
  const destTokenAccount = await getAssociatedTokenAddress(tokenMint, destinationWallet, true, TOKEN_2022_PROGRAM_ID);
  
  const accountInfo = await connection.getAccountInfo(destTokenAccount);
  if(!accountInfo){
    return 0;
  }
  const tokenBalance = await connection.getTokenAccountBalance(destTokenAccount);
  return tokenBalance;
};

const checkMyBalance = async (destinationWalletAddress, tokenMintString) => {
  try{
    const destinationWallet = new PublicKey(destinationWalletAddress);
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const tokenMint = new PublicKey(tokenMintString);
    return await checkMySPLBalance(connection, tokenMint, destinationWallet);
  }
  catch(error){
    console.log(error)
    return 0;
  }
};

module.exports = { mintSPLToken, transferSPLToken, checkMyBalance};
