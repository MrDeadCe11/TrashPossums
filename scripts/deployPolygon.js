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

  //declare variables

  const startMintDate = 1667203200; //8am gmt oct 31 2022
  const possumPrice = hre.ethers.utils.parseEther("50");
  const ipfsURI =
    `https://ipfs.io/ipfs/${process.env.IPFSCID}`;
  const VRFAddressPolygon = "0xae975071be8f8ee67addbc1a82488f1c24858067";
  const LinkTokenPolygon = "0xb0897686c545045afc77cf20ec7a532e3120e0f1";
  const keyHashPolygon = "0xd729dc84e21ae57ffb6be0053bf2b0668aa2aaf300a2a7b2ddf7dc0bb6e875a8";
  const CLSubscriptionId = 147;
  const premintCount = 80;
  let trashPossums, randomness;

  // begin deployment   

  const [deployer] = await hre.ethers.getSigner(process.env.PRIVATE_KEY_DEPLOYER_WALLET);

      console.log("deploying with account: ", deployer.address);

    //check if necessary info has been entered

    if(VRFAddressPolygon.length !== 0 && LinkTokenPolygon.length !== 0 && keyHashPolygon.length !== 0 & CLSubscriptionId !== 0 && ipfsURI){
      
        const Random = await ethers.getContractFactory("Randomness");

        randomness = await Random.deploy(
          VRFAddressPolygon,
          CLSubscriptionId,
          LinkTokenPolygon,
          keyHashPolygon
        );
        await randomness.deployed();
          console.log("Randomness deployed at", randomness.address);
    } else {
      throw Error("Randomness was not deployed")
    }
  
    //check if ipfs address has been entered

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
    } else {
      throw Error("Trash Possums were not deployed")
    }

    //check for correct deployment

    if(trashPossums && randomness){
      //set start mint date in randomness
        await randomness.setClaimableDate(startMintDate);
        //check that date was set
        const setMint = await randomness.getClaimableDate();

          console.log("mint date is set to:", setMint);
          //set trash possums address in randomness for security checks
        await randomness.setTrash(trashPossums.address);
        //check that address has been set
        const setTrash = await randomness.getTrash()

        //save addresses in front end
        saveFrontendFiles("TrashPossums",trashPossums);
        saveFrontendFiles("Randomness",randomness);
    } else {
      //throw error if contracts were not deployed

      throw Error("Contracts were not successfully deployed.")
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
