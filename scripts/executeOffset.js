const { defaultAccounts } = require("ethereum-waffle");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const randomAbi = require("../artifacts/contracts/Randomness.sol/Randomness.json");


async function main() {

  const deployer = await hre.ethers.getSigner();
  console.log("owner accounts", deployer.address);
  const randomnessAddress = process.env.NEW_RANDOMNESS;


  const randomness = new ethers.Contract(
    randomnessAddress,
    randomAbi.abi,
    deployer
  );


  const tx = await randomness.executeOffset();
  await tx.wait();

  const offset = await randomness.getOffset();

  const offsetExectued = await randomness.offsetExecuted();

  console.log("offset", offset);
  console.log("Offset executed", offsetExectued);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
