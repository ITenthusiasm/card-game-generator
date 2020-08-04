<template>
  <div v-if="player">
    <GameSelection />
    <div v-if="selectedGame">
      <form @submit.prevent="updatePlayerInfo">
        <label for="team">Team</label>
        <BaseSelect id="team" v-model="playerTeam">
          <option value="" disabled>Select a team</option>
          <option value="Red">Red</option>
          <option value="Blue">Blue</option>
        </BaseSelect>

        <label for="role">Role</label>
        <BaseSelect id="role" v-model="playerRole">
          <option value="" disabled>Choose a role</option>
          <option value="Codemaster">Codemaster</option>
          <option value="Agent">Agent</option>
        </BaseSelect>

        <button type="submit">Send Player Data</button>
      </form>
    </div>
    <button class="button" @click="startGame">start game</button>
    <button class="button" @click="resetGame">new game</button>
    <Codenames v-if="gameState.status && gameState.status !== 'Inactive'" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import GameSelection from "@/components/GameSelection.vue";
import Codenames from "@/components/Codenames.vue";

export default Vue.extend({
  name: "Lobby",
  components: { GameSelection, Codenames },
  data() {
    return {
      playerTeam: "",
      playerRole: "",
    };
  },
  computed: mapState(["player", "selectedGame", "gameState"]),
  methods: {
    updatePlayerInfo(): void {
      const playerInfo = { team: this.playerTeam, role: this.playerRole };

      this.$store.dispatch("updatePlayer", playerInfo);
    },
    startGame(): void {
      this.$store.dispatch("startGame");
    },
    resetGame(): void {
      this.$store.dispatch("resetGame");
    },
  },
});
</script>

<style scoped>
.button {
  min-height: 2rem;
  background-color: red;
  border: 2px solid #42424242;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  color: white;
  font-size: 1rem;
  outline: none;
  padding: 0.5rem;
  text-align: center;
}

.button:hover {
  cursor: pointer;
}
</style>
