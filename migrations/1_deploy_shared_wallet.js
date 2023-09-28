const { ethNetwork, husbandAddress, wifeAddress } = require('../config.js');
const SharedWallet = artifacts.require("SharedWallet");

module.exports = function(deployer, network, accounts) {
  console.log('Network:', network);
  console.log('Wife account', wifeAddress);
  console.log('Husband account', husbandAddress);
  deployer.deploy(SharedWallet, wifeAddress, husbandAddress);
};
