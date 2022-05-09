import {ethers} from 'ethers'
import store from "../store/index.js"

async function getPossumPrice(trashPossumsContract, signerAddress){    
    try{
        const possumPrice = await trashPossumsContract.connect(signerAddress).getPossumPrice();
        store.commit("setPossumPrice", ethers.utils.formatEther(possumPrice));
        return possumPrice;    
    }catch(err){
        console.error(err);
    }
}

async function reservePossums(number, contract, signerAddress){    
    try{  
        const possumPrice = await getPossumPrice(contract, signerAddress);
        const sendEth = possumPrice.mul(number);
        const tx = await contract.reservePossums(number, {value: sendEth, gasLimit: 3000000});
        tx.wait();
    } catch(err){
        console.error(err);
    }
}

async function claimPossums(trashPossumsContract, signerAddress){    
    try{
        await trashPossumsContract.claimPossums();

    } catch(error){
        console.log(error.message);   
    }
    await claimedPossums(trashPossumsContract, signerAddress);
    await reservedPossums(trashPossumsContract, signerAddress);  

}

async function getBaseUri(contract){
    try{
        const uri = await contract.contractURI();
        store.commit('setBaseURI', uri);
        return uri;
    } catch(err){
        console.error(err);
    }
}

async function getCurrentStamp(provider){
    try{
        const block = await provider.getBlock("latest");
        const timeStamp = block.timestamp ;
        store.commit("setCurrentStamp", timeStamp * 1000);
        return timeStamp;
    } catch(err){
        console.error(err);
    }
}

async function reservedPossums(trashPossumsContract, signerAddress){
    try{
        const reserved = await trashPossumsContract.getReservedPossumsPerWallet(signerAddress);
        store.commit("setReservedPossums", reserved);
        return reserved;
    } catch(err){
        console.error(err);
    }
}

async function getOffset(randomnessContract){
    try{
        const offset = await randomnessContract.getOffset();
        const claimable = offset > 0 ? true: false;
        store.commit("setClaimable", claimable);
        store.commit("setOffset", offset);
        return offset;
    } catch(err){
        console.error(err);
    }
}

async function claimedPossums(trashPossumsContract, signerAddress){
    try{
        const claimedPossums = await trashPossumsContract.balanceOf(signerAddress) 
        store.commit("setClaimedPossums", claimedPossums);
        return claimedPossums;
    }catch(err){
        console.error(err);
    }
}

async function getClaimedPossumsIds(trashPossumsContract, signerAddress){
    try{
        const balanceOf = await trashPossumsContract.balanceOf(signerAddress);
        let possIds = [];
        for(let i=0; i<balanceOf; i++){
            const id = await trashPossumsContract.tokenOfOwnerByIndex(signerAddress, i);
            possIds.push(id);
        }
        store.commit("setClaimedIds", possIds);
        return possIds;
    }catch(err){
        console.error(err);
    }
}

async function getClaimDate(randomnessContract){
    try{
        const claim = await randomnessContract.getClaimableDate();
        const claimDate = claim * 1000;
        store.commit("setClaimDate", claimDate);
        return claimDate;
    } catch(err){
        console.error(err);
    }
}



export {reservePossums, reservedPossums, claimedPossums, claimPossums, getClaimDate, getCurrentStamp, getOffset, getClaimedPossumsIds, getPossumPrice, getBaseUri}
