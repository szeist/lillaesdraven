<template>
  <div class="nes-container is-rounded with-title">
    <div class="title">Transaction in progress</div>
    <div class="message">
      <div class="nes-balloon from-left"><p>Your gold is being conjured! Seek the enchanted scroll <a :href="transactionUrl" target="_blank">{{ state.pendingTransaction }}</a> for the tale of your transaction.</p></div>
      <progress class="nes-progress is-success" :value="progressValue" max="100"></progress>
    </div>
  </div>
</template>

<script>
import {inject} from 'vue';

export default {
  data() {
    return {
      chainId: null,
      progressValue: 0,
      progressInterval: null
    };
  },
  computed: {
    transactionUrl() {
      if (this.chainId === '11155111') {
          return `https://sepolia.etherscan.io/tx/${this.state.pendingTransaction}`;
      } else {
          return `https://etherscan.io/tx/${this.state.pendingTransaction}`;
      }
    }
  },
  methods: {
    async _getLastBlockTime() {
      try {
          const latestBlock = await this.web3.eth.getBlock('latest');
          const previousBlock = await this.web3.eth.getBlock(latestBlock.number - 100n);
          return Number(latestBlock.timestamp - previousBlock.timestamp) / 100;
      } catch (error) {
          console.error('Error estimating completion time:', error);
          return 0;
      }
    },
    async _startProgressAnimation() {
      const estimatedTime = (await this._getLastBlockTime()) * 2 + 10;
      console.log('Estimated time:', estimatedTime);
      

      const updateInterval = estimatedTime * 1000 / 150;
      this.progressInterval = setInterval(() => {
        if (this.progressValue < 100) {
          this.progressValue += 1;
        } else {
          clearInterval(this.progressInterval);
        }
      }, updateInterval);
    }
  },
  async mounted() {
    this.chainId = await this.web3.currentProvider.networkVersion;
    this._startProgressAnimation();
  },
  beforeMount() {
    this.state = inject('state');
    this.web3 = inject('web3');
  }
}
</script>

<style scoped>
  .message {
    background: url(../assets/wizard.png) no-repeat;
    padding-left: 160px;
    height: 240px;
    word-wrap: break-word;
  }

  .message p {
    overflow-wrap: anywhere;
    overflow-y: auto;
    max-height: 120px;
  }

  .title {
    font-size: 2em;
  }

  progress {
    margin-top: 30px;
    height: 30px;
  }

</style>
