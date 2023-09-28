import Web3 from 'web3';
import contractData from '../../build/contracts/SharedWallet.json';
import { contractAddress, ethNetwork } from '../../config.js'
import { createApp, reactive } from 'vue'
import App from './App.vue'

let web3 = null;
let sharedWallet = null;
let selectedAccount = null;
let error = null;

if (window.ethereum) {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length > 0) {
      selectedAccount = accounts[0];
    } else {
      error = 'Please connect MetaMask to this site';
    }
  } catch (e) {
    error = 'Please connect MetaMask to this site';
  }
  web3 = new Web3(window.ethereum);

  sharedWallet = new web3.eth.Contract(contractData.abi, contractAddress);
  const code = await web3.eth.getCode(contractAddress);
  if (code === '0x') {
    error = `Sorry I cannot find the ${contractAddress} contract. Make sure you are connected to the ${ethNetwork} network.`;
  }

  window.ethereum
    .on('accountsChanged', () => {
      window.location.reload();
    })
    .on('chainChanged', () => {
      window.location.reload();
    });
} else {
  error = 'Please install MetaMask (https://metamask.io) and connect your wallet';
}

const state = reactive({
  selectedAccount: selectedAccount,
  balance: 0.0,
  pendingTransaction: null,
  hasPendingTransfer: false,
  error: error
});

const app = createApp(App)
app.provide('web3', web3);
app.provide('sharedWallet', sharedWallet);
app.provide('state', state);

app.config.errorHandler = (err, vm, info) => {
  state.error = err;
  console.error(err, vm, info);
};

app.mount('#app')
