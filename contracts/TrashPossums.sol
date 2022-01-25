// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
//chainlink vrf contract
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract TrashPossums is ERC721, ERC721URIStorage, ERC721Enumerable, Pausable, Ownable, VRFConsumerBase{

    event Mint(address indexed mintedTo, uint256 indexed tokenId);
        
    modifier mintingStarted() {
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

    //MAPPINGS//

    // Ledger of NFTs minted and owned by each unique wallet address.
    mapping(address => uint256) private claimedPossumsPerWallet;
    // array of available possums
    uint256[] availablePossums = new uint[](10000);
    // map of possum uris by ID
    mapping(uint256 => string) private possumUris;
    //mapping of possums with assigned uris
    mapping(uint256 => bool) private assignedUri;
 
    //Global Variables
    uint256 randomResult;
    address VRFCoordinator;    

    constructor(
        uint256 _possumPrice,
        uint256 _startMintDate,
        string memory _baseUri,
        address _VRFAddress,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee
        ) ERC721("Trash Possums", "TPOSS") VRFConsumerBase(_VRFAddress, _linkToken){
            possumPrice = _possumPrice;
            startMintDate = _startMintDate;
            baseURI = _baseUri;
            keyHash = _keyHash; 
            fee = _fee;
            VRFCoordinator = _VRFAddress;
                 }   

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
     
    function mintPossum(address to, uint256 tokenId) internal {
        require(totalMintedPossums <= totalPossums, "all Possums have been minted" );
         _safeMint(to, tokenId );
         _setTokenURI(tokenId, baseURI)               
         totalMintedPossums++;
         claimedPossumsPerWallet[to]++;
         emit Mint(to, tokenId);
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
     * @dev Allows to withdraw the Ether in the contract to the address of the owner.
     */
    function withdraw() external onlyOwner {
        uint256 totalBalance = address(this).balance;
        payable(msg.sender).transfer(totalBalance);
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
     * @dev Prem
     */
    function premintPossums() external onlyOwner {
        require(!premintingComplete, "You can only premint the Possums once");
        require(
            availablePossums.length >= premintCount,
            "No Possums left to be claimed"
        );
        totalMintedPossums += premintCount;
        for (uint256 i; i < premintCount; i++) {
            mintPossum(msg.sender, i);
            availablePossums[i] = availablePossums.length - 1;            
            availablePossums.pop();
        }
        premintingComplete = true;
    }

    // END ONLY OWNER FUNCTIONS

    /**
     * @dev Claim up to 27 Possums at once
     */
    function mintPossums(uint256 amount)
        external
        payable
        callerNotAContract
        mintingStarted
        {
        // require(
        //     msg.value >= possumPrice * amount,
        //     "Not enough Ether to claim the possums"
        // );

        require(
            claimedPossumsPerWallet[msg.sender] + amount <= maxPossumsPerWallet,
            "You cannot claim more possums"
        );

        require(
            availablePossums.length >= amount,
            "No Possum left to be claimed"
        );

        require(
            amount <= maxPossumsPerTransaction,
            "Max 27 per tx"
        );            
        console.log("msg.sender",msg.sender);
        for (uint256 i; i < amount; i++) {
           uint256 possid = getPossumToBeClaimed();
           mintPossum(msg.sender, possid);
           console.log("minting 1 possum to", msg.sender, address(this), possid);
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
 should return nft balance of wallet
  */
   function balanceOf(address addr1) public view override returns (uint256){
       return claimedPossumsPerWallet[addr1];
   }
    
    /**
     * @dev Returns the claim price
     */
    function getpossumPrice() external view returns (uint256) {
        return possumPrice;
    }

    /**
     * @dev Returns the minting start date
     */
    function getMintingStartDate() external view returns (uint256) {
        return startMintDate;
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

        _getRandomNumber(); 
        uint256 random = randomResult;
        console.log("random number", random);
        
        //checks availiblePossums array which is initialized at a length of 10,000 all zeros
        //if possum at random index is 0 and the possum at the last position is 0 mint the random id and assign the index value to the index of the last position of the array.  then pop the last array position
        if(availablePossums[random] == 0 && availablePossums[availablePossums.length-1] == 0) {    
        tokenId = random;
        availablePossums[random] = availablePossums.length - 1;
        availablePossums.pop();
         return tokenId;
        }
        //if the random array index is not 0 and the last position is zero mint the posum with id stored at random index then assign the value to the index to the final position of the array.  pop the array.
         if( availablePossums[random] != 0 && availablePossums[availablePossums.length - 1] ==0){
            tokenId = availablePossums[random];
            availablePossums[random]= availablePossums.length - 1;
            availablePossums.pop();
             return tokenId;
        }  
        // if the random index is not zero and the last position is not zero then assign the value in the last array position to the random postion and pop the array.
        if (availablePossums[random] != 0 && availablePossums[availablePossums.length -1] != 0){
            tokenId = availablePossums[random];
            availablePossums[random] = availablePossums[availablePossums.length -1];
            availablePossums.pop();
             return tokenId;
        }
        //if random index is zero and last position is not zero then assign the value in the last array position to the random position and pop the array.
        if(availablePossums[random] == 0 && availablePossums[availablePossums.length-1] !=0){
            tokenId = random;
            availablePossums[random] = availablePossums[availablePossums.length-1];
            availablePossums.pop();
             return tokenId;
        }
            
    }

    /**
    @dev Chainlink VRF consumer
     */
     function _getRandomNumber() private returns (bytes32 requestId){
         require(LINK.balanceOf(address(this)) >= fee, "Not enough Link  in contract to get random number");
         return requestRandomness(keyHash, fee);
     }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override{
        require(msg.sender == VRFCoordinator  && requestId > 0, "only VRF Coordinator can fulfill");
        randomResult = (randomness % availablePossums.length) - 1;
    }

    //  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override virtual;
    /**
     * @dev Generates a pseudo-random number.
    
    function _getRandomNumber(uint256 _upper) private view returns (uint256) {
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
        console.log("random number",random % _upper);
        return random % _upper;
    }
     */

    /**
     * @dev See {ERC721}.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    receive() external payable { }

}