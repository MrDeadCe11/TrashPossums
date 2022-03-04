// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";    
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "hardhat/console.sol";

import "./Randomness.sol";
import "./IRandomness.sol";



contract TrashPossums is  ERC721, ERC721URIStorage, Ownable, ERC721Enumerable, Pausable, Randomness{

        event Reserved(address indexed to, uint256 indexed tokenId);

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
    //EVENTS//

      //  CONSTANTS //
    uint256 public constant totalPossums = 10000 ; 
      
    uint256 public constant maxPossumsPerWallet = 52;
    uint256 private constant maxPossumsPerTransaction = 27;
    uint256 private constant premintCount = 100;  
    

    // SET BY CONSTRUCTOR //
    uint256 private startMintDate;
    uint256 private possumPrice;
    uint256 private totalMintedPossums;   
    string private baseURI;     
    uint256 private  claimDate;
    uint256 private numberOfReservedPossums;
   
    address public randomness;
    
   
    //MAPPINGS//

    // Ledger of number NFTs minted and owned by each unique wallet address.
    mapping(address => uint256) private claimedPossumsPerWallet;
    //mapping to track reserved possums before final offset occurs
    mapping(address => uint256[]) private reservedPossums;
    
   
    //Global Variables
  bool premintingComplete;
   

    constructor(
        uint256 _possumPrice,
        uint256 _startMintDate,
        string memory _baseUri,
        uint256 _claimDate,
        address _VRFAddress,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee,
        address _randomness
        ) ERC721("Trash Possums", "TPOSS") Randomness(_VRFAddress, _linkToken, _keyHash, _fee, claimDate) {
            possumPrice = _possumPrice;
            startMintDate = _startMintDate;
            baseURI = _baseUri;  
            claimDate = _claimDate;
           randomness = _randomness;
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
        uint256 availPoss = IRandomness(randomness).getAvailablePossums();
        require(!premintingComplete, "You can only premint the Possums once");
        require(
            availPoss >= premintCount,
            "No Possums left to be claimed"
        );      
        
        console.log("AVAIL", availPoss, premintCount);
        for (uint256 i; i < premintCount; i++) {
           mint(msg.sender, i);
        //    IRandomness(randomness).setArray(i, availPoss);         
        //     IRandomness(randomness).popArray(); 
        }
        IRandomness(randomness).executePremint(premintCount);
        premintingComplete = true;
    }
     
   
    
    // END ONLY OWNER FUNCTIONS

    /**
     * @dev RESERVE up to 27 Possums at once
     */
    function reservePossums(uint256 amount)
        external
        payable
        mintingStarted
        {
            uint256 offset = IRandomness(randomness).getOffset();  
            uint256 available = IRandomness(randomness).getAvailablePossums();
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
            available >= amount,
            "No Possums left"
        );

        require(
            amount <= maxPossumsPerTransaction,
            "Max 27 per transaction"
        );
                 
        require(offset == 0, "offset already enacted, cannot reserve");

        for (uint256 i; i < amount; i++) {
           uint256 possId = getPossumToBeClaimed();
           reservedPossums[msg.sender].push(possId);
           numberOfReservedPossums++;
           console.log("reserved", msg.sender, possId);
          emit Reserved(msg.sender, possId);
        }
       
    }

        
    function claimPossums() public {
        require(reservedPossums[msg.sender].length > 0, "you have no reserved possums");
        require( claimDate < block.timestamp || numberOfReservedPossums == totalPossums);

        uint256 finalId;
        uint256 offset = IRandomness(randomness).getOffset();
        require(offset != 0, "Possums not ready to be claimed" );
        for(uint256 i; i < reservedPossums[msg.sender].length; i++){
            uint256 id = reservedPossums[msg.sender][i] + offset;
            if( id > totalPossums - 1){
                finalId = (id - (totalPossums -1)) + (premintCount -1);
            } else {
                finalId = id;
            }
            console.log("claiming", msg.sender, finalId);
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
    function getNumberOfReservedPossums() external view returns (uint256) {
        return numberOfReservedPossums;
    }


    /**
     * @dev Returns number of reserved possums for a wallet
     */

     function getReservedPossumsPerWallet(address _wallet)public view returns(uint256){
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

    function getTotalPossums() public pure returns(uint256){
        return totalPossums;
    }
   
    /**
     * @dev See {ERC721}.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    receive() external payable {}

} 