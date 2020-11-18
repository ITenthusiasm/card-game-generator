<template>
  <form align="center">
    <label class="input-label" for="name">Player Name</label>
    <BaseInput id="name" v-model="playerName" />

    <label class="input-label" for="lobby">Lobby Passcode</label>
    <BaseInput id="lobby" v-model="lobbyId" />

    <br />
    <BaseButton type="button" @click="openLobby">Create Lobby</BaseButton>
    <BaseButton type="button" @click="joinLobby">Join Lobby</BaseButton>
  </form>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  data() {
    return {
      playerName: "",
      lobbyId: "",
    };
  },
  methods: {
    openLobby(): void {
      const playerName = this.playerName.trim();

      if (playerName.length) {
        this.$store.dispatch("openLobby", playerName);
        this.$router.push("/lobby");
      }
    },
    joinLobby(): void {
      const playerName = this.playerName.trim();
      const lobbyId = this.lobbyId.trim();

      if (playerName.length && lobbyId.length) {
        this.$store.dispatch("joinLobby", { playerName, lobbyId });
        this.$router.push("/lobby");
      }
    },
  },
});
</script>

<style scoped>
.input-label {
  display: block;
}
</style>
