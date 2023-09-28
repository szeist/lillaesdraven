<template>
  <h3><a :href="'https://etherscan.io/address/' + sharedWallet.options.address" target="_blank"><i class="nes-icon coin is-medium"></i>Balance: {{ state.balance }} ETH (~ {{ balanceHUF }} HUF)</a></h3>
</template>

<script>
import {inject} from 'vue';

export default {
  data() {
    return {
      balanceHUF: '0',
    };
  },
  methods: {
    async updateContractBalance() {
      try {
        const balance = await this.web3.eth.getBalance(this.sharedWallet.options.address);
        this.state.balance = parseFloat(this.web3.utils.fromWei(balance, 'ether'));
        this.balanceHUF = Math.round(this.state.balance * await this._fetchETHPriceInHUF());
      } catch (error) {
        this.state.error = error.message;
        console.error("Error fetching contract balance:", error);
      }
    },
    async _fetchETHPriceInHUF() {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=huf');
        const data = await response.json();
        return data.ethereum.huf;
      } catch (error) {
        console.error("Error fetching ETH price:", error);
        return 0;
      }
    },
  },
  beforeMount() {
    this.sharedWallet = inject('sharedWallet');
    this.web3 = inject('web3');
    this.state = inject('state');
  },
  mounted() {
    this.updateContractBalance();
  }
}
</script>

<style scoped>
  a {
    color: #212529;
    text-decoration: none;
  }

  a i.nes-icon {
    vertical-align: middle;
    margin-right: 40px;
  }
</style>
