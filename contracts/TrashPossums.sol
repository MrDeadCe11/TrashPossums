// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./IRandomness.sol";

import "hardhat/console.sol";

contract TrashPossums is
    ERC721,
    ERC721URIStorage,
    Ownable,
    ERC721Enumerable,
    Pausable
{
    event Reserved(address indexed to, uint256 indexed tokenId);

    modifier mintingStarted() {
        require(
            getClaimDate() != 0 && getClaimDate() < block.timestamp,
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

    uint256 public constant totalPossums = 7000;
    uint256 public constant maxPossumsPerWallet = 54;
    uint256 public constant maxPossumsPerTransaction = 27;

    uint256 public premintCount;
    uint256 public possumPrice;
    uint256 public totalMintedPossums;
    uint256 public numberOfReservedPossums;
    address public randomness;
    string public baseURI;

    // counter of number NFTs minted and owned by each unique wallet address.
    mapping(address => uint256) private claimedPossumsPerWallet;
    //mapping to track reserved possums
    mapping(address => uint256[]) private reservedPossums;

    constructor(
        uint256 _possumPrice,
        string memory _baseUri,
        address _randomness,
        uint256 _premintCount
    ) ERC721("Trash Possums", "TPOSS") {
        possumPrice = _possumPrice;
        baseURI = _baseUri;
        randomness = _randomness;
        premintCount = _premintCount;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
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

    //////ONLY OWNER FUNCTIONS/////
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Sets the mint price for each possum
     */
    function setPossumPrice(uint256 _possumPrice) external onlyOwner {
        possumPrice = _possumPrice;
    }
    /**
     * @dev change address of randomness contract.
     */
    function setRandomness(address _randomness) external onlyOwner {
        randomness = _randomness;
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

        //IRandomness(randomness).executePremint(premintCount);
    }

    /**
     * @dev Sets the base URI for the API that provides the NFT data.
     */

    function setBaseTokenURI(string calldata _tokenURI) external onlyOwner {
        baseURI = _tokenURI;
    }

    /**
     * @dev Allows withdrawal of any ether in the contract to the address of the owner.
     */

    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "no ETH in the contract.");
        uint256 totalBalance = address(this).balance;
        address _owner = owner();
        // send all Ether to _owner
        // Owner can receive Ether since the address of _owner is payable
        payable(_owner).transfer(totalBalance);
    }

    /**
     * @dev allows withdrawal of any erc20 from the contract to owner
     */
    function withdrawErc20(IERC20 token, uint256 _amount) external onlyOwner {
        require(
            token.balanceOf(address(this)) > 0,
            "this contract does not contain this token"
        );
        require(token.transfer(payable(owner()), _amount));
    }

    // END ONLY OWNER FUNCTIONS

    /**
     * @dev RESERVE up to 27 Possums at once.
     */
    function reservePossums(uint256 amount) public payable {
        uint256 available = getAvailablePossums();

        require(
            msg.value >= possumPrice * amount,
            "Not enough Ether to reserve these possums"
        );

        require(amount > 0, "need to reserve at least 1 NFT");

        require(
            reservedPossums[msg.sender].length + amount <=
                maxPossumsPerWallet &&
                claimedPossumsPerWallet[msg.sender] + amount <=
                maxPossumsPerWallet,
            "You cannot reserve more possums"
        );

        require(available >= amount, "Not enough Possums left");

        require(amount <= maxPossumsPerTransaction, "Max 27 per transaction");

        for (uint256 i; i < amount; i++) {
            uint256 possId = reservePossum();
            emit Reserved(msg.sender, possId);
        }
    }

    /**
    @dev get random possum ID from randomness contract and map it to the wallet address
     */
    function reservePossum() private returns (uint256 possID) {
        possID = IRandomness(randomness).getPossumToBeClaimed();
        reservedPossums[msg.sender].push(possID);
        numberOfReservedPossums++;
    }

    /**
        @dev after the offset has been set claim your reserved possums with this function
         */
    function claimPossums() public payable mintingStarted {
        uint256 claimable = getClaimDate();
        uint256 reserved = reservedPossums[msg.sender].length;
        require(reserved > 0, "you have no reserved possums");
        require(
            claimable < block.timestamp ||
                numberOfReservedPossums >= totalPossums
        );
        require(claimedPossumsPerWallet[msg.sender] <= maxPossumsPerWallet);

        uint256 finalId;
        uint256 offset = IRandomness(randomness).getOffset();

        require(offset != 0, "Possums not ready to be claimed");

        for (uint256 i; i < reserved; i++) {
            uint256 id = reservedPossums[msg.sender][i] + offset;
            if (id > totalPossums - 1) {
                finalId = (id - (totalPossums - 1)) + (premintCount - 1);
            } else {
                finalId = id;
            }

            mint(msg.sender, finalId);
        }

        for (uint256 i; i < reserved; i++) {
            reservedPossums[msg.sender].pop();
        }
    }

    /**
     * @dev Mints the possum
     */
    function mint(address _to, uint256 _tokenId) private {
        require(
            totalMintedPossums <= totalPossums,
            "all Possums have been minted"
        );
        _safeMint(_to, _tokenId);
        _setTokenURI(_tokenId, baseURI);

        totalMintedPossums++;

        claimedPossumsPerWallet[_to]++;
    }

    /**
     * @dev Returns number of reserved possums for a wallet
     */

    function getReservedPossumsPerWallet(address _wallet)
        public
        view
        returns (uint256)
    {
        return reservedPossums[_wallet].length;
    }

    /**
     * @dev Returns ids of the reserved possums for a wallet.
     */
    function getReservedPossumIds(address _wallet)
        public
        view
        returns (uint256[] memory reservedIds)
    {
        require(
            reservedPossums[_wallet].length > 0,
            "Wallet has no reserved possums"
        );

        reservedIds = new uint256[](reservedPossums[_wallet].length);

        for (uint256 i; i < reservedPossums[_wallet].length; i++) {
            reservedIds[i] = reservedPossums[_wallet][i];
        }
    }

    
     /**
     * @dev Returns the randomly selected ID offset
     */
    function getClaimDate() public view returns (uint256) {
        return IRandomness(randomness).getClaimableDate();
    }

    /**
     * @dev See {ERC721}.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    //for opensea
    function contractURI() public view returns (string memory) {
        return baseURI;
    }

    /**
     * @dev returns available possums from randomness contract
     */

    function getAvailablePossums() public view returns (uint256) {
        return IRandomness(randomness).getAvailablePossums();
    }

    receive() external payable {}
}
