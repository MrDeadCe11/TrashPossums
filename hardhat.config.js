require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-ganache");
require('dotenv').config()
const { isEvmStep } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const MUMBAI_RPC_URL = process.env.ALCHEMY_MUMBAI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL
const GANACHE_MNEMONIC= process.env.GANACHE_MNEMONIC
module.exports = {
  defaultNetwork: "hardhat", 
  networks: {
    hardhat: {
      chainId: 5777
    
    },
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY]
    },
    localhost:{
      url: 'http://localhost:7545',
      accounts: {
         mnemonic: GANACHE_MNEMONIC}
      
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      },
    polygon: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      saveDeployments: true,
      },
    },
  
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
          }
        }
      }

  }

