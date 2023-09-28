<template>
  <div v-if="state.hasPendingTransfer" class="nes-container with-title is-rounded">
    <div class="title">Pending transfer</div>
    <table>
      <tr>
        <th>Amount</th><td>{{ amountInEther }} ETH</td>
      </tr>
      <tr>
        <th>Recipient</th><td>{{ recipient }}</td>
      </tr>
      <tr>
        <th>Initiator</th><td>{{ initiator }}</td>
      </tr>
      <tr>
        <td colspan="2">
          <TransferActions />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import {inject} from 'vue';
import TransferActions from './TransferActions.vue';

export default {
  components: {
    TransferActions
  },
  data() {
    return {
      amount: 0.0,
      recipient: null,
      initiator: null
    };
  },
  methods: {
    async updatePendingTransaction() {
      [this.amount, this.recipient, this.initiator] = await Promise.all([
          this.sharedWallet.methods.pendingAmount().call(),
          this.sharedWallet.methods.pendingRecipient().call(),
          this.sharedWallet.methods.lastInitiator().call()
      ])
      this.state.hasPendingTransfer = this.amount > 0;
    }
  },
  computed: {
    amountInEther() {
      return this.web3.utils.fromWei(this.amount, 'ether');
    }
  },
  beforeMount() {
    this.sharedWallet = inject('sharedWallet');
    this.web3 = inject('web3');
    this.state = inject('state');
  },
  mounted() {
    this.updatePendingTransaction();
  }
}
</script>

<style>
  table {
    text-align: left;
  }

  td {
    padding: 0.5em 0;
    overflow-wrap: anywhere;
  }
</style>
