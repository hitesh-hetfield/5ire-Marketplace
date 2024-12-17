const hre  = require("hardhat"); 
const fs = require("fs");
const path = require("path");

async function main() {

    const deployer = await hre.ethers.provider.getSigner();
    const deployerAddress = await deployer.getAddress();
    const networkName = hre.network.name;
    const env = process.env.NODE_ENV;

    console.log("Contract deploying with:", deployerAddress, "on chain:", networkName);

    const marketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    const marketplaceContract = await marketplace.deploy();

    await marketplaceContract.waitForDeployment();
    console.log("NFT Markeplace deployed to:", marketplaceContract.target);

    // Verify Contract
    await hre.run("verify:verify", {
        address:marketplaceContract.target,
    });
    
    // Storing marketplace address
    const contractAddress = {
        contractAddress: marketplaceContract.target,
        network: networkName
    };

    const filepath = path.join(
        __dirname, 
        `../../marketplace-contracts/${env}.${networkName}.marketplaceAddress.json`
    );

    const existingtx = fs.existsSync(filepath)
    ? JSON.parse(fs.readFileSync(
        filepath,
        "utf-8"
        )
    ) : [];

    existingtx.push(contractAddress);

    fs.writeFileSync(
        filepath,
        JSON.stringify(existingtx, null, 4)
    );

    console.log("Contract address saved to:", filepath);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});