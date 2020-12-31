<template>
  <div class="lobby-form">
    <div class="form-section">
      <label class="input-label" for="name">Player Name</label>
      <BaseInput id="name" v-model="playerName" />
    </div>

    <div class="form-section">
      <label class="input-label" for="lobby">Lobby Passcode</label>
      <BaseInput id="lobby" v-model="lobbyId" />
    </div>

    <div class="form-section">
      <BaseButton type="button" @click="openLobby">Create Lobby</BaseButton>
      <BaseButton type="button" @click="joinLobby">Join Lobby</BaseButton>
    </div>
  </div>
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

.lobby-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-section {
  margin: 0.5rem 0;
  width: 220px; /* Ensures all pieces of the "form" are wide enough to have the same left-alignment */
}
</style>
