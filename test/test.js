const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Trash Possums", function () {
  let owner, addr1, addr2, addr3, addresses;
  let provider;
  let tokenId1,
    tokenId2,
    tokenId3,
    reserveId1,
    idOffset;
  let trashPossums, randomness;
  let hardhatVrfCoordinatorMock;
  let CLSubscriptionId;
  const startMintDate = 1642282339;
  //approx noon on feb 20th 2022
  const possumPrice = ethers.utils.parseEther("2");
  const premintCount = ethers.BigNumber.from("80");
  const LinkTokenMumbai = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
  const keyHashMumbai =
    "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f";

  let linkContract

  const linkAbi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",

    // Get the account balance
    "function balanceOf(address) view returns (uint)",

    // Send some of your tokens to someone else
    "function transfer(address to, uint amount)",

    // An event triggered whenever anyone transfers to someone else
    "event Transfer(address indexed from, address indexed to, uint amount)",
  ];

  const VRFAbi = [
    "function requestRandomness(bytes32, uint256)returns (bytes32)",

    "function rawFulfillRandomness(bytes32, uint256)",
  ];

  const testUri =
    "ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu/";
  const testUri2 = "ipfs://Qmefa7YCGNjFjvZkWcYPerLT9Fj2oi41MxLeaEDNBcrMYG/"

  before("Deploy the contracts", async function () {
    provider = ethers.provider;
    [owner, addr1, addr2, addr3, ...addresses] = await ethers.getSigners();

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0xECfA90604b8A43DE10e5CC3fA78A938fE122EB36"],
    });

    owner = await ethers.getSigner(
      "0xECfA90604b8A43DE10e5CC3fA78A938fE122EB36"
    );

      console.log("Deploying contracts with account: ", owner.address);

    let vrfCoordinatorMock = await ethers.getContractFactory(
      "VRFCoordinatorV2Mock"   
     );

    hardhatVrfCoordinatorMock = await vrfCoordinatorMock.deploy(
      0 , 0  //, VRFAddressMumbai, "0x12162c3E810393dEC01362aBf156D7ecf6159528"
    );
  
      console.log("hardhat mock deployed at: ", hardhatVrfCoordinatorMock.address);

    const subscription = await hardhatVrfCoordinatorMock.createSubscription();
    const promise = await subscription.wait()
    CLSubscriptionId = promise.events[0].args.subId

    await hardhatVrfCoordinatorMock.fundSubscription(1, ethers.utils.parseEther("7"))
   

    const Random = await ethers.getContractFactory("Randomness");
    randomness = await Random.connect(owner).deploy(
      hardhatVrfCoordinatorMock.address,
      CLSubscriptionId,
      LinkTokenMumbai,
      keyHashMumbai
    );
    const deployedRandomness = await randomness.deployed();

      console.log("Randomness deployed at: ", randomness.address);

    const TrashPossums = await ethers.getContractFactory("TrashPossums");
    trashPossums = await TrashPossums.connect(owner).deploy(
      possumPrice,
      testUri,
      randomness.address,
      premintCount
    );

    const deployed = await trashPossums.deployed(); 

      console.log("TrashPossums deployed at: ", trashPossums.address); 

    linkContract = new ethers.Contract(LinkTokenMumbai, linkAbi, provider);
      console.log("link deployed at: ", linkContract.address);
    
    assert(deployed, deployedRandomness);
  });

  describe("Basic deployment", function () {

    it("should fund the contracts with ChainLink", async function () {

      let transfer = await linkContract
        .connect(owner)
        .transfer(randomness.address, ethers.utils.parseEther("10"));
      transfer.wait();

      let transferTrash = await linkContract
        .connect(owner)
        .transfer(trashPossums.address, ethers.utils.parseEther("10"));
      transferTrash.wait();

      let balance = await linkContract
        .connect(owner)
        .balanceOf(randomness.address);
      const trashBalance = await linkContract
        .connect(owner)
        .balanceOf(trashPossums.address);

        await linkContract.connect(owner).transfer(hardhatVrfCoordinatorMock.address, ethers.utils.parseEther("10"));

      assert(balance > 0 && trashBalance > 0);
    });

    it("should transfer eth from wallet 1 to owner", async function () {

      const startBal = await provider.getBalance(owner.address);
      const sendEth = await addr1.sendTransaction({
        to: owner.address,
        value: ethers.utils.parseEther("10"),
      });
      const ownerBal = await provider.getBalance(owner.address);

      assert(ownerBal.sub(startBal).toString() == sendEth.value.toString());
    });

    it("should set the trash address in randomness contract", async function () {

      const tx = await randomness.connect(owner).setTrash(trashPossums.address);
        await tx.wait();
      const trash = await randomness.trashAddress();
      assert(trash.toString() === trashPossums.address);
    });

    it("should set claimable date on randomness contract", async function () {

      const tx = await randomness
        .connect(owner)
        .setClaimableDate(startMintDate);
      await tx.wait();
      const date = await randomness.getClaimableDate();
      expect(date).to.equal(startMintDate);
    });
  });

  describe("Premint", function () {
  
    it("should premint 80 possums", async function () {

      const test = await trashPossums.getAvailablePossums();

      const tx = await trashPossums.connect(owner).premintPossums();
        await tx.wait();
      // const rand = await randomness.connect(owner).executePremint(premintCount);
      //   await rand.wait();
      const balance = await trashPossums.balanceOf(owner.address);

      const test2 = await trashPossums.getAvailablePossums();

      assert(
        balance.toNumber() === 80 && test.toNumber() - test2.toNumber() === 80
      );
      expect(await randomness.getAvailablePossums()).to.equal("6920");
    });

  });

  describe("Reserve functions", function () {

    it("should not reserve possums without correct payment", async function () {

      await expect(
        trashPossums.connect(addr2).reservePossums(2, { value: possumPrice })
      ).to.be.revertedWith("Not enough Ether to reserve these possums");
    });

    it("should reserve an nft to addr1", async function () {

      const tx = await trashPossums
        .connect(addr1)
        .reservePossums(1, { value: possumPrice });
      await tx.wait();
      const idArray = await trashPossums.getReservedPossumIds(addr1.address);
      reserveId1 = idArray[0].toNumber();

      assert(idArray.length === 1);
    });

    it("should reserve 2 nfts to address 2", async function () {

      const sentEth = possumPrice.mul(2);
      const tx = await trashPossums
        .connect(addr2)
        .reservePossums(2, { value: sentEth });
      await tx.wait();
      const possnum = await trashPossums.getReservedPossumsPerWallet(
        addr2.address
      );

      expect(possnum.toNumber()).to.equal(2);
    });

    it("should not be able to reserve 30 possums to addr3", async function () {

      const sentEth = possumPrice.mul(30);
      await expect(
        trashPossums.connect(addr3).reservePossums(30, { value: sentEth })
      ).to.be.revertedWith("Max 27 per transaction");
    });

    it("should reserve 27 nfts for addr 3", async function () {

      const sentEth = possumPrice.mul(27);
      const tx = await trashPossums
        .connect(addr3)
        .reservePossums(27, { value: sentEth });
      await tx.wait();
      const possnum = await trashPossums.getReservedPossumsPerWallet(
        addr3.address
      );
      
      const availNum = await trashPossums.getAvailablePossums();

      addr3tokens = await trashPossums.getReservedPossumIds(addr3.address);
      expect(possnum.toNumber()).to.equal(27);
      expect(availNum.toString()).to.equal("6890");
    });

    it("should reserve another 27 nfts for addr 3", async function () {

      const sentEth = possumPrice.mul(27);
      const tx = await trashPossums
        .connect(addr3)
        .reservePossums(27, { value: sentEth });
      await tx.wait();
      const possnum = await trashPossums.getReservedPossumsPerWallet(
        addr3.address
      );
      const availNum = await trashPossums.getAvailablePossums();

      addr3tokens = await trashPossums.getReservedPossumIds(addr3.address);
      expect(possnum.toNumber()).to.equal(54);
      expect(availNum.toString()).to.equal("6863");
    });

    it("should get the ids of reserved possums for addr2", async function () {

      const idArray = await trashPossums.getReservedPossumIds(addr2.address);
      //store token ids for later use
      reserveId2 = idArray[0].toNumber();
      reserveId3 = idArray[1].toNumber();
      assert(idArray.length === 2);
    });
  });

  describe("Chainlink VRF V2", function () {

    it("should not be able to claim nfts before offset", async function () {

      await expect(
        trashPossums.connect(addr1).claimPossums()
      ).to.be.revertedWith("Possums not ready to be claimed");
    });

    it("should execute offset", async function () {

      //execute vrf request on randomness
      const tx = await randomness.executeOffset();
      //catch events in returned promise
      const {events} = await tx.wait();     
        //find requested randomness event emitted from randomness contract
      let [reqId] = events.filter((x) => x.event === "RequestedRandomness")
        //force mock coordinator to fulfill randomness request must past request ID and invoker address to mock contract
      const fulfill = await hardhatVrfCoordinatorMock.fulfillRandomWords(reqId.args.requestId, randomness.address);
      await fulfill.wait();
      //check to see if offset has been sent to randomness contract
      idOffset = await randomness.randomIdOffset();
      //check values
      expect(await randomness.randomIdOffsetExecuted()).to.be.equal(true);
      expect(idOffset.toString() !== "0");
    });
  });
  
  describe("Claiming reserved nfts", function () {

    it("should claim the nft reserved by addr1", async function () {

      const tx = await trashPossums.connect(addr1).claimPossums();
      const promise = await tx.wait();
      const event = promise.events.find((e) => e.event === "Transfer");
      const totalPoss = await trashPossums.totalPossums();
      tokenId1 = event.args.tokenId.toNumber();
      expect(event.args.to).to.equal(addr1.address);
      expect(tokenId1).to.equal((+reserveId1 + +idOffset) > (totalPoss -1)? ((+reserveId1 + +idOffset) - (totalPoss - 1 ))+( premintCount -1) : +reserveId1 + +idOffset);
    });

    it("should NOT be able to claim the nft reserved by addr1", async function () {

      await expect(
        trashPossums.connect(addr1).claimPossums()
      ).to.be.revertedWith("you have no reserved possums");
    });

    it("should claim nfts reserved by address 2", async function () {

      const tx = await trashPossums.connect(addr2).claimPossums();
      const promise = await tx.wait();
      const transfers = promise.events.filter((e) => e.event === "Transfer");
      tokenId2 = transfers[0].args.tokenId;
      tokenId3 = transfers[1].args.tokenId;
      assert(
        transfers[0].args.to === addr2.address &&
          transfers[1].args.to === addr2.address
      );
    });

    it("should claim nfts reserved by address 3", async function () {

      const tx = await trashPossums.connect(addr3).claimPossums();
      const promise = await tx.wait();
      const transfers = promise.events.filter((e) => e.event === "Transfer");
      assert(
        transfers[0].args.to === addr3.address &&
          transfers[1].args.to === addr3.address &&
          transfers.length === 54
      );
    });
  });

  describe("Basic contract variables and functions", function () {

    it("should change the baseURI", async function () {

      const tx = await trashPossums.setBaseTokenURI(testUri2);
      const promise = await tx.wait()
      const uri = await trashPossums.contractURI();
      assert(testUri2 == uri);
    });

    it("should return correct token URI with .json", async function () {
      const tx = await trashPossums.tokenURI(1);
      assert(tx === "ipfs://Qmefa7YCGNjFjvZkWcYPerLT9Fj2oi41MxLeaEDNBcrMYG/1.json"
      )
    })

    it("reserved Possums array for addr3 should have length of zero", async function () {

      const reserved = await trashPossums.getReservedPossumsPerWallet(
        addr3.address
      );
      expect(reserved.toNumber()).to.equal(0);
    });

    it("should not be able to reserve more possums to addr3 ", async function () {

      const value = possumPrice.mul(2);
      await expect(
        trashPossums.connect(addr3).reservePossums(2, { value: value })
      ).to.be.revertedWith("You cannot reserve more possums");
    });

    it("should return the number nfts owned by an address(addr1, owner)", async function () {

      const ownerbal = await trashPossums.balanceOf(owner.address);
      const tx = await trashPossums.balanceOf(addr1.address);
      assert(tx.toNumber() === 1 && ownerbal.toNumber() === 80);
    });

    it("should transfer first minted nft from addr2 to addr1", async function () {

      const tx = await trashPossums
        .connect(addr2)
        ["safeTransferFrom(address,address,uint256)"](
          addr2.address,
          addr1.address,
          tokenId2
        );
      const promise = await tx.wait();
      const event = promise.events.find((e) => e.event === "Transfer");
      assert(event.args.to === addr1.address);
    });

    it("should return owner of token by id", async function () {

      const poss1 = await trashPossums.ownerOf(tokenId1);
      const poss2 = await trashPossums.ownerOf(tokenId2);
      assert(poss1 === addr1.address && poss2 === addr1.address);
    });

    it("should return the price of the possums", async function () {

      const price = await trashPossums.possumPrice();
      assert(price.toString() === possumPrice.toString());
    });

    it("should change the possum price to 26 ether", async function () {

      const tx = await trashPossums.setPossumPrice(
        ethers.utils.parseEther("26")
      );
      const promise = await tx.wait();
      const price = await trashPossums.possumPrice();
      assert(price.toString() === ethers.utils.parseEther("26").toString());
    });

    it("should return the total minted possums", async function () {

      const supply = await trashPossums.totalMintedPossums();
      assert(supply.toNumber() === 137);
    });

    it("it should return the balance of ether in the contract", async function () {

      const balance = await provider.getBalance(trashPossums.address);
      assert(
        ethers.utils.formatEther(balance.toString()) ==
          ethers.utils.formatEther("114000000000000000000")
      );
    });


    it("should get owner", async function () {

      const tx = await trashPossums.owner();
      assert(tx === owner.address);
    });
  });

  describe("ERC20 token and underlying asset withdrawal", function () {
    
    it("should withdraw the balance of eth in the contract", async function () {

      const tx = await trashPossums.connect(owner).withdraw();
      await tx.wait();
      const contractBalance = await provider.getBalance(trashPossums.address);
      assert(contractBalance.toString() == "0");
    });

    it("should withdraw ERC20 from contract", async function () {

      const startBal = await linkContract.balanceOf(owner.address);
      await trashPossums.connect(owner).withdrawErc20(linkContract.address, 1);
      const endBal = await linkContract.balanceOf(owner.address);
      assert(startBal < endBal);
    });
  });
});
