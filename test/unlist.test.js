const { expect } = require("chai");
const hre = require("hardhat");

describe("NFT Marketplace", function() {

    let Marketplace, marketplace, deployer, deployerAddress;

    beforeEach( async function () {
        Marketplace = await hre.ethers.getContractFactory("NFTMarketplace");
        marketplace = await Marketplace.deploy();
        await marketplace.waitForDeployment();

        console.log("Marketplace deployed at:", marketplace.target);

        deployer = await hre.ethers.provider.getSigner();
        deployerAddress = await deployer.getAddress();

    });

    it("Should unlist the minted nfts", async function () {
        
        marketplace.unlist()

    })


})