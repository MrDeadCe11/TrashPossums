const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const {
  isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("Trash Possums", function () {
  let owner;
  let addr1;
  let addr2;
  let addresses;
  let provider;
  let trashPossums;
  const testUri =
    "ipfs://bafybeihkoviema7g3gxyt6la7vd5ho32ictqbilu3wnlo3rs7ewhnp7lly/";
  it("should successfully deploy the contract",async function () {
    provider = ethers.getDefaultProvider();
    const TrashPossums = await ethers.getContractFactory("TrashPossums");
    [owner, addr1, addr2, ...addresses] = await ethers.getSigners();
    trashPossums = await TrashPossums.deploy();
    const deployed = await trashPossums.deployed();
     assert(deployed)
  });
  it("should add all possums to the available array", async function(){
   const tx= await trashPossums.addAvailablePossums();
   const availPoss = await trashPossums.getAvailablePossums()
   console.log("addr1 balance",availPoss.toNumber());
   assert(availPoss.toNumber() === 1250);

  })

  it("should mint an nft to the owner address", async function () {
    const tx = await trashPossums.mintPossums(1);
    const promise = await tx.wait();

    assert(promise.events[0].args.to === owner.address);
  });
  

  it("should mint an nft to addr1", async function () {
     const tx = await trashPossums.connect(addr1).mintPossums(1);
    const promise = await tx.wait();
    
    assert(promise.events[0].args.to === addr1.address);
  });

  it("should return the number nfts owned by an address(addr1)", async function () {
    const ownerbal = await trashPossums.balanceOf(owner.address);
    const tx = await trashPossums.balanceOf(addr1.address);
    console.log("addr1 balance",tx.toNumber(), "owner balance", ownerbal.toNumber())
    assert(tx.toNumber() === 1);
  });
  it("should transfer NFT 0 from addr1 to addr2", async function () {
    const tx =await trashPossums.safeTransferFrom(owner.address, addr1.address, 0)
    const promise = await tx.wait();
    
  } )
});
