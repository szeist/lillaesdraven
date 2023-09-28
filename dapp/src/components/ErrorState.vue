<template>
  <div v-if="state.error" class="error nes-container is-rounded">
    <div class="title">Error</div>
    <div class="message">
      <div class="nes-balloon from-left">
        <p>{{ state.error }}</p>
      </div>
      <div><button @click="reload()" class="nes-btn is-primary">Close</button></div>
      </div>
  </div>
</template>

<script>
import {inject} from 'vue';

export default {
  methods: {
    reload() {
      window.location.reload();
    }
  },
  beforeMount() {
    this.state = inject('state');
  }
}
</script>

<style scoped>
  .error {
    background: rgba(255, 0, 0, 0.3);
    max-width: 830px;
    padding: 15px;
  }

  .message {
    background: url(../assets/zombie.png) no-repeat;
    padding-left: 160px;
    min-height: 240px;
  }

  .message p {
    overflow-wrap: anywhere;
    overflow-y: auto;
    max-height: 110px;
  }

  .title {
    font-size: 2em;
    margin-bottom: 15px;
    color: red;
    animation: blink 1s steps(1, end) infinite;
  }

  button {
    position: absolute;
    bottom: 15px;
    right: 15px;
  }

  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

</style>
