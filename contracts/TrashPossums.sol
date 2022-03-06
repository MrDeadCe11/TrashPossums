// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";    
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./IRandomness.sol";



contract TrashPossums is  ERC721, ERC721URIStorage, Ownable, ERC721Enumerable, Pausable{

        event Reserved(address indexed to, uint256 indexed tokenId);

    modifier mintingStarted() {
            require(
            startMintDate != 0 && startMintDate < block.timestamp,
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
        uint256 private numberOfReservedPossums;
   
    address public randomness;
    
   
    //MAPPINGS//

    // Ledger of number NFTs minted and owned by each unique wallet address.
    mapping(address => uint256) private claimedPossumsPerWallet;
    //mapping to track reserved possums before final offset occurs
    mapping(address => uint256[]) private reservedPossums;

    constructor(
        uint256 _possumPrice,
        uint256 _startMintDate,
        string memory _baseUri,           
        address _randomness
        ) ERC721("Trash Possums", "TPOSS") 
        {
            possumPrice = _possumPrice;
            startMintDate = _startMintDate;
            baseURI = _baseUri;              
            randomness = _randomness;
           }   

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
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

  

    /**
     * @dev Sets the mint price for each possum
     */
    function setPossumPrice(uint256 _possumPrice) external onlyOwner {
        possumPrice = _possumPrice;
    }

     /**
     * @dev Mints the possum
     */
    function mint(address _to, uint256 _tokenId) private{
        require(
            totalMintedPossums <= totalPossums, "all Possums have been minted"
             );
         _safeMint(_to, _tokenId);         
         _setTokenURI(_tokenId, baseURI);               
         
         totalMintedPossums++;
         
         claimedPossumsPerWallet[_to]++;        
    }

    /**
     * @dev Premint possums
     */
    function premintPossums() external onlyOwner {
        bool premintingComplete = IRandomness(randomness).getPremint();
        require(!premintingComplete, "You can only premint the Possums once");
     
        for (uint256 i; i < premintCount; i++) {
           mint(msg.sender, i);
         }
         
        IRandomness(randomness).executePremint(premintCount);
    }
     
   
    
    // END ONLY OWNER FUNCTIONS

    /**
     * @dev RESERVE up to 27 Possums at once
     */
    function reservePossums(uint256 amount)
        public
        payable
        mintingStarted
        {
            uint256 offset = IRandomness(randomness).getOffset();  
            uint256 available = IRandomness(randomness).getAvailablePossums();
        require(
            msg.value >= possumPrice * amount,
            "Not enough Ether to reserve these possums"
        );
        require(
            amount > 0, "need to reserve at least 1 NFT"
            );
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
                 
        require(offset == 0, "offset already enacted, cannot reserve any more possums");

        for (uint256 i; i < amount; i++) {
           uint256 possId = IRandomness(randomness).getPossumToBeClaimed();
           reservedPossums[msg.sender].push(possId);
           numberOfReservedPossums++;
          emit Reserved(msg.sender, possId);
        }
       
    }

        
    function claimPossums() public payable mintingStarted{
        uint256 claimable = getClaimDate();
        require(reservedPossums[msg.sender].length > 0, "you have no reserved possums");
        require( claimable < block.timestamp || numberOfReservedPossums == totalPossums);

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
           
            mint(msg.sender, finalId);
             reservedPossums[msg.sender][i] = 0;
        }
    }

  
    /**
     * @dev Returns the base URI for the tokens API.
     */
    function baseTokenURI() external view returns (string memory) {
        return baseURI;
    }

      /**
     * @dev Sets the base URI for the API that provides the NFT data.
     */

    function setBaseTokenURI(string calldata _tokenURI) external onlyOwner{
        baseURI = _tokenURI;
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
        return IRandomness(randomness).getClaimableDate();
    }

    /**
     * @dev Returns the total supply
     */
    function getTotalMintedPossums() public view returns (uint256) {
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

    /**
    * @dev returns available possums from randomness contract
     */

    function getAvailablePossums() external view returns(uint256){
        return IRandomness(randomness).getAvailablePossums();
    }
    receive() external payable {}

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

  
 
} 