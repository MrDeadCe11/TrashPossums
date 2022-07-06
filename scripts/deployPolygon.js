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
  const possumPrice = hre.ethers.utils.parseEther("50");
  const ipfsURI = "";
  const VRFAddressPolygon = "";
  const LinkTokenPolygon = "";
  const keyHashPolygon = "";
  const CLSubscriptionId = 0;
  const premintCount = 80;
  let trashPossums, randomness
  const [deployer] = await hre.ethers.getSigners();

      console.log("deploying with account: ", deployer.address);

    if(VRFAddressPolygon.length !== 0 && LinkTokenPolygon.length !== 0 && keyHashPolygon.length !== 0 & CLSubscriptionId !== 0){
        const Random = await ethers.getContractFactory("Randomness");
        randomness = await Random.deploy(
          VRFAddressPolygon,
          CLSubscriptionId,
          LinkTokenPolygon,
          keyHashPolygon
        );
        await randomness.deployed();
          console.log("Randomness deployed at", randomness.address);
    }
  

    if(ipfsURI.length !== 0){

        const TrashPossums = await hre.ethers.getContractFactory("TrashPossums");
        trashPossums = await TrashPossums.deploy(
          possumPrice,
          startMintDate,
          ipfsURI,
          randomness.address,
          premintCount
        );
      

      await trashPossums.deployed();

        console.log("Trash Possums deployed to:", trashPossums.address);
    }

    if(trashPossums && randomness){
        await randomness.setClaimableDate(startMintDate);
        const setMint = await randomness.getClaimableDate();
          console.log("mint date is set to:", setMint);
        await randomness.setTrash(trashPossums.address);
        saveFrontendFiles("TrashPossums",trashPossums);
        saveFrontendFiles("Randomness",randomness);
    } else {
      throw new Error("Contracts were not deployed.")
    }
}

function saveFrontendFiles(name, file) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../trash-site/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ name: file.address }, undefined, 2)
  );

  const ContractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + "/Contract.json",
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
