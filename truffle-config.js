require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    sepolia: {
      provider: () => new HDWalletProvider(process.env.METAMASK_MNEOMIC, 'https://ethereum-sepolia.blockpi.network/v1/rpc/public'),
      network_id: 11155111,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    mainnet: {
      provider: () => new HDWalletProvider(process.env.METAMASK_MNEOMIC, 'https://eth.llamarpc.com'),
      network_id: 1,
      from: process.env.ETH_DEPLOY_ADDRESS
    }
  },
  compilers: {
    solc: {
      version: "0.8.21"
    }
  }
};
