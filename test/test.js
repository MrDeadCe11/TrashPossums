const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const {
  isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("Trash Possums", function () {
  let owner, addr1, addr2, addresses;
  let provider;
  let tokenId1, tokenId2;
  let trashPossums;
 
  const startMintDate = 23698260; //approx noon on feb 20th 2022
  const possumPrice = ethers.BigNumber.from("25000000000000000000");
  
  const VRFAddressMumbai = "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255";
  const LinkTokenMumbai = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
  const keyHashMumbai = "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4";
  const fee = .001 * 10**18;
 
  let linkContract, VRFContract;
 
  const linkAbi = [// Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
  
    // Get the account balance
    "function balanceOf(address) view returns (uint)",
  
    // Send some of your tokens to someone else
    "function transfer(address to, uint amount)",
  
    // An event triggered whenever anyone transfers to someone else
    "event Transfer(address indexed from, address indexed to, uint amount)"];
  
  const VRFAbi = [
      "function requestRandomness(bytes32, uint256)returns (bytes32)",

      "function rawFulfillRandomness(bytes32, uint256)",

      ""
  ]

  const testUri = "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu";
 
  before ("should successfully deploy the contract",async function () {
    provider = ethers.getDefaultProvider();      
    [owner, addr1, addr2, ...addresses] = await ethers.getSigners();
   
    await hre.network.provider.request({
     method: "hardhat_impersonateAccount",
     params: ["0xECfA90604b8A43DE10e5CC3fA78A938fE122EB36"]
   })

  owner = await ethers.getSigner("0xECfA90604b8A43DE10e5CC3fA78A938fE122EB36");
    
  //   linkContract = new ethers.Contract(LinkTokenMumbai, linkAbi, provider);
  //  VRFContract = new ethers.Contract(VRFAddressMumbai,VRFAbi, provider);
  
  //linkContract = await ethers.getContractFactory("ChainlinkToken")
  //VRFContract = await ethers.getContractFactory("VRFCoordinatorMock") 
  //console.log("VRF Address", VRFContract.address)

    const TrashPossums = await ethers.getContractFactory("TrashPossums");
    trashPossums = await TrashPossums.connect(owner).deploy(possumPrice, startMintDate, testUri, VRFAddressMumbai, LinkTokenMumbai, keyHashMumbai, fee);
    const deployed = await trashPossums.deployed();
    console.log("contract deployed at", trashPossums.address)    
    linkContract = new ethers.Contract(LinkTokenMumbai, linkAbi, provider);
    
    assert(deployed)
  });

  it("should fund the contract with chainlink", async function(){
    let transfer = await linkContract.connect(owner).transfer( "0x721b6F1630013410c964a1F5bB4fDBA07921ac68" , ethers.utils.parseEther("29"));
    transfer.wait();
    let balance = await linkContract.connect(owner).balanceOf(trashPossums.address);
    console.log("contract balance", balance.toString());
    assert(balance > 0)  
  })

  it("should premint 100 possums", async function () {
    const tx = await trashPossums.premintPossums();
    const promise = await tx.wait();
    const balance = await trashPossums.balanceOf(owner.address);
assert(balance.toNumber() === 100)

  })
  
  it("should get owner", async function() {
const tx = await trashPossums.owner();
 assert(tx === owner.address);
  })

  it("should mint an nft to the addr2 address", async function () {
    
    const tx = await trashPossums.connect(addr2).mintPossums(1);    
    const promise = await tx.wait();
    const event = promise.events.find(event => event.event === "Mint")
    const toAddress = event.args[0];
    tokenId1 = event.args[1] ;
    // console.log("minted to", toAddress, "Token Id", tokenId1.toNumber(), "addr2", addr2.address)
    assert(toAddress === addr2.address);
  });  

  it("should mint an nft to addr1", async function () {
     const tx = await trashPossums.connect(addr1).mintPossums(1);
    const promise = await tx.wait();
    const event = promise.events.find(event => event.event === "Mint")
    const toAddress = event.args[0];
    tokenId2 = event.args[1];
    assert(toAddress === addr1.address);
  });

  it("should return the number nfts owned by an address(addr1, owner)", async function () {
    const ownerbal = await trashPossums.balanceOf(owner.address);
    const tx = await trashPossums.balanceOf(addr1.address);
    assert(tx.toNumber() === 1  && ownerbal.toNumber() === 100);
  });

  it("should transfer first minted nft from addr2 to addr1", async function () {
    const tx =await trashPossums.connect(addr2)['safeTransferFrom(address,address,uint256)'](addr2.address, addr1.address, tokenId1)
    const promise = await tx.wait();   
    const event = promise.events.find(e=> e.event ==="Transfer")
    assert(event.args.to === addr1.address)
  })

  it("should return owner of token by id",  async function (){
    const poss1 = await trashPossums.ownerOf(tokenId1);
    const poss2 = await trashPossums.ownerOf(tokenId2);
   assert(poss1 === addr1.address && poss2 === addr1.address)
  })
  it("should return the price of the possums", async function(){
    const price = await trashPossums.getPossumPrice();
    assert(price.toString() === ethers.utils.parseEther("25").toString())
  })
  it("should change the possum price to 26 ether", async function(){
    const tx = await trashPossums.setPossumPrice(ethers.utils.parseEther("26"));
    const promise = await tx.wait();
    const price = await trashPossums.getPossumPrice();
    assert(price.toString() === ethers.utils.parseEther("26").toString())
  })
  it("should return the total supply", async function () {
    const supply = await trashPossums.totalSupply();
    assert(supply.toNumber() === 102)
  })
});
