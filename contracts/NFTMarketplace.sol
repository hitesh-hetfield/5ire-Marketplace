// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Internal Import for NFT
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {

    address payable owner;

    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);
    }

    /* Doing the job of Counters*/
    uint256 private _tokenIds;
    uint256 private _itemSold;

    uint256 listPrice = 0.0025 ether; /* default listing price */

    // Test event
    event nftCreated(uint256 nftTokenId, string nftURI, uint256 sellingPrice);
    event Unlisted(address previousOwner, address newOwner, uint256 tokenId);
    event Relisted(address seller, uint256 tokenId);

    /* Parameters of the NFT listed on the marketplace */
    struct ListedNFT {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 sellingPrice;
        bool currentlyListed;
    }

    mapping(uint256 => ListedNFT) private idToListedNFT;

    /* Helper Function */
    function updateListPrice(uint256 _listPrice) public payable {
        require(msg.sender == owner, "Only Owner can change the listed price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns(uint256) {
        return listPrice;
    }
    
    /* Get the latest listed NFT */ 
    /* What if the latest listed NFT was taken off the market, then we need to check the previously listed NFT */
    function getLatestListedNFT() public view returns(ListedNFT memory nft) {
        uint256 currentTokenId = _tokenIds;
        if(idToListedNFT[currentTokenId].currentlyListed == true){
            return idToListedNFT[currentTokenId];
        }
    }

    /* Pass in a tokenid and get the listed token for that */
    function getListedNFT(uint256 tokenId) public view returns(ListedNFT memory nft) {
        if(idToListedNFT[tokenId].currentlyListed == true){
            return idToListedNFT[tokenId];
        }
    }

    function getCurrentTokenId() public view returns(uint256) {
        return _tokenIds;
    }

    function nextAvailableTokenId() public view returns(uint256) {
        return _tokenIds + 1;
    }

    /* Main Functions */
    function createToken(string memory tokenURI, uint256 sellingPrice) public payable returns(uint) {
        require(msg.value >= listPrice, "Not enough ether sent to list");
        require(sellingPrice > 0, "Selling price cannot be negative");

        _tokenIds++;
        uint256 currentTokenId = _tokenIds;

        _safeMint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, tokenURI); 

        createListedToken(currentTokenId, sellingPrice);
        return currentTokenId;
    }

    function createListedToken(uint256 tokenId, uint256 sellingPrice) private {
        idToListedNFT[tokenId] = ListedNFT (
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            sellingPrice, 
            true
        );

        _transfer(msg.sender, address(this), tokenId);
    }

    function unlist(uint256 tokenId) public {
        require(idToListedNFT[tokenId].seller == msg.sender, "Only the seller can choose to unlist");
        require(idToListedNFT[tokenId].currentlyListed == true, "NFT currently unlisted");

        idToListedNFT[tokenId].currentlyListed = false;
        idToListedNFT[tokenId].owner = payable(msg.sender);

        _transfer(address(this), msg.sender, tokenId);
        emit Unlisted(address(this), msg.sender, tokenId);
    }

    function relist(uint256 tokenId) public {
        require(idToListedNFT[tokenId].currentlyListed == false, "NFT already listed");
        require(idToListedNFT[tokenId].owner == msg.sender, "Only owner can re-list the NFT");

        idToListedNFT[tokenId].currentlyListed = true;
        idToListedNFT[tokenId].seller = payable(msg.sender);
        
        _transfer(msg.sender, address(this), tokenId);
        emit Relisted(msg.sender, tokenId);

    }

    function getAllNFTs() public view returns (ListedNFT[] memory) {
        uint256 nftCount = _tokenIds;
        uint256 currentlyAvailable = 0;

        for(uint i=0; i<nftCount; i++){
            if(idToListedNFT[i+1].currentlyListed == true){
                currentlyAvailable ++;
            }
        }

        ListedNFT[] memory allNFTs = new ListedNFT[](currentlyAvailable);
        uint256 currentIndex = 0;

        for(uint256 i=0; i < nftCount; i++){ 
            if(idToListedNFT[i+1].currentlyListed == true){
                ListedNFT storage nft = idToListedNFT[i+1];
                allNFTs[currentIndex] = ListedNFT(
                    nft.tokenId,
                    nft.owner,
                    nft.seller,
                    nft.sellingPrice,
                    nft.currentlyListed
                );
                currentIndex ++;
            }
        }
        return allNFTs;
    }

    function getMyNFTs() public view returns(ListedNFT[] memory) {
        uint256 currentTokenId = _tokenIds;
        uint256 ownerNftCount = 0;

        // Getting the number of nfts owned by the user
        for(uint256 i=0; i< currentTokenId; i++){
            if(idToListedNFT[i+1].owner == msg.sender || idToListedNFT[i+1].seller == msg.sender) {
                ownerNftCount ++;
            }
        }
        
        ListedNFT[] memory ownerNFTs = new ListedNFT[](ownerNftCount);
        uint256 currentIndex = 0;

        for(uint i=0; i<ownerNftCount; i++){
            if(idToListedNFT[i+1].owner == msg.sender || idToListedNFT[i+1].seller == msg.sender){
                ownerNFTs[currentIndex] = idToListedNFT[i+1];
                currentIndex++;
            }
        }
        return ownerNFTs;
    }

    function buyNft(uint256 tokenId) public payable {
        uint256 price = idToListedNFT[tokenId].sellingPrice;
        address seller = idToListedNFT[tokenId].seller;
        bool currentlyListed = idToListedNFT[tokenId].currentlyListed;

        if(currentlyListed == true){
            require(msg.value == price, "Not enough funds to buy the nft");
            
            uint256 marketplaceCommission = msg.value * 25/100;
            uint256 actualSellingPrice = msg.value - marketplaceCommission;

            // Updating the state
            idToListedNFT[tokenId].currentlyListed = false;
            _itemSold++;

            _transfer(address(this), msg.sender, tokenId);
            
            // Execute sale after state change
            payable(seller).transfer(actualSellingPrice);
        }
    }

}