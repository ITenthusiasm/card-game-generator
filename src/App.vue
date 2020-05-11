<template>
  <div id="root">
    <div>{{ message }}</div>
    <form @submit.prevent="sendMessage">
      <input v-model="input" type="text" />
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",
  data() {
    return {
      message: "Hello World",
      input: "",
      webSocket: {} as WebSocket,
    };
  },
  mounted() {
    this.webSocket = new WebSocket("ws://localhost:3000");

    this.webSocket.addEventListener("open", function () {
      console.warn("Web Socket Connection opened!");
    });

    this.webSocket.addEventListener("message", function (msg) {
      console.warn("Message: ", msg.data);
    });
  },
  beforeDestroy() {
    this.webSocket.close();
  },
  methods: {
    sendMessage(): void {
      if (this.input.trim().length) {
        this.webSocket.send(this.input);
      }
      this.input = "";
    },
  },
});
</script>

<style>
#root {
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  color: blue;
}
</style>
