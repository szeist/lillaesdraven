<template>
  <div v-if="!state.hasPendingTransfer">
    <input type="text" v-model="recipient" placeholder="Recipient address" class="nes-input recipient">
    <input type="number" step="0.000001" v-model="amount" min="0.0000001" :max="state.balance" placeholder="Amount in ETH" class="nes-input amount"> ETH
    <button @click="initiateTransfer" :disabled="!isValidTransfer" class="nes-btn" :class="{'is-disabled': !isValidTransfer}">Transfer</button>
  </div>
</template>

<script>
import {inject} from 'vue';

export default {
  data() {
    return {
      recipient: null,
      amount: 0.0,
      pendingTransactionHash: null,
      checkInterval: null
    };
  },
  computed: {
    isValidTransfer() {
      return this.amount > 0 && this.amount <= this.state.balance && this.web3.utils.isAddress(this.recipient);
    }
  },
  methods: {
    async initiateTransfer() {
      const amount = this.web3.utils.toWei(this.amount, 'ether');
      try {
        const encodedCall = this.sharedWallet.methods.initiateTransfer(this.recipient, amount).encodeABI();
        const tx = {
          from: this.state.selectedAccount,
          to: this.sharedWallet.options.address,
          data: encodedCall
        };
        const estimateGas = await this.web3.eth.estimateGas(tx);
        this.web3.eth.sendTransaction({...tx, gasLimit: estimateGas + 10000n})
          .on('transactionHash', (hash) => {
            this.state.pendingTransaction = hash;
          })
          .on('receipt', () => {
            this.state.pendingTransaction = null;
          })
          .on('error', (error) => {
            this.state.error = error;
            this.state.pendingTransaction = null;
            console.error('Error sending transaction:', error);
          })
          .catch((error) => {
            this.state.error = error;
            this.state.pendingTransaction = null;
            console.error('Error sending transaction:', error);
          });
      } catch (error) {
        this.state.error = error;
        this.state.pendingTransaction = null;
        console.error('Error sending transaction:', error);
      }
    }
  },
  beforeMount() {
    this.sharedWallet = inject('sharedWallet');
    this.web3 = inject('web3');
    this.state = inject('state');
  }
}
</script>

<style scoped>
  .amount {
    max-width: 200px;
    border-image-repeat: unset;
    margin-right: 10px;
  }
  .recipient {
    width: 300px;
    border-image-repeat: unset;
    margin-right: 10px;
  }
</style>
