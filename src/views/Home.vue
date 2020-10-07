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
      if (this.playerName.trim().length) {
        this.$store.dispatch("openLobby", this.playerName);
        this.$router.push("/lobby");
      }
    },
    joinLobby(): void {
      const playerInfo = { playerName: this.playerName, lobbyId: this.lobbyId };

      if (this.playerName.trim().length) {
        this.$store.dispatch("joinLobby", playerInfo);
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
