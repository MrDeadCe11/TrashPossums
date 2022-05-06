import {ethers} from 'ethers'
import contractAbi from "../../../artifacts/contracts/TrashPossums.sol/TrashPossums.json"
import randomAbi from "../../../artifacts/contracts/Randomness.sol/Randomness.json"
import store from "../store/index.js"


// const getContract = () => {
//   const provider = new ethers.providers.Web3Provider(window.ethereum)  
//     signer = provider.getSigner();    
//     signerAddress = signer.getAddress();
//     trashPossumsContract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
// }
let alchemyProvider
const getAlchemyProvider=()=>{
 alchemyProvider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_MUMBAI_RPC_URL)
}

async function getPossumPrice(trashPossumsContract, signerAddress){    
    const possumPrice = await trashPossumsContract.connect(signerAddress).getPossumPrice();
    store.commit("setPossumPrice", ethers.utils.formatEther(possumPrice));
    return possumPrice;    
}

async function reservePossums(number, contract, signerAddress){      
    const possumPrice = await getPossumPrice(contract, signerAddress);
    const sendEth = possumPrice.mul(number);

    const tx = await contract.reservePossums(number, {value: sendEth, gasLimit: 3000000});
    tx.wait()
}

async function claimPossums(trashPossumsContract, signerAddress){  
    console.log("web3 trash claim contract", trashPossumsContract)
    try{
     await trashPossumsContract.claimPossums();

    } catch(error){
        console.log(error.message)   
    }
    await claimedPossums(trashPossumsContract, signerAddress);
    await reservedPossums();  

}

async function getCurrentStamp(){
    getAlchemyProvider();
    const block = await alchemyProvider.getBlock("latest");
    const timeStamp = block.timestamp ;
    store.commit("setCurrentStamp", timeStamp * 1000)
    return timeStamp;
}

async function reservedPossums(trashPossumsContract, signerAddress){
    const reserved = await trashPossumsContract.getReservedPossumsPerWallet(signerAddress);
    store.commit("setReservedPossums", reserved);
    return reserved
}

async function getOffset(randomnessContract){
const offset = await randomnessContract.getOffset();
const claimable = offset > 0? true: false;
store.commit("setClaimable", claimable);
store.commit("setOffset", offset);
return offset
}

async function claimedPossums(trashPossumsContract, signerAddress){
    const claimedPossums = await trashPossumsContract.balanceOf(signerAddress) 
    store.commit("setClaimedPossums", claimedPossums);
    return claimedPossums
}
async function getClaimedPossumsIds(trashPossumsContract, signerAddress){
    const balanceOf = await trashPossumsContract.balanceOf(signerAddress);
    let possIds = [];
    for(let i=0; i<balanceOf; i++){
        const id = await trashPossumsContract.tokenOfOwnerByIndex(signerAddress, i);
        //const formatId = id.toString();
        possIds.push(id);
    }
    store.commit("setClaimedIds", possIds);
    return possIds
}
async function getClaimDate(randomnessContract){
    const claimable = await randomnessContract.getClaimDate();
    const claimDate = claimable * 1000
    store.commit("setClaimDate", claimDate);
    return claimDate;
}



export {reservePossums, reservedPossums, claimedPossums, claimPossums, getClaimDate, getCurrentStamp, getOffset, getClaimedPossumsIds, getPossumPrice}
