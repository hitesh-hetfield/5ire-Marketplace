const { expect } = require("chai");
const { ethers } = require("ethers");
const hre = require("hardhat");

describe("NFT Marketplace", function() {

    let Marketplace, marketplace, deployer, deployerAddress;

    beforeEach(async function () {
        Marketplace = await hre.ethers.getContractFactory("NFTMarketplace");
        marketplace = await Marketplace.deploy()
        await marketplace.waitForDeployment();
        console.log("Contract Deployed to:", marketplace.target);


    deployer = await hre.ethers.provider.getSigner();
    deployerAddress = await deployer.getAddress();
    
    console.log("Contract deployed with address:", deployerAddress);
    });

    it("Should create/mint NFTs", async function () {
        const tokenURI1 = "firstTokenUri";
        const sellingPrice1 = hre.ethers.parseEther("1", 18);

        const tokenURI2 = "secondTokenUri";
        const sellingPrice2 = hre.ethers.parseEther("1", 18);

        const listPrice = hre.ethers.parseEther("0.0025", 18);

        console.log("marketplace address:", marketplace.target);

        const nft1 = await marketplace.createToken(
            tokenURI1,
            sellingPrice1,
            { value: listPrice}
        );

        const nft2 = await marketplace.createToken(
            tokenURI2,
            sellingPrice2,
            { value: listPrice}
        );

        nft1.wait();
        nft2.wait();

    })

})