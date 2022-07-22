const { defaultAccounts } = require("ethereum-waffle");
const hre = require("hardhat");
const { getNameOfJSDocTypedef } = require("typescript");

async function main() {

    const provider = new hre.ethers.providers.JsonRpcProvider(process.env.POLYGON_MAINNET_RPC_URL)

    const deployer = new hre.ethers.Wallet(process.env.PRIVATE_KEY_DEPLOYER_WALLET, provider);

  console.log("owner account", deployer.address);

  const randomnessAddress = process.env.RANDOMNESS_ADDRESS;
  const trashPossumsAddress = process.env.TRASHPOSSUMS_ADDRESS;

  const trashPossums = await hre.ethers.getContractAt(
    "TrashPossums",
    trashPossumsAddress
  );
  const randomness = await hre.ethers.getContractAt(
    "Randomness",
    randomnessAddress
  );

  const deployerBal = await provider.getBalance(deployer.address);
  console.log("deployer balance", ethers.utils.formatEther(deployerBal));

  const gasEstimate =  await trashPossums.connect(deployer).estimateGas.premintPossums();
  console.log("gas est",  gasEstimate)
  const feeData = await provider.getFeeData();
  const gasCost = feeData.gasPrice.mul(gasEstimate);
  console.log("gas Cost estimate in matic", ethers.utils.formatEther(gasCost));

  const premint = await trashPossums.connect(deployer).premintPossums({gasPrice: 100000000000, gasLimit: 20000000});
  //const randpremint = await randomness.executePremint(80);
  await premint.wait();
  //await randpremint.wait();

  const premintCount = await trashPossums.totalMintedPossums();

  console.log("preminted", premintCount);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
