// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
    const startMintDate = 1642282339; //approx noon on feb 20th 2022
    const possumPrice = hre.ethers.utils.parseEther(".02");
    const testUri =
    `https://ipfs.io/ipfs/${process.env.IPFSCID}`; //"https://ipfs.io/ipfs/QmRjiC7G633t2jDGmBk9awN6PPSfYo7T7B2dLFoGUQEHGg";
    console.log(testUri)
    const VRFAddressMumbai = "0x7a1bac17ccc5b313516c5e16fb24f7659aa5ebed";
    const LinkTokenMumbai = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
    const keyHashMumbai =
      "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f";
    const CLSubscriptionId = 935;
    const fee = hre.ethers.utils.parseEther(".001");
    const premintCount = 80;

  const [deployer] = await hre.ethers.getSigners();

    console.log("deploying with account: ", deployer.address); 

  const Random = await ethers.getContractFactory("Randomness");
  randomness = await Random.deploy(
    VRFAddressMumbai,
    CLSubscriptionId,
    LinkTokenMumbai,
    keyHashMumbai
  );

  await randomness.deployed();

    console.log("Randomness deployed at", randomness.address);

  const TrashPossums = await ethers.getContractFactory("TrashPossums");

  const trashPossums = await TrashPossums.deploy(
    possumPrice,
    testUri,
    randomness.address,
    premintCount
  );

  await trashPossums.deployed();

    console.log("Trash Possums deployed to:", trashPossums.address);

  await randomness.setClaimableDate(startMintDate);

  const setMint = await randomness.getClaimableDate();
    console.log("mint date is set to:", setMint);

  await randomness.setTrash(trashPossums.address);

  saveFrontendFiles("TrashPossums", trashPossums);
  saveFrontendFiles("Randomness", randomness);
}

function saveFrontendFiles(name, file) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../trash-site/src/contracts/test";
  const content = {
    name: name,
    address: file.address} ;

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify(content, undefined, 2)
  );

  const ContractArtifact = artifacts.readArtifactSync(content.address);

  fs.writeFileSync(
    contractsDir + "/ContractABI.json",
    JSON.stringify(ContractArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
