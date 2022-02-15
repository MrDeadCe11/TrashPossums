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
  const testUri = "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu";
  const VRFAddressMumbai = "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255";
  const LinkTokenMumbai = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
  const keyHashMumbai = "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4";
  const fee = hre.ethers.utils.parseEther(".001");


 const [deployer] = await hre.ethers.getSigners();
 console.log('deployiing with account: ',deployer.address)
 
 const TrashPossums = await hre.ethers.getContractFactory("TrashPossums");
  const trashPossums = await TrashPossums.deploy(possumPrice, startMintDate, testUri, VRFAddressMumbai, LinkTokenMumbai, keyHashMumbai, fee, startMintDate);

  await trashPossums.deployed();

  console.log("Trash Possums deployed to:", trashPossums.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
