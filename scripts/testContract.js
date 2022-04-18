const { defaultAccounts } = require("ethereum-waffle");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const randomAbi = require("../artifacts/contracts/Randomness.sol/Randomness.json")
const trashAbi = require("../artifacts/contracts/TrashPossums.sol/TrashPossums.json")

async function main() {

    const deployer = await hre.ethers.getSigner();
    console.log('owner accounts', deployer.address)
const randomnessAddress = "0x9e10cD823C6836b1123B05953d4BA216e619fb04";
const trashPossumsAddress= "0x24c9B9B9348BB80ec2427D198e47D6fd787a3bEf";

const randomness = new ethers.Contract(
  randomnessAddress,
  randomAbi.abi,
  deployer
);

const trashPossums = new ethers.Contract(trashPossumsAddress, trashAbi.abi, deployer)

//const randomness = await hre.ethers.getContractAt("Randomness", randomnessAddress);

//const tx = await randomness.setTrash(trashPossumsAddress);
//const tx = await randomness.executeOffset()
//await tx.wait();
//console.log(tx)
//await randomness.setTrash(trashPossumsAddress);
//const trash = await randomness.getTrash();
//const avail = await randomness.getClaimableDate();

//const claim = await trashPossums.claimPossums();
//const avail = await randomness.getAvailablePossums();
const balance = await trashPossums.balanceOf(deployer.address);

const ownedIds = await trashPossums.tokenOfOwnerByIndex(deployer.address, balance -2);

const reserved = await trashPossums.getReservedPossumsPerWallet(deployer.address)


// console.log("trash is set to ",trash);
// console.log("climable date",avail)
//console.log("offset executed", execute, executed)
console.log("availible possums", balance, ownedIds, reserved)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });