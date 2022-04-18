require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-ganache");
require('dotenv').config()
require("@appliedblockchain/chainlink-plugins-fund-link");
const { isEvmStep } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const MUMBAI_RPC_URL = process.env.ALCHEMY_MUMBAI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL
const GANACHE_MNEMONIC= process.env.GANACHE_MNEMONIC
module.exports = {
  defaultNetwork: "hardhat", 
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  networks: {
    hardhat: {
      forking:{
        enabled: true,
        url: MUMBAI_RPC_URL,
        blockNumber: 23924300,
        gas: 15688778,
        gasPrice: 8000000000,
        accounts: [PRIVATE_KEY],
        blockGasLimit: 20000000
      },
      // url: "http://127.0.0.1:8545/",
      chainId: 1337,    
    },
    ganache: {     
      url: 'HTTP://127.0.0.1:9545',
      chainId: 5777,      
      mnemonic: GANACHE_MNEMONIC      
    },
    matic: {      
      url: POLYGON_MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      gas: 15688778,
      gasPrice: 8000000000,
    },     
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      blockGasLimit: 20000000
      },
    },
  
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
              }
        },
      },
      {
        version: "0.4.24",
        settings: { 
          optimizer: {
          enabled: true,
          runs: 200
            }
          },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
              }
        },
      },
    ],    
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
          }
        }
      }

  }

