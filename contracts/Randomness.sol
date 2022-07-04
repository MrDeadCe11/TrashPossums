// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
//import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract Randomness is Ownable, VRFConsumerBaseV2 {
    //Global Variables for Chainlink VRF
    address public VRFCoordinator;
    bytes32 public keyHash;
    uint64 subscriptionId;
    uint32 callbackGasLimit = 200000;
    uint256 public requestId;
    uint16 requestConfirmations = 3;
    uint32 numWords = 2;
    VRFCoordinatorV2Interface COORDINATOR;
    LinkTokenInterface LINKTOKEN;

    //Variables
    uint256[] public randomIdOffset;
    uint256 public claimableDate;
    bool public randomIdOffsetExecuted;
    address public trashAddress;
    bool public premintExecuted;

    // array of available possums
    uint256[] availablePossums = new uint256[](7000);

    constructor(
        address _VRFAddress,
        uint64 _subscriptionId,
        address _linkTokenAddress,
        bytes32 _keyHash
    ) VRFConsumerBaseV2(_VRFAddress) {
        COORDINATOR = VRFCoordinatorV2Interface(_VRFAddress);
        LINKTOKEN = LinkTokenInterface(_linkTokenAddress);
        subscriptionId = _subscriptionId;
        VRFCoordinator = _VRFAddress;
        keyHash = _keyHash;
    }

    modifier onlyTrash() {
        require(msg.sender == trashAddress, "only Trash can call this");
        _;
    }

    function getAvailablePossums() public view returns (uint256) {
        return availablePossums.length;
    }

    function executeOffset() public returns (bool) {
        require(!randomIdOffsetExecuted, "offset already executed");
        require(
            availablePossums.length == 0 || block.timestamp > claimableDate,
            "Cannot execute offset yet"
        );
        require(claimableDate != 0, "not ready to offset yet");

        _getRandomNumber();

        randomIdOffsetExecuted = true;

        return randomIdOffsetExecuted;
    }

    function getOffset() public view returns (uint256) {
        if (randomIdOffset.length == 0) {
            return 0;
        } else {
            return randomIdOffset[0];
        }
    }

    function executePremint(uint256 _premintCount) external onlyOwner {
        require(!premintExecuted, "can only premint once");
        for (uint256 i; i < _premintCount; i++) {
            availablePossums[i] = availablePossums.length - 1;
            availablePossums.pop();
        }
        premintExecuted = true;
    }

    function getPremint() public view returns (bool) {
        return premintExecuted;
    }

    /**
    Must set trash address before you can execute onlyTrash functions
     */
    function setTrash(address trash) external onlyOwner {
        trashAddress = trash;
    }

    function getTrash() public view returns (address) {
        return trashAddress;
    }

    function setClaimableDate(uint256 _claimable) external onlyOwner {
        claimableDate = _claimable;
    }

    function getClaimableDate() public view returns (uint256) {
        return claimableDate;
    }

    /**
     * @dev Returns a random available possum to be claimed uses availablePossums array initialized to 0.
     */
    function getPossumToBeClaimed()
        external
        onlyTrash
        returns (uint256 tokenId)
    {
        uint256 random = _getPseudoRandomNumber();

        // checks availiblePossums array which is initialized at a length of 7,000 all zeros
        // if possum at random index is 0 and the possum at the last position is 0 mint the random
        //   id and assign the index value to the index of the last position of the array.
        //   then pop the last array position
        if (
            availablePossums[random] == 0 &&
            availablePossums[availablePossums.length - 1] == 0
        ) {
            tokenId = random;
            availablePossums[random] = availablePossums.length - 1;
        }
        // if the random array index is not 0 and the last position is zero mint the posum with
        //   id stored at random index then assign the value to the index to the final position of the array.  pop the array.
        else if (
            availablePossums[random] != 0 &&
            availablePossums[availablePossums.length - 1] == 0
        ) {
            tokenId = availablePossums[random];
            availablePossums[random] = availablePossums.length - 1;
        }
        // if the random index is not zero and the last position is not zero then assign the value
        //   in the last array position to the random postion and pop the array.
        else if (
            availablePossums[random] != 0 &&
            availablePossums[availablePossums.length - 1] != 0
        ) {
            tokenId = availablePossums[random];
            availablePossums[random] = availablePossums[
                availablePossums.length - 1
            ];
        }
        // if random index is zero and last position is not zero then assign the value in the last
        // array position to the random position and pop the array.
        else {
            tokenId = random;
            availablePossums[random] = availablePossums[
                availablePossums.length - 1
            ];
        }

        //only do this if you can guarantee that when you get here it's a valid operation/return value
        availablePossums.pop();
        return tokenId;
    }

    /**
    @dev Chainlink VRF consumer
    //  */

    function _getRandomNumber() private {
        require(
            claimableDate < block.timestamp && claimableDate != 0,
            "not ready to get random number"
        );
        //for local testing
        //randomIdOffset = new uint256[](1);
        //    randomIdOffset[0] = 10;      

        //for deployment
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        randomIdOffset = randomWords;
    }

    /**
     * @dev Generates a pseudo-random number.
     */

    function _getPseudoRandomNumber() private view returns (uint256) {
        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    availablePossums.length,
                    blockhash(block.number - 1),
                    block.coinbase,
                    block.difficulty,
                    msg.sender
                )
            )
        );
        uint256 randomResult = ((random % availablePossums.length) - 1);
        return randomResult;
    }

    /**
    fallback function
     */
    receive() external payable {}

    /**
     * @dev Allows withdrawal of any ether in the contract to the address of the owner.
     */
    function withdraw() external payable onlyOwner {
        uint256 totalBalance = address(this).balance;

        // send all Ether to owner
        // Owner can receive Ether since the address of owner is payable
        (bool success, ) = payable(owner()).call{value: totalBalance}("");
        require(success, "Failed to send Ether");
    }

    /**
     * @dev allows withdrawal of any erc20 from the contract to owner
     */
    function withdrawErc20(IERC20 token, uint256 _amount) external onlyOwner {
        require(
            token.balanceOf(address(this)) > 0,
            "this contract does not contain this token"
        );
        require(token.transfer(payable(owner()), _amount), "transfer failed");
    }
}
