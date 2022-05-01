import store from '../store/index'
import {ethers} from 'ethers'
import contractAbi from "../../../artifacts/contracts/TrashPossums.sol/TrashPossums.json"
import randomAbi from "../../../artifacts/contracts/Randomness.sol/Randomness.json"

const contractAddress = store.state.contractAddress;
const randomnessAddress = store.state.randomnessAddress;
let trashPossumsContract, provider, signer, signerAddress, alchemyProvider, alchemySigner, rpcContract, randomnessContract


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
    randomnessContract = new ethers.Contract(randomnessAddress, randomAbi.abi, signer)
}

async function getPossumPrice(){
    const possumPrice = await trashPossumsContract.connect(signer).getPossumPrice();
    store.commit("setPossumPrice", ethers.utils.formatEther(possumPrice));
    return possumPrice;    
}

async function reservePossums(number){      
    getContract();
    const possumPrice = await getPossumPrice();
    const sendEth = possumPrice.mul(number);

    const tx = await trashPossumsContract.reservePossums(number, {value: sendEth, gasLimit: 3000000});
    tx.wait()
}

async function claimPossums(){  
    try{
     await trashPossumsContract.claimPossums();

    } catch(error){
        console.log(error.data.message)   
    }
    await claimedPossums();
    await reservedPossums();  

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

async function getOffset(){
getAlchemyProvider();
const offset = await randomnessContract.getOffset();
const claimable = offset > 0? true: false;
store.commit("setClaimable", claimable);
store.commit("setOffset", offset);
return offset
}

async function claimedPossums(){
    getContract();
    const claimedPossums = await trashPossumsContract.balanceOf(signerAddress) 
    store.commit("setClaimedPossums", claimedPossums);
    return claimedPossums
}
async function getClaimedPossumsIds(){
    getContract();
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
async function getClaimDate(){
    getAlchemyProvider()
    const claimable = await rpcContract.getClaimDate();
    const claimDate = claimable * 1000
    store.commit("setClaimDate", claimDate);
    return claimDate;
}



export {reservePossums, reservedPossums, claimedPossums, claimPossums, getClaimDate, getCurrentStamp, getOffset, getClaimedPossumsIds, getPossumPrice}
