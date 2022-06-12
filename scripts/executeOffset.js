const { defaultAccounts } = require("ethereum-waffle");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const randomAbi = require("../artifacts/contracts/Randomness.sol/Randomness.json");
const trashAbi = require("../artifacts/contracts/TrashPossums.sol/TrashPossums.json");

async function main() {
  const testUri =
    "https://ipfs.io/ipfs/QmdZS745Y4UL3Ub3oCsrxPjcfXzn2qoeCBNGbTuyHpZ7SK";
  const deployer = await hre.ethers.getSigner();
  console.log("owner accounts", deployer.address);
  const randomnessAddress = process.env.RANDOMNESS_ADDRESS;
  const trashPossumsAddress = process.env.TRASHPOSSUMS_ADDRESS;

  const randomness = new ethers.Contract(
    randomnessAddress,
    randomAbi.abi,
    deployer
  );

  const trashPossums = new ethers.Contract(
    trashPossumsAddress,
    trashAbi.abi,
    deployer
  );

  //const randomness = await hre.ethers.getContractAt("Randomness", randomnessAddress);

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
