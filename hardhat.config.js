require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

account_pvt_key = process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    thunder: {
      url: "https://rpc.testnet.5ire.network",
      chainId: 997,
      accounts: account_pvt_key
    },
    qa: {
      url: "https://rpc.qa.5ire.network",
      chainId: 997995,
      accounts: account_pvt_key
    },
    polygon: {
      url: "https://rpc-amoy.polygon.technology/",
      chainId: 80002,
      accounts: account_pvt_key
    }
  },
  etherscan: {
    apiKey: {
      thunder: process.env.THUNDER_API_KEY !== undefined ? [process.env.THUNDER_API_KEY] : [],
      qa: process.env.QA_API_KEY !== undefined ? [process.env.QA_API_KEY] : [],
      polygon: process.env.POLYGON_API_KEY !== undefined ? [process.env.POLYGON_API_KEY] : [],
    },
    customChains: [
      {
        network: "thunder",
          chainId: 997,
          urls: {
            apiURL: "https://contract.evm.testnet.5ire.network/5ire/verify",
            browserURL: "https://testnet.5irescan.io/dashboard"
          }
        },
        {
          network: "qa",
          chainId: 997995,
          urls: {
            apiURL: "https://contract.evm.qa.5ire.network/5ire/verify",
            browserURL: "https://scan.qa.5ire.network",
          },
        },
        {
          network: "polygon",
          chainId: 80002,
          urls: {
            apiURL: "https://api-amoy.polygonscan.com/api",
            browserURL: "https://amoy.polygonscan.com/"
          }
        }
    ]
  }
};
