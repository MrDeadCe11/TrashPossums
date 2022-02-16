// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Randomness is VRFConsumerBase {
    
    //Global Variables for Chainlinki VRF
    uint256 internal fee;
    address VRFCoordinator; 
    bytes32 internal keyHash; 
    
    //Variables
    uint256 internal randomIdOffset;    
    uint256 internal  claimableDate;
    address trash;
    uint256 internal premintNumber = 100;
    bool public premintSet;    
    bool public trashSet;
    bool public randomIdOffsetExecuted;
    bool public premintingComplete;
    uint256 public arrayLength;


     
      // array of available possums
    uint256[] availablePossums = new uint[](10000);

    constructor(
        address _VRFAddress,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee,
        uint256 _claimableDate,
        uint256 _arrayLength
        
        )VRFConsumerBase(_VRFAddress, _linkToken){
                keyHash = _keyHash; 
                VRFCoordinator = _VRFAddress;
                fee = _fee;   
                claimableDate = _claimableDate;
                arrayLength = _arrayLength;
               
               }

    modifier onlyTrash(){
        require(msg.sender == trash, "only child contract can call this");
        _;
    }
    
    function setTrash(address _trash) internal returns(address){
        require(!trashSet, "trash has already been set");
        trash = _trash;
        trashSet = true;
        return trash;
    }
   
   function gettrash()public view returns(address){
       return trash;
   }
    /**
    * @dev Returns the randomly selected ID offset
    */
    function getOffset() public view returns(uint256){
        return randomIdOffset;
    }

    function offsetExecuted() public view returns(bool){
        return randomIdOffsetExecuted;
    }

    function getPremintNumber() public view returns(uint256){
        return premintNumber;
    }

    function getAvailablePossums() public view returns(uint256){
        return availablePossums.length;
    }

    function executeOffset() public returns(bool){
        require(!randomIdOffsetExecuted, "offset already executed");
        require(availablePossums.length == 0 || block.timestamp > claimableDate, "Cannot execute offset yet");
        _getRandomNumber();
        ///////////////////REMOVE BEFORE PUBLISHING CONTRACT/////////////////
        randomIdOffset = 10;
        //////////////////////////////////////////////////////////////////////
        randomIdOffsetExecuted = true;   
        return randomIdOffsetExecuted;     
    }

    /**
     * @dev Premint possums
     */
    function premintPossums() external virtual onlyTrash {
        require(!premintingComplete, "You can only premint the Possums once");
        require(
            availablePossums.length >= premintNumber,
            "No Possums left to be claimed"
        );      
        for (uint256 i; i < premintNumber; i++) {
           // mint(msg.sender, i);
            availablePossums[i] = availablePossums.length - 1;            
            availablePossums.pop();
        }
        premintingComplete = true;
    }
    
    /**
     * @dev Returns a random available possum to be claimed uses availablePossums array initialized to 0.
     */
   function getPossumToBeClaimed() internal returns (uint256 tokenId) {     
   
        uint256 random = _getPseudoRandomNumber();
            
            // checks availiblePossums array which is initialized at a length of 10,000 all zeros
            // if possum at random index is 0 and the possum at the last position is 0 mint the random 
            //   id and assign the index value to the index of the last position of the array.  
            //   then pop the last array position
            if(availablePossums[random] == 0 && availablePossums[availablePossums.length-1] == 0) {    
                tokenId = random;
                availablePossums[random] = availablePossums.length - 1;
            }
            // if the random array index is not 0 and the last position is zero mint the posum with 
            //   id stored at random index then assign the value to the index to the final position of the array.  pop the array.
            else if( availablePossums[random] != 0 && availablePossums[availablePossums.length - 1] == 0) {
                tokenId = availablePossums[random];
                availablePossums[random]= availablePossums.length - 1;
            }  
            // if the random index is not zero and the last position is not zero then assign the value 
            //   in the last array position to the random postion and pop the array.
            else if (availablePossums[random] != 0 && availablePossums[availablePossums.length -1] != 0) {
                tokenId = availablePossums[random];
                availablePossums[random] = availablePossums[availablePossums.length -1];
            }
            // if random index is zero and last position is not zero then assign the value in the last 
            // array position to the random position and pop the array.
        
            // else if (availablePossums[random] == 0 && availablePossums[availablePossums.length-1] != 0) {
            //     tokenId = random;
            //     availablePossums[random] = availablePossums[availablePossums.length-1];
            // }

            else {
                tokenId = random;
                availablePossums[random] = availablePossums[availablePossums.length-1];
            }
    
    //only do this if you can guarantee that when you get here it's a valid operation/return value 
    availablePossums.pop();
    return tokenId;
}

    /**
    @dev Chainlink VRF consumer
    //  */

     function _getRandomNumber() internal returns (bytes32 requestId){
         require(claimableDate < block.timestamp);
         require(LINK.balanceOf(address(this)) >= fee, "Not enough Link  in contract to get random number");
         return requestRandomness(keyHash, fee);
     }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override{
        require(msg.sender == VRFCoordinator  && requestId > 0, "only VRF Coordinator can fulfill");
        randomIdOffset = (randomness % 9999);
    }

    //  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override virtual;
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
        uint256 randomResult = (random % availablePossums.length -1);
        return randomResult ;
    }

}