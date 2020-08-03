<template>
  <form align="center" @submit.prevent="sendPlayerInfo">
    <label class="input-label" for="name">Player Name</label>
    <BaseInput id="name" v-model="playerName" />
  </form>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  data() {
    return {
      playerName: "",
    };
  },
  methods: {
    sendPlayerInfo(): void {
      if (this.playerName.trim().length) {
        this.$store.dispatch("addNewPlayer", this.playerName);
        this.$router.push("/lobby");
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
</style>
