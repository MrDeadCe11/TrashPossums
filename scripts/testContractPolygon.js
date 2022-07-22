const { defaultAccounts } = require("ethereum-waffle");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const randomAbi = require("../artifacts/contracts/Randomness.sol/Randomness.json");
const trashAbi = require("../artifacts/contracts/TrashPossums.sol/TrashPossums.json");

async function main() {

  const startMintDate = 1667203200; //8am gmt oct 31 2022
  const IPFSCID = `ipfs:/ /${process.env.IPFSCID}/`;
  const randomnessAddress = process.env.RANDOMNESS_ADDRESS;
  const trashPossumsAddress = process.env.TRASHPOSSUMS_ADDRESS;

    const provider = new hre.ethers.providers.JsonRpcProvider(process.env.POLYGON_MAINNET_RPC_URL)

    const deployer = new hre.ethers.Wallet(process.env.PRIVATE_KEY_DEPLOYER_WALLET, provider);
 

  
  console.log("owner accounts", deployer.address);


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
  const testUri =
  `ipfs://${process.env.IPFSCID}/`;
  const possumPrice = hre.ethers.utils.parseEther("20");

  // try{
  //   await randomness.setClaimableDate(startMintDate, {gasPrice: 150000000000});
  //   //check that date was set
  //   const setMint = await randomness.getClaimableDate();

  //   console.log("mint date is set to:", setMint);
  //   } catch(err){
  //     console.log(err)
  //   }
  //   try{
  //   //set trash possums address in randomness for security checks
  //   await randomness.setTrash(trashPossums.address, {gasPrice: 150000000000});
  //   //check that address has been set
  //   const setTrash = await randomness.getTrash();
  //     console.log("trash set");
  //   } catch (err){
  //     console.log(err)
  //   }

  //const tx = await randomness.setClaimableDate(1656798900);

  //await trashPossums.setPossumPrice(possumPrice, {gasPrice: 100000000000});
  const possPrice = await trashPossums.possumPrice()
  //const trash = await randomness.getTrash();
 //const tx = await trashPossums.setBaseTokenURI(testUri, {gasPrice: 100000000000})
  //const promise = await tx.wait();
  //console.log("promise", promise);
  //const avail = await randomness.getAvailablePossums();
  const offset = await randomness.getOffset();
  const tokenURI = await trashPossums.tokenURI(1);

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
    "total minted", totalMintedPossums,
    "token URI", tokenURI,
    "possum price", possPrice
  );
  console.log("Offset executed", offsetExectued);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
