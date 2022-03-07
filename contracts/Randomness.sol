// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "hardhat/console.sol";



contract Randomness is Ownable, VRFConsumerBase {
    
    //Global Variables for Chainlinki VRF
    uint256 public fee;
    address VRFCoordinator;
    bytes32 public keyHash; 
    
    //Variables
    uint256 public randomIdOffset;    
    uint256 public  claimableDate;
    bool public randomIdOffsetExecuted;
    address trashAddress;
    bool public premintExecuted;
             
      // array of available possums
    uint256[] availablePossums =  new uint256[](7000);

    constructor(
        address _VRFAddress,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee,
        uint256 _claimableDate   
        )VRFConsumerBase(_VRFAddress, _linkToken){
                keyHash = _keyHash; 
                VRFCoordinator = _VRFAddress;
                fee = _fee; 
                claimableDate = _claimableDate;                       
               }

       
   
   modifier onlyTrash () {
       require(msg.sender == trashAddress, "only Trash can call this");
       _;
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

    function getAvailablePossums() public view returns(uint256){
        return availablePossums.length;
    }

    function executeOffset() public returns(bool){
        require(!randomIdOffsetExecuted, "offset already executed");
        require(availablePossums.length == 0 || block.timestamp > claimableDate, "Cannot execute offset yet");
       
        _getRandomNumber();
     
        randomIdOffsetExecuted = true;   
        return randomIdOffsetExecuted;     
    }

    function executePremint(uint256 _premintCount) external onlyTrash {
           require(!premintExecuted, "can only premint once");
            for(uint256 i; i<_premintCount; i++){
                availablePossums[i] = availablePossums.length -1;
                availablePossums.pop();
            }     
            premintExecuted = true;
    }

    function getPremint() public view returns(bool){
        return premintExecuted;
    }

    function setTrash(address trash) external onlyOwner {
        trashAddress = trash;
    }

    function getTrash() public view returns(address){
        return trashAddress;
    }

    function setClaimableDate (uint256 _claimable) external onlyOwner{
        
        claimableDate = _claimable;
    }

    function getClaimableDate() public view returns(uint256){
        return claimableDate;
    }

   
    /**
     * @dev Returns a random available possum to be claimed uses availablePossums array initialized to 0.
     */
   function getPossumToBeClaimed() external onlyTrash returns (uint256 tokenId) {     
   
        uint256 random = _getPseudoRandomNumber();
            
            // checks availiblePossums array which is initialized at a length of 7,000 all zeros
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
        randomIdOffset = (randomness % 6000);
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
        uint256 randomResult = (random % availablePossums.length -1);
        return randomResult ;
    }

}