// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
//chainlink vrf contract
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract TrashPossums is ERC721, ERC721URIStorage, ERC721Enumerable, Pausable, Ownable, VRFConsumerBase{

            
    modifier mintingStarted() {
        console.log(block.timestamp);
        require(
            startMintDate != 0 && startMintDate <= block.timestamp,
            "You are too early"
        );
        _;
    }

     modifier callerNotAContract() {
        require(
            tx.origin == msg.sender,
            "The caller can only be a user and not a contract"
        );
        _;
    }
      //  CONSTANTS //
    uint256 public constant totalPossums = 10000 ;    
    uint256 public constant maxPossumsPerWallet = 54;
    uint256 private constant maxPossumsPerTransaction = 27;
    uint256 private constant premintCount = 100;  


    // SET BY CONSTRUCTOR //
    uint256 private startMintDate;
    uint256 private possumPrice;
    uint256 private totalMintedPossums;
    bool private premintingComplete;
    string private baseURI;
    bytes32 internal keyHash;
    uint256 internal fee;
    address VRFCoordinator; 
    uint256 private  claimDate;
   
    //MAPPINGS//

    // Ledger of number NFTs minted and owned by each unique wallet address.
    mapping(address => uint256) private claimedPossumsPerWallet;
    //mapping to track reserved possums before final offset occurs
    mapping(address => uint256[]) private reservedPossums;
    // array of available possums
    uint256[] availablePossums = new uint[](totalPossums);
   
    //Global Variables
    uint256 private randomIdOffset;
    bool randomIdOffsetExecuted;
     

    constructor(
        uint256 _possumPrice,
        uint256 _startMintDate,
        string memory _baseUri,
        address _VRFAddress,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee,
        uint256 _claimDate
        ) ERC721("Trash Possums", "TPOSS") VRFConsumerBase(_VRFAddress, _linkToken){
            possumPrice = _possumPrice;
            startMintDate = _startMintDate;
            baseURI = _baseUri;
            keyHash = _keyHash; 
            fee = _fee;
            VRFCoordinator = _VRFAddress;
            claimDate = _claimDate;
                   }   

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
     
    function mint(address to, uint256 tokenId) internal {
        require(totalMintedPossums <= totalPossums, "all Possums have been minted" );
         _safeMint(to, tokenId );
         _setTokenURI(tokenId, baseURI);               
         totalMintedPossums++;
         claimedPossumsPerWallet[to]++;        
    }
   
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

     // ONLY OWNER

    /**
     * @dev Allows to withdraw any ether in the contract to the address of the owner.
     */
    function withdraw() external payable onlyOwner {
        uint256 totalBalance = address(this).balance;
       
        //payable(owner()).transfer(totalBalance);
        // send all Ether to owner
        // Owner can receive Ether since the address of owner is payable
        (bool success, ) = payable(owner()).call{value: totalBalance}("");
        require(success, "Failed to send Ether");
    }

    /**
    * @dev allows withdrawal of any erc20 from the contract
     */
    function withdrawErc20(IERC20 token, uint256 _amount) external onlyOwner {
        require(token.balanceOf(address(this)) > 0, "this contract does not contain this token");
            token.transfer(payable(msg.sender), _amount);
    }

    /**
     * @dev Sets the base URI for the API that provides the NFT data.
     */
    function setBaseTokenURI(string memory _uri) external onlyOwner {
        baseURI = _uri;
    }

    /**
     * @dev Sets the mint price for each possum
     */
    function setPossumPrice(uint256 _possumPrice) external onlyOwner {
        possumPrice = _possumPrice;
    }

   
   
    /**
     * @dev Premint possums
     */
    function premintPossums() external onlyOwner {
        require(!premintingComplete, "You can only premint the Possums once");
        require(
            availablePossums.length >= premintCount,
            "No Possums left to be claimed"
        );      
        for (uint256 i; i < premintCount; i++) {
            mint(msg.sender, i);
            availablePossums[i] = availablePossums.length - 1;            
            availablePossums.pop();
        }
        premintingComplete = true;
    }

    function executeOffset() public {
        require(!randomIdOffsetExecuted, "offset already executed");
        require(availablePossums.length == 0 || block.timestamp > claimDate, "Cannot execute offset yet");
        _getRandomNumber();
        ///////////////////REMOVE BEFORE PUBLISHING CONTRACT/////////////////
        randomIdOffset = 10;
        //////////////////////////////////////////////////////////////////////
        randomIdOffsetExecuted = true;        
    }
    // END ONLY OWNER FUNCTIONS

    /**
     * @dev RESERVE up to 27 Possums at once
     */
    function reservePossums(uint256 amount)
        external
        payable
        callerNotAContract
        mintingStarted
        {
        require(
            msg.value >= possumPrice * amount,
            "Not enough Ether to reserve these possums"
        );
        require(amount > 0, "need to mint at least 1 NFT");
        require(
            claimedPossumsPerWallet[msg.sender] + amount <= maxPossumsPerWallet,
            "You cannot reserve more possums"
        );

        require(
            availablePossums.length >= amount,
            "No Possums left"
        );

        require(
            amount <= maxPossumsPerTransaction,
            "Max 27 per transaction"
        );            
        require(getOffset() == 0);

        for (uint256 i; i < amount; i++) {
           uint256 possid = getPossumToBeClaimed();
           reservedPossums[msg.sender].push(possid);
           console.log("reserving possum to", msg.sender, possid);
        }
       
    }
        
    function claimPossums() public callerNotAContract{
        require(reservedPossums[msg.sender].length > 0, "you have no reserved possums");
        require(randomIdOffset != 0, "Possums not ready to be claimed");
        uint256 finalId;
        for(uint256 i; i < reservedPossums[msg.sender].length; i++){
            uint256 id = reservedPossums[msg.sender][i] + randomIdOffset;
            if( id > totalPossums - 1){
                finalId = (id - (totalPossums -1)) + (premintCount -1);
            } else {
                finalId = id;
            }
            mint(msg.sender, finalId);
        }
    }

  
    /**
     * @dev Returns the base URI for the tokens API.
     */
    function baseTokenURI() external view returns (string memory) {
        return baseURI;
    }

    /**
     * @dev Returns how many possums are still available to be claimed
     */
    function getNumberOfAvailablePossums() external view returns (uint256) {
        return availablePossums.length;
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

    /**
     * @dev Returns number of reserved possums for a wallet
     */

     function getNumberOfReservedPossums(address _wallet)public view returns(uint256){
           return reservedPossums[_wallet].length;
     }

      /**
     * @dev Returns ids of the reserved possums for a wallet.
     */
    function getReservedPossumIds(address _wallet) public view returns(uint256[] memory reservedIds){
        require(reservedPossums[_wallet].length > 0, "Wallet has no reserved possums");
        
        reservedIds = new uint256[](reservedPossums[_wallet].length);

            for(uint256 i; i < reservedPossums[_wallet].length; i++ ){
                reservedIds[i] = reservedPossums[_wallet][i];
            }
    }

    /**
     * @dev Returns the claim price
     */
    function getPossumPrice() external view returns (uint256) {
        return possumPrice;
    }

    /**
    * @dev Returns the balance of the contract
    */
    function getBalance()external view returns (uint256){
        return address(this).balance;
    }
    /**
     * @dev Returns the minting start date
     */
    function getMintingStartDate() external view returns (uint256) {
        return startMintDate;
    }
     /**
    * @dev Returns the randomly selected ID offset
    */
    function getClaimDate() public view returns(uint256){
        return claimDate;
    }

    /**
     * @dev Returns the total supply
     */
    function totalSupply() public view override returns (uint256) {
        return totalMintedPossums;
    }

    // Private and Internal functions

    /**
     * @dev Returns a random available possum to be claimed uses availablePossums array initialized to 0.
     */
    

    function getPossumToBeClaimed() private returns (uint256 tokenId) {     
   
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

     function _getRandomNumber() private returns (bytes32 requestId){
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
        console.log("random number",random % availablePossums.length -1);
        uint256 randomResult = (random % availablePossums.length -1);
        return randomResult ;
    }
     

    /**
     * @dev See {ERC721}.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    receive() external payable {}

} 