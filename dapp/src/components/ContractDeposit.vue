<template>
  <div>
    <input type="number" step="0.000001" v-model="amount" placeholder="Amount in ETH" class="nes-input amount" />
    ETH
    <button @click="deposit" :disabled="amount <= 0" class="nes-btn" :class="{'is-disabled': amount <= 0}">Deposit</button>
  </div>
</template>

<script>
import {inject} from 'vue';

export default {
  data() {
    return {
      amount: 0,
      pendingTransactionHash: null,
      checkInterval: null
    };
  },
  methods: {
    async deposit() {
      const from = this.state.selectedAccount;
      const amount = this.web3.utils.toWei(this.amount, 'ether');
      try {
        const estimateGas = await this.sharedWallet.methods.deposit().estimateGas({ from: from, value: amount });
        this.sharedWallet.methods.deposit().send({ from: from, value: amount, gasLimit: estimateGas + 2000n })
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
          }).catch((error) => {
            this.state.error = error;
            this.state.pendingTransaction = null;
            console.error('Error sending transaction:', error);
          })
      } catch(error) {
        this.state.error = error;
        this.state.pendingTransaction = null;
        console.error('Error sending transaction:', this.state.error);
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
  }
</style>

