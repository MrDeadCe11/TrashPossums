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
  beforeEach(async () => {
    provider = ethers.getDefaultProvider();
    const TrashPossums = await ethers.getContractFactory("TrashPossums");
    [owner, addr1, addr2, ...addresses] = await ethers.getSigners();
    trashPossums = await TrashPossums.deploy();
    await trashPossums.deployed();
  });

  it("should mint an nft to the owner address", async function () {
    const tx = await trashPossums.safeMint(owner.address, testUri);
    const promise = await tx.wait();

    assert(promise.events[0].args.to === owner.address);
  });

  it("should mint an nft to addr1", async function () {
    const tx = await trashPossums.safeMint(addr1.address, testUri);
    const promise = await tx.wait();
    assert(promise.events[0].args.to === addr1.address);
  });

  it("should return the number nft's owned by an address(addr1)", async function () {
    const tx = await trashPossums.balanceOf(addr1.address);
    assert(tx.toNumber() === 1);
  });
});
