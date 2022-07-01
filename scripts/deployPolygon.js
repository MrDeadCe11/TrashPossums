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
  const startMintDate = 1667203200; //8am gmt oct 31 2022
  const possumPrice = hre.ethers.utils.parseEther("100");
  const ipfsURI =
    "https://ipfs.io/ipfs/QmdZS745Y4UL3Ub3oCsrxPjcfXzn2qoeCBNGbTuyHpZ7SK";
  const VRFAddressPolygon = "";
  const LinkTokenPolygon = "";
  const keyHashPolygon =
    "";
  const fee = hre.ethers.utils.parseEther(".001");
  const premintCount = 80;

  const [deployer] = await hre.ethers.getSigners();
  console.log("deploying with account: ", deployer.address);

  const Random = await ethers.getContractFactory("Randomness");
  const randomness = await Random.deploy(
    VRFAddressPolygon,
    LinkTokenPolygon,
    keyHashPolygon,
    fee
  );
  await randomness.deployed();
  console.log("Randomness deployed at", randomness.address);

  const TrashPossums = await hre.ethers.getContractFactory("TrashPossums");
  const trashPossums = await TrashPossums.deploy(
    possumPrice,
    startMintDate,
    ipfsURI,
    randomness.address,
    premintCount
  );

  await trashPossums.deployed();

  console.log("Trash Possums deployed to:", trashPossums.address);

  await randomness.setClaimableDate(startMintDate);
  const setmint = await randomness.getClaimableDate();
  console.log("mint date is set to:", setmint);
  await randomness.setTrash(trashPossums.address);
  saveFrontendFiles(trashPossums);
  saveFrontendFiles(randomness);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../trash-site/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Token");

  fs.writeFileSync(
    contractsDir + "/Token.json",
    JSON.stringify(TokenArtifact, null, 2)
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
