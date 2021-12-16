// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract TrashPossums is ERC721, ERC721Enumerable, ERC721URIStorage, Pausable, Ownable, ERC721Burnable {

    using Counters for Counters.Counter;

    event Mint(address indexed from, uint256 indexed tokenId);

    Counters.Counter private _tokenIdCounter;

    
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
      //  total NFTs
    uint256 public constant totalPossums = 1249;

    // Each transaction allows the user to mint only 27 NFTs. One user can't mint more than 177 NFTs.
    uint256 public constant maxPossumsPerWallet = 27;
    uint256 private maxPossumsPerTransaction = 3;

    // Setting Mint date to 3pm UTC, 03/09/2021
    uint256 private startMintDate = 1630681200;
    //uint8 private royalties = 7/100;

    // Price per NFT: 0.07 ETH
    uint256 private possumPrice = 70000000000000000;

    uint256 private totalMintedPossums = 0;

    uint256 private premintCount = 277;

    bool private premintingComplete = false;

    // IPFS base URI for NFT metadata for OpenSea
    string private baseURI = "https://ipfs.io/ipfs/QmSRkmEDKWUeHi5FiNpQUBAcCq7rKinhf5Pbu8ZPZNkP8r/";

    // Ledger of NFTs minted and owned by each unique wallet address.
    mapping(address => uint256) private claimedPossumsPerWallet;

    // array of available possum ids
    uint256[] private availablePossums;

    // map of possum uris by ID
    mapping(uint256 => string) private possumUris;

    // have we added all the possums?
    bool private possumsAdded = false;

    constructor() ERC721("Trash Possums", "TRASHPOSS") {
     }   

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _mintPossum(address to, uint256 tokenId) internal {
        require(totalMintedPossums<= totalPossums, "all Possums have been minted" );
        string memory _ipfsUri = possumUris[tokenId];    
        _safeMint(to, tokenId );
        _setTokenURI(tokenId, _ipfsUri);       
         totalMintedPossums++;
         claimedPossumsPerWallet[to]++;                
        emit Mint(to, tokenId);
    }
    function mintPossum(address to)internal {
        require(totalMintedPossums<= totalPossums, "All possums have been minted");
        //require(msg.value >= possumPrice, "You need to pay the correct amount for the possum" );
        uint256 tokenId = getPossumToBeClaimed();
        _mintPossum(to, tokenId);
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
     * @dev Adds all Possums to the available list.
     */
    function addAvailablePossums() external onlyOwner returns(bool) {
        require(possumsAdded == false);
        for (uint16 i = 0; i <= totalPossums; i++) {
            availablePossums.push(i);
        }
        possumsAdded = true;

        return possumsAdded;
    }

    function addPossumUri(uint256 tokenId, string calldata ipfsUri) external onlyOwner {
        possumUris[tokenId] = ipfsUri;
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
            mintPossum(msg.sender);
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
      
        for (uint256 i; i < amount; i++) {
           mintPossum(msg.sender);
           console.log("minting 1 possum", msg.sender, address(this));
        }
       
            }
        
//   function _batchMint(address to, uint256[] memory tokenIds)
//         internal
//         virtual
//     {
//         require(to != address(0), "ERC721: mint to the zero address");
//         claimedPossumsPerWallet[to] += tokenIds.length;

//         for (uint256 i; i < tokenIds.length; i++) {
//             require(!_exists(tokenIds[i]), "ERC721: token already minted");

//             _beforeTokenTransfer(address(0), to, tokenIds[i]);

//            mintPossum(to);

//             emit Transfer(address(0), to, tokenIds[i]);
//         }
//     }
    /**
     * @dev Returns the tokenId by index
    //  */
    // function tokenByIndex(uint256 tokenId) external view returns (uint256) {
    //     require(
    //         _exists(tokenId),
    //         "ERC721: operator query for nonexistent token"
    //     );

    //     return tokenId;
    // }
    /**
     * @dev Returns the base URI for the tokens API.
     */
    function baseTokenURI() external view returns (string memory) {
        return baseURI;
    }

    /**
     * @dev Returns how many possums are still available to be claimed
     */
    function getAvailablePossums() external view returns (uint256) {
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
     * @dev Returns a random available possum to be claimed
     */
    function getPossumToBeClaimed() private returns (uint256 tokenId) {
        uint256 random = _getRandomNumber(availablePossums.length);       
        tokenId = uint256(availablePossums[random]);
        availablePossums[random] = availablePossums[
            availablePossums.length - 1
        ];
        availablePossums.pop();

        return tokenId;     
    }

    /**
     * @dev Generates a pseudo-random number.
     */
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

        return random % _upper;
    }

    /**
     * @dev See {ERC721}.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

}