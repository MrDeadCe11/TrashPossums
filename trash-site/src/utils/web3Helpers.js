import store from '../store/index'
import {ethers} from 'ethers'
import contractAbi from "../../../artifacts/contracts/TrashPossums.sol/TrashPossums.json"

const contractAddress = store.state.contractAddress;
let trashPossumsContract, provider, signer, signerAddress, alchemyProvider, alchemySigner, rpcContract


const getContract = () => {
    provider = new ethers.providers.Web3Provider(window.ethereum)
    signer = provider.getSigner();    
    signerAddress = signer.getAddress();
    trashPossumsContract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
}

const getAlchemyProvider=()=>{
    alchemyProvider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_MUMBAI_RPC_URL)
    alchemySigner = alchemyProvider.getSigner();
    rpcContract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
}

async function reservePossums(number){      
    getContract();
    const possumPrice = await trashPossumsContract.connect(signer).getPossumPrice();
    const tx = await trashPossumsContract.reservePossums(number, {value: possumPrice, gasLimit: 3000000});
    tx.wait()
}
async function claimPossums(){
    getContract();
     const tx = await trashPossumsContract.claimPossums();
     const promise = tx.wait()
     await claimedPossums();
     return promise;

}

async function getCurrentStamp(){
    getAlchemyProvider();
    const block = await alchemyProvider.getBlock("latest");
    const timeStamp = block.timestamp ;
    store.commit("setCurrentStamp", timeStamp * 1000)
    return timeStamp;
}
async function reservedPossums(){
    getContract();
    const reserved = await trashPossumsContract.getReservedPossumsPerWallet(signerAddress);
    store.commit("setReservedPossums", reserved);
    return reserved
}

async function claimedPossums(){
    getContract();
    const claimedPossums = await trashPossumsContract.balanceOf(signerAddress) 
    store.commit("setClaimedPossums", claimedPossums);
    return claimedPossums
}

async function getClaimDate(){
    getAlchemyProvider()
    const claimable = await rpcContract.getClaimDate();
    const claimDate = claimable * 1000
    store.commit("setClaimDate", claimDate);
    return claimDate;
}



export {reservePossums, reservedPossums, claimedPossums, claimPossums, getClaimDate, getCurrentStamp}

    /**const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const etherInterface = new ethers.utils.Interface(contract.abi);
// Get latest nonce
const nonce = await provider.getTransactionCount(PUBLIC_KEY, "latest");
// Get gas price
const gasPrice = await provider.getGasPrice();
// Get network
const network = await provider.getNetwork();
const { chainId } = network;
//Transaction object
const transaction = {
   from: PUBLIC_KEY,
   to: CONTRACT_ADDRESS,
   nonce,
   chainId,
   gasPrice,
   data: etherInterface.encodeFunctionData("mintNFT", 
         [ PUBLIC_KEY, tokenURI ])
};
//Estimate gas limit
const estimatedGas = await provider.estimateGas(transaction);
transaction["gasLimit"] = estimatedGas;
//Sign & Send transaction
const signedTx = await wallet.signTransaction(transaction);
const transactionReceipt = await provider.sendTransaction(signedTx);
await transactionReceipt.wait();
const hash = transactionReceipt.hash;
console.log("Your Transaction Hash is:", hash);
// Get transaction receipt
const receipt = await provider.getTransactionReceipt(hash);
const { logs } = receipt;
// Get token ID
const tokenInBigNumber = ethers.BigNumber.from(logs[0].topics[3]);
const tokenId = tokenInBigNumber.toNumber();
console.log("Token ID minted:", tokenId);*/