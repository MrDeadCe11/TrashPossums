const { defaultAccounts } = require("ethereum-waffle");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const randomAbi = require("../artifacts/contracts/Randomness.sol/Randomness.json");
const trashAbi = require("../artifacts/contracts/TrashPossums.sol/TrashPossums.json");

async function main() {
  const deployer = await hre.ethers.getSigner();
  console.log("owner accounts", deployer.address);
  const randomnessAddress = process.env.NEW_RANDOMNESS;
  const trashPossumsAddress = process.env.NEW_TRASH;
  const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_MUMBAI_RPC_URL);

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
    const feeData = await provider.getFeeData()
    console.log(feeData)
  //const randomness = await hre.ethers.getContractAt("Randomness", randomnessAddress);
  //   const txcount = await provider.getTransactionCount(trashPossums.address);
  // const poptx = await trashPossums.populateTransaction.withdraw();
  
  const tx = await trashPossums.connect(deployer).withdraw();
  const promise = await tx.wait()
  
  console.log(promise);
  const balance = await provider.getBalance(trashPossumsAddress);

  console.log("balance", balance, txcount);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
