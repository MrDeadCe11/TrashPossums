const { defaultAccounts } = require("ethereum-waffle");
const hre = require("hardhat");

async function main() {

    const [deployer] = await hre.ethers.getSigners();
    console.log('owner accounts', deployer.address)
const randomnessAddress = "0x9e10cD823C6836b1123B05953d4BA216e619fb04";
const trashPossumsAddress= "0x24c9B9B9348BB80ec2427D198e47D6fd787a3bEf";

const trashPossums = await hre.ethers.getContractAt("TrashPossums", trashPossumsAddress);
const randomness = await hre.ethers.getContractAt("Randomness", randomnessAddress)

//const tx = await randomness.connect(deployer).setTrash(trashPossumsAddress);
//const tx = await randomness.executeOffset()
//await tx.wait();
//console.log(tx)
const premint = await trashPossums.premintPossums();
const randpremint =  await randomness.executePremint(80);
await premint.wait();
await randpremint.wait();

const premintCount = await trashPossums.getTotalMintedPossums();

console.log("preminted", premintCount)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });