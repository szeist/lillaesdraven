<template>
  <div v-if="!this.state.error" class="app" >
    <PendingTransaction v-if="state.pendingTransaction" />
    <div v-if="!this.state.pendingTransaction">
      <div class="header">
        <img src="./assets/queen.png" />
        <h1>Treasury</h1>
        <img src="./assets/knight.png" />
      </div>
      <ContractBalance />
      <div class="account">{{ this.state.selectedAccount }}</div>
      <ContractDeposit v-if="!state.hasPendingTransfer" />
      <InitiateTransfer />
      <PendingTransfer />
    </div>
  </div>
  <ErrorState />
</template>

<script>
import {inject} from 'vue';
import PendingTransaction from './components/PendingTransaction.vue'
import ContractDeposit from './components/ContractDeposit.vue'
import InitiateTransfer from './components/InitiateTransfer.vue'
import ContractBalance from './components/ContractBalance.vue'
import PendingTransfer from './components/PendingTransfer.vue'
import ErrorState from './components/ErrorState.vue'

export default {
  name: 'App',
  components: {
    PendingTransaction,
    ContractDeposit,
    InitiateTransfer,
    ContractBalance,
    PendingTransfer,
    ErrorState
  },
  beforeMount() {
    this.state = inject('state');
  }
}
</script>

<style>
  body {
    background: url('./assets/background.png') no-repeat center center fixed;
    background-size: contain;
    background-color: #e5f7f7;
    overflow: hidden;
  }

  .app .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }

  .header h1 {
    margin: 0 20px;
  }

  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .app {
    max-width: 840px;
    background: rgba(92, 148, 252, 0.4);
    padding: 15px;
  }

  .app div {
    margin: 0.5rem 0;
  }

  .account {
    background: url(./assets/castle.png) no-repeat;
    height: 32px;
    line-height: 32px;
    padding-left: 40px;
    padding-top: 5px;
    margin-left: 5px;
    margin-bottom: 15px;
  }
</style>
