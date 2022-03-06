const { defaultAccounts } = require("ethereum-waffle");
const hre = require("hardhat");

async function main() {

    const [deployer] = await hre.ethers.getSigners();
    console.log('owner accounts', deployer.address)
const randomnessAddress = "0xeF7cDb73e19e9C2ecbd3CE9dC3e8cfE9BaDFbeDA";
const trashPossumsAddress= "0xCC9B0137d3A2D2248912895e85341d29772F4888";

const randomness = await hre.ethers.getContractAt("Randomness", randomnessAddress);

//const tx = await randomness.connect(deployer).setTrash(trashPossumsAddress);
//const tx = await randomness.executeOffset()
//await tx.wait();
//console.log(tx)
const trash = await randomness.getOffset();

console.log("offset is set to: ",trash);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });