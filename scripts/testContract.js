const { defaultAccounts } = require("ethereum-waffle");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const randomAbi = require("../artifacts/contracts/Randomness.sol/Randomness.json");
const trashAbi = require("../artifacts/contracts/TrashPossums.sol/TrashPossums.json");

async function main() {
  const alchmumbai = process.env.ALCHEMY_MUMBAI_RPC_URL
  const provider = new ethers.providers.JsonRpcProvider(alchmumbai)
  const testUri =
    `https://ipfs.io/ipfs/${process.env.IPFSCID}`;
  const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
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


  //const tx = await randomness.setClaimableDate(1656798900);
  
  //const trash = await randomness.getTrash();
  const tx = await trashPossums.setBaseTokenURI(testUri)
  const promise = await tx.wait();
  console.log("promise", promise);
  //const avail = await randomness.getAvailablePossums();
  const offset = await randomness.getOffset();

  const balance = await trashPossums.balanceOf(deployer.address);
  const date = await randomness.getClaimableDate();
  const offsetExectued = await randomness.randomIdOffsetExecuted();
  const uri = await trashPossums.contractURI();
  const totalMintedPossums = await trashPossums.totalMintedPossums();
  const isOwner = await trashPossums.owner();
  

  console.log(
    "TRASH ADDRESS", trashPossums.address,
    "claimed Possums",
    balance,
    "claimable date",
    date,
    "offset",
    offset,
    "uri",
    uri,
    "is owner", isOwner,
    "total minted", totalMintedPossums
  );
  console.log("Offset executed", offsetExectued);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
