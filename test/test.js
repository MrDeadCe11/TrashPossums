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
  let tokenId1;
  let tokenId2;
  let trashPossums;

  const testUri =
    "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu";
 
    before ("should successfully deploy the contract",async function () {
    provider = ethers.getDefaultProvider();
    const TrashPossums = await ethers.getContractFactory("TrashPossums");
    [owner, addr1, addr2, ...addresses] = await ethers.getSigners();
    trashPossums = await TrashPossums.deploy();
    const deployed = await trashPossums.deployed();
    assert(deployed)
  });
  
  it("should get owner", async function() {
const tx = await trashPossums.owner();

console.log(tx);
    assert(tx === owner.address);
  })

  it("should mint an nft to the owner address", async function () {
    
    const tx = await trashPossums.connect(owner).mintPossums(1);    
    const promise = await tx.wait();
    const event = promise.events.find(event => event.event === "Mint")
    const toAddress = event.args.mintedTo;
    tokenId1 = promise.events[0].args.tokenId.toNumber();
    console.log("minted to", toAddress, "Token Id", tokenId1)
    assert(toAddress === owner.address);
  });  

  it("should mint an nft to addr1", async function () {
     const tx = await trashPossums.connect(addr1).mintPossums(1);
    const promise = await tx.wait();
    const event = promise.events.find(event => event.event === "Mint")
    const toAddress = event.args.mintedTo;
    tokenId2 = promise.events[0].args.tokenId.toNumber();
    assert(toAddress === addr1.address);
  });

  it("should return the number nfts owned by an address(addr1, owner)", async function () {
    const ownerbal = await trashPossums.balanceOf(owner.address);
    const tx = await trashPossums.balanceOf(addr1.address);
    console.log("addr1 balance",tx.toNumber(), "owner balance", ownerbal.toNumber())
    assert(tx.toNumber() === 1  && ownerbal.toNumber() === 1);
  });

  it("should transfer first minted nft from owner to addr2", async function () {
    const tx =await trashPossums.connect(owner)['safeTransferFrom(address,address,uint256)'](owner.address, addr1.address, tokenId1)
    const promise = await tx.wait();   
    const event = promise.events.find(e=> e.event ==="Transfer")
    assert(event.args.to === addr1.address)
  })
  it("should premint 100 possums", async function () {
    const tx = await trashPossums.premintPossums();
    const promise = await tx.wait();
    const balance = await trashPossums.balanceOf(owner.address);
assert(balance.toNumber() === 101)

  })
  it("should return owner of token by id",  async function (){
    const poss1 = await trashPossums.ownerOf(tokenId1);
    const poss2 = await trashPossums.ownerOf(tokenId2);
    console.log(poss1, poss2)
    assert(poss1 === addr1.address)
  })
});
