<template>
  <div>
    <button class="nes-btn is-success" @click="approveTransfer">Approve</button>
    <button class="nes-btn is-error" @click="cancelTransfer">Cancel</button>
  </div>
</template>

<script>
import {inject} from 'vue';

export default {
  methods: {
    async approveTransfer() {
      const encodedCall = this.sharedWallet.methods.approveTransfer().encodeABI();
      const tx = {
        from: this.state.selectedAccount,
        to: this.sharedWallet.options.address,
        data: encodedCall,
      };
      this._sentTransaction(tx);
    },
    async cancelTransfer() {
      const encodedCall = this.sharedWallet.methods.cancelTransfer().encodeABI();
      const tx = {
        from: this.state.selectedAccount,
        to: this.sharedWallet.options.address,
        data: encodedCall,
      };
      this._sentTransaction(tx);
    },
    async _sentTransaction(tx) {
      try { 
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
          });
      } catch (error) {
        this.state.error = error;
        this.state.pendingTransaction = null;
        console.error('Error estimating gas:', error);
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
  button.is-success {
    margin-right: 15px;
  }
</style>
