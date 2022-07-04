const { defaultAccounts } = require("ethereum-waffle");
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("owner account", deployer.address);
  const randomnessAddress = process.env.NEW_RANDOMNESS;
  const trashPossumsAddress = process.env.NEW_TRASH;

  const trashPossums = await hre.ethers.getContractAt(
    "TrashPossums",
    trashPossumsAddress
  );
  const randomness = await hre.ethers.getContractAt(
    "Randomness",
    randomnessAddress
  );

  const premint = await trashPossums.premintPossums();
  const randpremint = await randomness.executePremint(80);
  await premint.wait();
  await randpremint.wait();

  const premintCount = await trashPossums.totalMintedPossums();

  console.log("preminted", premintCount);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
