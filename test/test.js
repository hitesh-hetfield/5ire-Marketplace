const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("NFTMarketplace is Active", function () {
  it("Should create an NFT", async() => {
    const NFTContract = await ethers.getContractFactory("NFTMarketplace") ;
    const nftContract = await NFTContract.deploy();
    await nftContract.waitForDeployment();

    console.log("NFTMarketplace deployed at:", await nftContract.target);

    // Call the createToken function
    const tokenURI = "https://nft-token-uri/";
    const sellingPrice = "250000000000000000"; // 0.25 Ether in wei
    const listPrice = await nftContract.getListPrice();

    const newNft = await nftContract.createToken(tokenURI, sellingPrice, {
      value: listPrice,
    });
    const receipt = await newNft.wait();
    console.log("Transaction receipit:", receipt);
  });



});

// describe("NFTMarkerplace", function () {
//     it("Should return all listed NFTs", async function () {
//         const NFTContract = await ethers.getContractFactory("NFTMarkerplace");
//         const nft = await NFTContract.deploy();
//         await nft.waitForDeployment();
        
//         const ownerAddress = "0x850b74A3Cd5edeaD1d09c4ce39356ED681709C1c";
//         const price = 0.25; 

//         // Add some NFTs to test
//         await nft.listNFT(1, ownerAddress, price); // Mocked listNFT function
//         await nft.listNFT(2, ownerAddress, price);

//         // Call getAllNFTs and verify the output
//         const allNFTs = await nft.getAllNFTs();
//         expect(allNFTs.length).to.equal(2);
//         expect(allNFTs[0].tokenId).to.equal(1);
//         expect(allNFTs[1].tokenId).to.equal(2);
//     });
// });
