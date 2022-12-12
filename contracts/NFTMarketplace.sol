//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "@openzoppelin/contracts/utils/Counters.sol";
import "@openzoppelin/contracts/token/ERCR721/extensions/ERC721URIStorage.sol";

import "@openzoppelin/contracts/token/ERCR721/ERC721.sol";
import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.025 ether;

    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }


event MarketItemCreated (
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold,
);

consructor() {
    owner= payable(msg.sender);
}

// update listing price
function updateListingPrice(uint _ListingPrice) public payable{
require(owner == msg.sender, "Only marketplace owner can update the listing price");


listingPrice =_listingPrice;

}
// getListingPrice
function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }

// create token

function createToken(string memory tokenURI,uint256 price) public payable returns (uint){
_tokenIds.increment();
uint256 newTokenId=_tokenIds.current();
_mint(msg.sender , newTokenId);
_setTokenURI(newTokenId,tokenURI);
createMarketItem(newTokenId,price)
return newTokenId;
}

function createMarketItem(uint256 tokenId,uint256 price) private {
require(price > 0,"Price must be at least 1" );
require(msg.value == listingPrice,"Price must be equale to listing price" );

idToMarketItem[tokenId]= MarketItem(
    tokenId,
    payable(msg.sender),
    payable(address(this)),
    price,
    false
);

_transfer(msg.sender,address(this),tokenId);

emit MarketItemCreated(tokenId,msg.sender,address(this),price,false);
}

}
