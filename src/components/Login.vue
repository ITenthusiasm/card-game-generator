<template>
  <form @submit.prevent="sendPlayerInfo">
    <label class="input-label" for="name">Player Name</label>
    <input id="name" v-model="playerName" class="text-box" type="text" />
  </form>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Login",
  data() {
    return {
      playerName: "",
    };
  },
  methods: {
    sendPlayerInfo(): void {
      if (this.playerName.trim().length) {
        this.$store.dispatch("addNewPlayer", this.playerName);
      }

      this.playerName = "";
    },
  },
});
</script>

<style scoped>
.input-label {
  display: block;
}

.text-box {
  font-size: 1rem;
  background: white;
  border: 2px solid #42424242;
  border-radius: 5px;
  display: inline-block;
  margin: 0.75rem 0rem;
  padding: 0.75rem;
}

.text-box:focus {
  border-color: #2188ff;
  outline: none;
  box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075),
    0 0 0 0.2em rgba(3, 102, 214, 0.3);
}
</style>
